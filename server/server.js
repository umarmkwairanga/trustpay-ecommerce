import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import crypto from 'crypto';

// Import Models and Services (using ../ to go up from /server to root)
import Escrow from '../models/Escrow.js'; 
import { sendPaymentNotification } from '../services/emailService.js';

// Import Routes (using ../ to go up from /server to root)
import authRoutes from '../routes/authRoutes.js';
import orderRoutes from '../routes/orderRoutes.js';
import paymentRoutes from '../routes/paymentRoutes.js';
import escrowRoutes from '../routes/escrow.js';

const app = express();

app.use(cors());
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/TrustPay?directConnection=true&serverSelectionTimeoutMS=2000')
  .then(() => console.log("Successfully Connected to MongoDB Database: TrustPay"))
  .catch(err => console.error("Connection failed:", err));

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/escrow', escrowRoutes);

// Webhook Route
app.post('/api/flutterwave/webhook', async (req, res) => {
    const signature = req.headers["verif-hash"];

    if (!signature) {
        return res.status(401).send("No signature found");
    }

    const secretHash = process.env.FLW_SECRET_HASH;
    if (signature !== secretHash) {
        return res.status(401).send("Invalid signature");
    }

    const payload = req.body;

    try {
        if (payload.event === 'charge.completed') {
            const { tx_ref, status } = payload.data;

            if (status === 'successful') {
                const updatedEscrow = await Escrow.findOneAndUpdate(
                    { tx_ref: tx_ref }, 
                    { status: 'Funded' },
                    { new: true }
                );

                if (updatedEscrow) {
                    console.log(`Escrow successfully funded for ref: ${tx_ref}`);
                    await sendPaymentNotification(updatedEscrow.sellerEmail, tx_ref);
                    console.log(`Notification email sent to: ${updatedEscrow.sellerEmail}`);
                } else {
                    console.warn(`Escrow not found for tx_ref: ${tx_ref}`);
                }
            }
        }
        
        res.status(200).send("Webhook received");
    } catch (error) {
        console.error("Webhook processing error:", error);
        res.status(500).send("Internal server error");
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));