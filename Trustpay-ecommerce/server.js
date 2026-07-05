import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dns from 'node:dns/promises';

// Standard static imports (Ensure these files exist in the same /server directory)
import Escrow from './models/Escrow.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import escrowRoutes from './routes/escrow.js';
import { sendPaymentNotification } from './emailService.js';

async function startServer() {
    try {
        console.log("Resolving MongoDB hostname...");
        const host = "cluster0.qcsvwc2.mongodb.net";
        const addresses = await dns.lookup(host);
        console.log("Resolved IP:", addresses.address);
    } catch (err) {
        console.warn("DNS lookup failed, proceeding with standard driver resolution...");
    }

    const app = express();
    app.use(cors());
    app.use(express.json({
        verify: (req, res, buf) => {
            req.rawBody = buf;
        }
    }));

    // Register Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/payment', paymentRoutes);
    app.use('/api/escrow', escrowRoutes);

    // Webhook Route
    app.post('/api/flutterwave/webhook', async (req, res) => {
        const signature = req.headers["verif-hash"];
        if (!signature || signature !== process.env.FLW_SECRET_HASH) {
            return res.status(401).send("Invalid or missing signature");
        }

        try {
            const payload = req.body;
            if (payload.event === 'charge.completed' && payload.data.status === 'successful') {
                const { tx_ref } = payload.data;
                const updatedEscrow = await Escrow.findOneAndUpdate(
                    { tx_ref }, 
                    { status: 'Funded' },
                    { new: true }
                );
                
                if (updatedEscrow) {
                    await sendPaymentNotification(updatedEscrow.sellerEmail, tx_ref);
                }
            }
            res.status(200).send("Webhook received");
        } catch (error) {
            console.error("Webhook processing error:", error);
            res.status(500).send("Internal server error");
        }
    });

    const dbUri = process.env.MONGODB_URI;
    const PORT = process.env.PORT || 5000;

    mongoose.connect(dbUri, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        family: 4,
        tls: true,
        tlsAllowInvalidCertificates: true 
    })
    .then(() => {
        console.log("Successfully connected to MongoDB.");
        app.listen(PORT, () => console.log(`Server is live at http://localhost:${PORT}`));
    })
    .catch(err => {
        console.error("Connection failed:", err.message);
        process.exit(1);
    });
}

startServer();