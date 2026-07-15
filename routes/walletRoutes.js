import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getBalance, deposit } from '../controllers/walletController.js';

const router = express.Router();

router.get('/balance', protect, getBalance);
router.post('/deposit', protect, deposit);

export default router;