import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import escrowRoutes from './routes/escrowRoutes.js'; 
import authRoutes from './routes/authRoutes.js'; 
import productRoutes from './routes/productRoutes.js';
import advertisementRoutes from './routes/advertisementRoutes.js';

const app = express();

app.use(cors({
    origin: [
        process.env.CLIENT_URL,
        'https://TrustPayEcommerce-ecommerce.vercel.app',
        'http://localhost:5173'
    ].filter(Boolean),
    credentials: true
}));

app.use(express.json());

// Your Routes
app.use('/api/escrow', escrowRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/advertisements', advertisementRoutes);

app.get('/', (req, res) => res.send('TrustPayEcommerce API is running...'));

// Connect DB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("DB Error:", err));

export default app;