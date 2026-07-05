import Order from '../models/Order.js';
import { initiatePayment } from '../services/payment/flutterwave.js';

export const createOrder = async (req, res) => {
    try {
        // 1. Create the order record in your database first
        const { items, totalAmount, sellerId } = req.body;
        const tx_ref = "TRP_" + Date.now(); // Unique reference for TrustPay

        const newOrder = await Order.create({
            buyer: req.user._id,
            seller: sellerId,
            items,
            totalAmount,
            reference: tx_ref,
            status: 'pending'
        });

        // 2. Prepare payment details using the database reference
        const paymentDetails = {
            tx_ref: tx_ref,
            amount: totalAmount,
            currency: "NGN",
            redirect_url: "http://localhost:3000/success",
            customer: { email: req.user.email }
        };

        // 3. Initiate payment via Flutterwave
        const result = await initiatePayment(paymentDetails);
        
        // 4. Return the payment link to the frontend
        res.status(201).json({ 
            order: newOrder, 
            paymentUrl: result.data.link 
        });
    } catch (error) {
        console.error("Payment Initiation Error:", error);
        res.status(500).json({ error: "Failed to initiate payment" });
    }
};