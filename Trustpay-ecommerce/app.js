import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // Ensure file extensions match your project setup
import productRoutes from './routes/productRoutes.js';
import bookingInventoryRoutes from './routes/bookingInventoryRoutes.js';

dotenv.config();

const app = express();

// Middleware to parse incoming JSON data
app.use(express.json());

// Connect to MongoDB
connectDB();

// Register application routes
app.use('/api/products', productRoutes);
app.use('/api/business/inventory', bookingInventoryRoutes);
app.use('/api/bookings', bookingInventoryRoutes); // Enables public search at /api/bookings/search

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`TrustPayEcommerce server running on port ${PORT}`);
});