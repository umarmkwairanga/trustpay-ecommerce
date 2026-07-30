import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Strict Environment Check
if (!process.env.MONGODB_URI) {
    console.error("FATAL ERROR: MONGODB_URI is not set in environment variables.");
    process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- DYNAMIC ROUTE LOADING (DEBUG VERSION) ---
const loadRoutes = async () => {
    // List of all your route files
    const routes = [
        { name: 'Product Routes', path: './routes/productRoutes.js' },
        { name: 'User Routes', path: './routes/userRoutes.js' },
        { name: 'Order Routes', path: './routes/orderRoutes.js' },
        { name: 'Bank Routes', path: './routes/bankRoutes.js' },
        { name: 'Booking Routes', path: './routes/bookingRoutes.js' },
        { name: 'Partner Routes', path: './routes/partnerRoutes.js' }
    ];

    const loadedRoutes = {};

    for (const route of routes) {
        try {
            // Try to load this specific file
            const imported = await import(route.path);
            loadedRoutes[route.name] = imported.default;
            console.log(`✅ Successfully loaded: ${route.name}`);
        } catch (err) {
            // If it crashes, this will tell you exactly which file is broken!
            console.error(`\n❌ CRASHED WHILE LOADING: ${route.name} (${route.path})`);
            console.error(`👉 THE ERROR IN THIS FILE IS:`, err.message);
            console.error(`\nFull Error Details below:`);
            console.error(err);
            process.exit(1);
        }
    }

    // Mounting Routes
    app.use('/api/products', loadedRoutes['Product Routes']);
    app.use('/api/users', loadedRoutes['User Routes']);
    app.use('/api/orders', loadedRoutes['Order Routes']);
    app.use('/api/bank', loadedRoutes['Bank Routes']);
    app.use('/api/bookings', loadedRoutes['Booking Routes']);
    app.use('/api/partners', loadedRoutes['Partner Routes']);
    
    console.log("\n🚀 All routes mounted successfully!");
};

app.get('/', (req, res) => res.send('TrustPay API is running...'));

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB successfully!");
    } catch (err) {
        console.error("CRITICAL DB CONNECTION ERROR:", err);
        process.exit(1); 
    }
};

// Start the sequence
connectDB().then(async () => {
    await loadRoutes();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

export default app;