import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import escrowRoutes from '../routes/escrowRoutes.js'; 
import authRoutes from '../routes/authRoutes.js'; 
import productRoutes from '../routes/productRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Your Routes
app.use('/api/escrow', escrowRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => res.send('TrustPay API is running...'));

// Connect DB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("DB Error:", err));

// REMOVE app.listen() - Vercel does this for you!

export default app; // This is the most important line