import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES } from '../utils/roles.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.USER },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enterPwd) {
  return bcrypt.compare(enterPwd, this.password);
};

export default mongoose.model('User', userSchema);
