import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ROLES } from '../utils/roles.js';

const router = express.Router();

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });
    const user = await User.create({ name, email, password, role: role || ROLES.USER });
    const token = signToken(user._id, user.role);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await user.matchPassword(password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    if (role && user.role !== role) {
      return res.status(403).json({ message: `This account is not registered as ${role}` });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ message: 'Login failed' });
  }
});


export default router;
