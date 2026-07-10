import express from 'express';
import Escrow from '../models/Escrow.js';

const router = express.Router();

// POST: Create a new Escrow entry
router.post('/create', async (req, res) => {
    try {
        const { orderId, productId, buyerId, sellerId, amount, tx_ref, sellerEmail } = req.body;

        const newEscrow = new Escrow({
            orderId,
            productId,
            buyerId,
            sellerId,
            amount,
            tx_ref,
            sellerEmail, // Ensure your model includes this field for notifications
            status: 'Pending'
        });

        const savedEscrow = await newEscrow.save();
        res.status(201).json({ message: "Escrow created successfully", data: savedEscrow });
    } catch (error) {
        console.error("Error creating escrow:", error);
        res.status(500).json({ error: "Failed to create escrow record" });
    }
});

// GET: Fetch all escrow records (Admin View)
router.get('/all', async (req, res) => {
    try {
        const allEscrows = await Escrow.find().sort({ createdAt: -1 });
        res.status(200).json(allEscrows);
    } catch (error) {
        res.status(500).json({ message: "Error fetching records", error });
    }
});

export default router;