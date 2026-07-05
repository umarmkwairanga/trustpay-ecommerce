// --- CRITICAL: Initialize dotenv at the very top ---
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import axios from 'axios';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, '.env') });

// --- Imports ---
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import mongoose from 'mongoose';
import { rateLimit } from 'express-rate-limit'; 

import Product from './models/Product.js'; 
import Order from './models/Order.js'; 
import Task from './models/Task.js'; 
import User from './models/User.js'; 

import authRoutes from './routes/authRoutes.js';
import { protect, restrictTo } from './middleware/authMiddleware.js'; 
import { errorHandler } from './middleware/errorMiddleware.js'; 
import { generateProductDescription, analyzeFraudRisk } from './aiService.js';
import { sendTransactionEmail } from './emailService.js';

const app = express();

// --- Middleware ---
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const aiLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: "AI limit reached." });

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use('/api/', apiLimiter);
app.use('/api/ai/', aiLimiter);

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Database ---
const uri = process.env.MONGODB_URI;
mongoose.connect(uri.trim())
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((err) => { console.error("DB Connection Error:", err.message); process.exit(1); });

// --- Routes ---
app.use('/api/auth', authRoutes);

// --- Payment (Paystack) ---
app.post('/api/initialize-payment', protect, async (req, res) => {
    try {
        const { totalAmount, email } = req.body;
        const response = await axios.post('https://api.paystack.co/transaction/initialize', {
            email,
            amount: Math.round(totalAmount * 100), 
            currency: 'NGN'
        }, {
            headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to initialize payment" });
    }
});

app.post('/api/webhook/paystack', async (req, res) => {
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest('hex');
    if (hash === req.headers['x-paystack-signature']) {
        const event = req.body;
        if (event.event === 'charge.success') {
            await Order.findOneAndUpdate({ reference: event.data.reference }, { status: 'paid' });
        }
    }
    res.sendStatus(200);
});

// --- Product & Order Management ---
app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Admin Route: Get all orders
app.get('/api/admin/orders', protect, restrictTo('admin'), async (req, res) => {
    try {
        const orders = await Order.find().populate('buyer', 'username email');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching orders" });
    }
});

// Admin Route: Resolve a Dispute
app.patch('/api/admin/orders/:id/resolve', protect, restrictTo('admin'), async (req, res) => {
    try {
        const { resolutionNote } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { 
                status: 'completed', 
                disputeNotes: resolutionNote,
                resolvedAt: Date.now() 
            },
            { new: true }
        );
        res.json({ message: "Dispute resolved successfully.", order });
    } catch (err) {
        res.status(500).json({ message: "Error resolving dispute" });
    }
});

app.post('/api/admin/products', protect, restrictTo('admin', 'seller'), async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
});

app.get('/api/orders', protect, async (req, res) => {
    const orders = await Order.find({ buyer: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
});

app.post('/api/orders', protect, async (req, res) => {
    const { items, totalAmount, reference } = req.body;
    const fraudAnalysis = await analyzeFraudRisk({ items, totalAmount, buyer: req.user._id });
    const newOrder = new Order({ 
        buyer: req.user._id, items, totalAmount, reference,
        status: fraudAnalysis.riskScore > 70 ? 'flagged' : 'pending',
        riskScore: fraudAnalysis.riskScore
    });
    await newOrder.save();
    res.status(201).json(newOrder);
});

app.patch('/api/orders/:id/confirm', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('buyer');
        if (!order || order.buyer._id.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: "Order not found" });
        }
        
        const commissionRate = 0.05;
        order.commission = order.totalAmount * commissionRate;
        order.status = 'completed';
        
        await order.save();

        await sendTransactionEmail(
            order.buyer.email, 
            "Transaction Completed", 
            `Your transaction ${order._id} is complete. Your funds have been released securely.`
        );
        
        res.json({ message: "Delivery confirmed, commission calculated, and email sent.", commission: order.commission });
    } catch (err) {
        res.status(500).json({ message: "Error confirming delivery" });
    }
});

// --- AI & Stats ---
app.post('/api/ai/generate-description', protect, restrictTo('seller', 'admin'), async (req, res) => {
    const description = await generateProductDescription(req.body.productDetails);
    res.json({ description });
});

// --- Admin Analytics & Reporting ---
app.get('/api/admin/analytics', protect, restrictTo('admin'), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const verifiedUsers = await User.countDocuments({ isVerified: true });
        const orders = await Order.find();
        
        const totalTransactions = orders.length;
        const grossTransactionValue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const totalCommission = orders.reduce((sum, order) => sum + (order.commission || 0), 0);
        const pendingDisputes = await Order.countDocuments({ status: 'flagged' });

        res.json({
            totalUsers,
            verifiedUsers,
            totalTransactions,
            grossTransactionValue,
            totalCommission,
            pendingDisputes
        });
    } catch (err) {
        console.error("Analytics Error:", err);
        res.status(500).json({ message: "Error fetching platform analytics" });
    }
});

app.patch('/api/admin/users/:id/verify', protect, restrictTo('admin'), async (req, res) => {
    try {
        const { isVerified, kycStatus } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id, 
            { isVerified, kycStatus }, 
            { new: true }
        );
        res.json({ message: "User status updated", user });
    } catch (err) {
        res.status(500).json({ message: "Failed to update verification status" });
    }
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));