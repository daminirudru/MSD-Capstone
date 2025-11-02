import express from 'express';
import Order from '../models/Order.js';
import Item from '../models/Item.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../utils/roles.js';

const router = express.Router();

// Create order (user)
router.post('/', protect, async (req, res) => {
  try {
    const { items } = req.body; // [{ item, qty, name?, price? }]
    if (!items?.length) {
      return res.status(400).json({ message: 'No items provided' });
    }

    // separate valid ObjectIds vs custom/default ones
    const validIds = items
      .map(i => i.item)
      .filter(id => /^[a-fA-F0-9]{24}$/.test(id));

    let docs = [];
    if (validIds.length) {
      docs = await Item.find({ _id: { $in: validIds } });
    }

    // Create a map of DB items
    const priceMap = Object.fromEntries(
      docs.map(d => [String(d._id), { price: d.price, name: d.name }])
    );

    // Compute total, supporting both DB and non-DB items
    const total = items.reduce((sum, i) => {
      let price = 0;

      if (priceMap[i.item]) {
        price = priceMap[i.item].price;
      } else if (i.price) {
        price = i.price; // fallback for frontend default items
      }

      return sum + price * (i.qty || 1);
    }, 0);

    // Normalize order items so they store consistent info
    const orderItems = items.map(i => ({
      item: priceMap[i.item] ? i.item : null, // null for fake/default items
      name: priceMap[i.item]?.name || i.name || 'Unknown',
      price: priceMap[i.item]?.price || i.price || 0,
      qty: i.qty || 1,
    }));

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      total,
    });

    res.status(201).json({ _id: order._id, total });
  } catch (err) {
    console.error('Order creation failed:', err);
    res.status(500).json({ message: 'Server error while placing order' });
  }
});


// Get my orders (user)
router.get('/mine', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('items.item', 'name price')
    .sort({ createdAt: -1 });
  res.json(orders);
});

// Admin: list all + update status
router.get('/', protect, authorize(ROLES.ADMIN), async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').populate('items.item', 'name');
  res.json(orders);
});

router.patch('/:id/status', protect, authorize(ROLES.ADMIN), async (req, res) => {
  const { status } = req.body;
  const allowed = ['placed', 'preparing', 'ready', 'completed'];
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Bad status' });
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(order);
});

export default router;
