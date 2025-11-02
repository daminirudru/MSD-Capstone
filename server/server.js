import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';
import orderRoutes from './routes/orders.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cafeteria';
await connectDB(MONGODB_URI);

app.get('/', (req, res) => res.send('Cafeteria API running'));
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
