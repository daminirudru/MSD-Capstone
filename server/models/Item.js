import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    tags: [{ type: String }],
    imageUrl: { type: String, default: '' },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Item', itemSchema);
