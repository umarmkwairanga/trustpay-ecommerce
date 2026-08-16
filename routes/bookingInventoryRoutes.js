import express from 'express';
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Booking inventory routes working' }));
export default router;