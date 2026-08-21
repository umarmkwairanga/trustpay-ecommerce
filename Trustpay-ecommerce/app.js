import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // Ensure file extensions match your project setup
import productRoutes from './routes/productRoutes.js';
import bookingInventoryRoutes from './routes/bookingInventoryRoutes.js';

// New Provider & Marketplace Routes
import categoryRequestRoutes from './routes/categoryRequestRoutes.js';
import providerListingRoutes from './routes/providerListingRoutes.js';
import adminProviderRoutes from './routes/adminProviderRoutes.js';

dotenv.config();

const app = express();

// Middleware to parse incoming JSON data
app.use(express.json());

// Connect to MongoDB
connectDB();

// Register existing application routes
app.use('/api/products', productRoutes);
app.use('/api/business/inventory', bookingInventoryRoutes);
app.use('/api/bookings', bookingInventoryRoutes); // Enables public search at /api/bookings/search

// Register new multi-vertical provider and administrative routes
app.use('/api/categories', categoryRequestRoutes);
app.use('/api/providers', providerListingRoutes);
app.use('/api/admin', adminProviderRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`TrustPayEcommerceEcommerce server running on port ${PORT}`);
});