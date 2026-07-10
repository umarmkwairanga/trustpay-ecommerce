import express from 'express';
import Escrow from '../models/Escrow.js';

const router = express.Router();

router.post('/create', async (req, res) => {
    try {
        const newEscrow = new Escrow(req.body);
        const savedEscrow = await newEscrow.save();
        res.status(201).json(savedEscrow);
    } catch (error) {
        console.error("Escrow creation error:", error);
        res.status(500).json({ error: "Escrow creation failed" });
    }
});

export default router;