const express = require('express');
const app = express();
const connectDB = require('./config/db'); // Your database connection
const productRoutes = require('./routes/productRoutes'); // The new routes

// Middleware to parse incoming data
app.use(express.json());

// Connect to MongoDB
connectDB();

// Register the product routes
app.use('/api/products', productRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`TrustPayEcommerce server running on port ${PORT}`);
});