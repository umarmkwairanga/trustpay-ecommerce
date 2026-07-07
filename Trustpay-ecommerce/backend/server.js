import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import http from 'http';
import { Server } from 'socket.io';

// Import Models
import Product from './models/Product.js'; 
import Transaction from './models/Transaction.js';

// Import Routes
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import ceoRoutes from './routes/ceoRoutes.js'; // NEW

// Import Middleware
import { protect, authorizeCEO } from './middleware/auth.js'; // NEW

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
    cors: { origin: process.env.CLIENT_URL || "http://localhost:5173", methods: ["GET", "POST"] }
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// Middleware Setup
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage: storage });

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests, please try again later."
});

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- SOCKET.IO ---
io.on('connection', (socket) => {
    socket.on('update-rider-location', (data) => {
        io.emit(`location-update-${data.orderId}`, { lat: data.lat, lng: data.lng });
    });
});

// --- FLUTTERWAVE WEBHOOK ---
app.post('/api/flutterwave/webhook', async (req, res) => {
    try {
        const signature = req.headers['verif-hash'];
        if (!signature || signature !== process.env.FLW_SECRET_HASH) return res.status(401).send('Unauthorized');
        
        const payload = req.body;
        if (payload.event === 'charge.completed' && payload.data.status === 'successful') {
            await Transaction.findOneAndUpdate({ reference: payload.data.tx_ref }, { status: 'HELD' });
        }
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
});

// --- API ROUTES ---
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ceo', protect, authorizeCEO, ceoRoutes); // PROTECTED CEO ROUTE

app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.post('/api/products', upload.single('image'), async (req, res) => {
    const { name, price, category, stock, description } = req.body;
    const newProduct = new Product({ name, price, category, stock, description, imagePath: req.file?.path });
    const savedProduct = await newProduct.save();
    res.status(201).json({ message: 'Product added!', product: savedProduct });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`TrustPay Server running on port ${PORT}`));