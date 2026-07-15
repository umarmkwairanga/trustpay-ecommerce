import Order from '../models/Order.js';
import { initiatePayment } from '../../services/payment/flutterwave.js';

// 1. Create Order & Initiate Payment
export const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, sellerId } = req.body;
        const tx_ref = "TRP_" + Date.now(); 

        const newOrder = await Order.create({
            buyer: req.user._id,
            seller: sellerId,
            items,
            totalAmount,
            reference: tx_ref,
            status: 'pending'
        });

        const paymentDetails = {
            tx_ref: tx_ref,
            amount: totalAmount,
            currency: "NGN",
            redirect_url: process.env.PAYMENT_REDIRECT_URL || "https://trustpay.yourdomain.com/success",
            customer: { email: req.user.email, name: req.user.username }
        };

        const result = await initiatePayment(paymentDetails);
        if (!result || result.status !== 'success') throw new Error("Payment initiation failed");
        
        res.status(201).json({ order: newOrder, paymentUrl: result.data.link });
    } catch (error) {
        res.status(500).json({ error: "Failed to initiate payment", details: error.message });
    }
};

// 2. Fetch Payout Queue (Admin)
export const getPayoutQueue = async (req, res) => {
    try {
        const orders = await Order.find({ status: 'delivered' }).populate('buyer seller');
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching payout queue" });
    }
};

// 3. Release Payout (Admin)
export const releasePayout = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });
        order.status = 'paid';
        await order.save();
        res.status(200).json({ message: "Payout successful" });
    } catch (err) {
        res.status(500).json({ message: "Error releasing payout" });
    }
};

// 4. Flutterwave Webhook
export const flutterwaveWebhook = async (req, res) => {
    const signature = req.headers["verif-hash"];
    if (signature !== process.env.FLW_SECRET_HASH) return res.status(401).send();

    const { tx_ref, status } = req.body.data;
    if (status === 'successful') {
        await Order.findOneAndUpdate({ reference: tx_ref }, { status: 'paid' });
    }
    res.status(200).send();
};