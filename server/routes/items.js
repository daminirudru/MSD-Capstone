import express from 'express';
import Item from '../models/Item.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../utils/roles.js';

const router = express.Router();
router.get('/', async (req, res) => {
  const { q } = req.query;
  const filter = q
    ? {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { tags: { $elemMatch: { $regex: q, $options: 'i' } } },
        ],
      }
    : {};
  const items = await Item.find(filter).sort({ createdAt: -1 });
  res.json(items);
});

router.post('/', protect, authorize(ROLES.ADMIN), async (req, res) => {
  const { name, price, tags, imageUrl, available } = req.body;
  const item = await Item.create({ name, price, tags, imageUrl, available });
  res.status(201).json(item);
});

router.put('/:id', protect, authorize(ROLES.ADMIN), async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

router.delete('/:id', protect, authorize(ROLES.ADMIN), async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
