import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- DYNAMIC ROUTE LOADING ---
// Instead of importing at the top, we will load them manually 
// so the server doesn't crash if a path is slightly off.
const loadRoutes = async () => {
    try {
        // Change './routes/...' to match EXACTLY where your files are
        // If your files are in the root, use './productRoutes.js'
        const productRoutes = (await import('./routes/productRoutes.js')).default;
        const userRoutes = (await import('./routes/userRoutes.js')).default;
        const orderRoutes = (await import('./routes/orderRoutes.js')).default;

        app.use('/api/products', productRoutes);
        app.use('/api/users', userRoutes);
        app.use('/api/orders', orderRoutes);
        console.log("Routes loaded successfully.");
    } catch (err) {
        console.error("Error loading routes: Ensure the files exist in the 'routes' folder.");
        console.error(err.message);
    }
};

app.get('/', (req, res) => res.send('TrustPay API is running...'));

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB successfully!");
    } catch (err) {
        console.error("DB Connection Error:", err.message);
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