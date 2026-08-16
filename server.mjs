import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import escrowRoutes from './routes/escrowRoutes.js';
import advertisementRoutes from './routes/advertisementRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: [
        process.env.CLIENT_URL,
        'https://trustpay-ecommerce.vercel.app',
        'http://localhost:5173'
    ].filter(Boolean),
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/advertisements', advertisementRoutes);

app.get('/', (req, res) => res.send('TrustPay API is running...'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.error("DB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;