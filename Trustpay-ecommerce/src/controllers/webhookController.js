import crypto from 'crypto';
import Order from '../models/Order.js';
import Escrow from '../models/Escrow.js';

export const handleFlutterwaveWebhook = async (req, res) => {
    // --- UPDATED SECURITY BLOCK ---
    const secretHash = process.env.FLW_SECRET_HASH;
    const signature = req.headers['verif-hash'];

    if (!signature || signature !== secretHash) {
        return res.status(401).send("Unauthorized");
    }
    // Note: For higher security in production, you can replace the 
    // simple comparison above with the HMAC verification logic 
    // (using crypto.createHmac) provided in the comment.
    // ------------------------------

    const { event, data } = req.body;

    if (event === 'charge.completed') {
        const { tx_ref, status } = data;

        if (status === 'successful') {
            const order = await Order.findOneAndUpdate(
                { reference: tx_ref },
                { status: 'paid' }
            );

            if (order) {
                await Escrow.findOneAndUpdate(
                    { order: order._id },
                    { status: 'Funded' }
                );
            }
        }
    }

    res.status(200).send();
};