import { initiatePayment } from '../services/payment/flutterwave.js';

export const createOrder = async (req, res) => {
    try {
        const { amount, email, tx_ref } = req.body;
        
        const details = {
            tx_ref: tx_ref || "TXN_" + Date.now(),
            amount: amount,
            currency: "NGN",
            redirect_url: "http://localhost:3000/success",
            customer: { email: email }
        };

        const result = await initiatePayment(details);
        res.status(200).json(result);
    } catch (error) {
        console.error("Payment Initiation Error:", error);
        res.status(500).json({ error: "Failed to initiate payment" });
    }
};