import { initiatePayment } from '../services/payment/flutterwave.js';
import Order from '../models/Order.js';
import Escrow from '../models/Escrow.js';
import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';

export const createOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, email, items, shippingAddress, sellerId } = req.body;
        const buyerId = req.user?.id; // Assumes auth middleware populates req.user

        if (!amount || !email || !items || items.length === 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: 'Missing required order fields or items.' });
        }

        const tx_ref = "TXN_" + Date.now() + "_" + Math.floor(Math.random() * 1000);

        // 1. Create the Pending Order in Database
        const newOrder = await Order.create([{
            buyer: buyerId,
            seller: sellerId || items[0].seller,
            items,
            totalAmount: amount,
            shippingAddress,
            paymentStatus: 'PENDING',
            orderStatus: 'PENDING'
        }], { session });

        const orderId = newOrder[0]._id;

        // 2. Initialize corresponding Transaction record for Idempotency tracking
        await Transaction.create([{
            user: buyerId,
            reference: tx_ref,
            amount,
            currency: "NGN",
            status: "PENDING",
            gateway: "flutterwave",
            metadata: { orderId }
        }], { session });

        // 3. Initialize corresponding Escrow record (TrustPayEcommerce Core System)
        await Escrow.create([{
            buyer: buyerId,
            seller: sellerId || items[0].seller,
            order: orderId,
            amount,
            currency: "NGN",
            transactionReference: tx_ref,
            escrowStatus: "PENDING",
            paymentStatus: "PENDING"
        }], { session });

        // 4. Prepare payload for Flutterwave service call
        const details = {
            tx_ref,
            amount,
            currency: "NGN",
            redirect_url: process.env.FLUTTERWAVE_CALLBACK_URL || "http://localhost:3000/success",
            customer: { email },
            meta: { orderId }
        };

        const paymentResult = await initiatePayment(details);

        if (!paymentResult || (paymentResult.status && paymentResult.status !== 'success')) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: 'Failed to initialize payment gateway.' });
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            orderId,
            tx_ref,
            payment_link: paymentResult.data?.link || paymentResult.link
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Order Creation & Payment Initiation Error:", error);
        return res.status(500).json({ success: false, error: "Failed to create order and initiate payment." });
    }
};