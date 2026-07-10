import Payout from '../models/Payout.js';
import Escrow from '../models/Escrow.js';
import axios from 'axios';

export const processPayout = async (req, res) => {
    try {
        const { escrowId } = req.body;
        const escrow = await Escrow.findById(escrowId);

        if (!escrow || escrow.status !== 'released') {
            return res.status(400).json({ message: "Invalid escrow or funds not released" });
        }

        // 1. Prepare Flutterwave Payout (Transfer) Request
        const response = await axios.post('https://api.flutterwave.com/v3/transfers', {
            account_bank: "044", // Example bank code
            account_number: "0690000040",
            amount: escrow.sellerAmount,
            currency: "NGN",
            narration: `Payout for Order ${escrow.order}`,
            reference: `TX-${escrow._id}`
        }, {
            headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` }
        });

        // 2. Save Payout record
        const payout = await Payout.create({
            seller: escrow.seller,
            order: escrow.order,
            escrow: escrow._id,
            amount: escrow.sellerAmount,
            transferReference: response.data.data.id,
            status: 'successful'
        });

        res.json({ message: "Payout initiated successfully", payout });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};