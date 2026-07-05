import express from 'express';
import BusinessProfile from '../models/BusinessProfile.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET: Publicly available contact info
router.get('/', async (req, res) => {
    try {
        const profile = await BusinessProfile.findOne();
        res.json(profile || {});
    } catch (err) {
        res.status(500).json({ message: "Error fetching business profile" });
    }
});

// PUT: Only Admin can update
router.put('/', protect, restrictTo('admin'), async (req, res) => {
    try {
        const profile = await BusinessProfile.findOneAndUpdate({}, req.body, { upsert: true, new: true });
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: "Error updating profile" });
    }
});

export default router;