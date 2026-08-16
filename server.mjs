import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import escrowRoutes from './routes/escrowRoutes.js';
import advertisementRoutes from './routes/advertisementRoutes.js';

import bookingInventoryRoutes from './routes/bookingInventoryRoutes.js';
import customerBookingRoutes from './routes/customerBookingRoutes.js';
import providerBookingRoutes from './routes/providerBookingRoutes.js';
import adminCeoBookingRoutes from './routes/adminCeoBookingRoutes.js';

dotenv.config();

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

// Connect directly to MongoDB
const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
mongoose.connect(uri)
    .then((conn) => console.log(`MongoDB Connected: ${conn.connection.host}`))
    .catch((error) => {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    });

// Register application routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/advertisements', advertisementRoutes);

// Booking, Inventory, Provider, Admin & CEO Routes
app.use('/api/business/inventory', bookingInventoryRoutes);
app.use('/api/bookings', bookingInventoryRoutes);           
app.use('/api/bookings', customerBookingRoutes);            
app.use('/api/provider/bookings', providerBookingRoutes);   
app.use('/api/admin', adminCeoBookingRoutes);               
app.use('/api/ceo', adminCeoBookingRoutes);                 

app.get('/', (req, res) => res.send('TrustPay API is running...'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`TrustPayEcommerce server running on port ${PORT}`);
});