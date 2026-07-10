import express from 'express';
import { 
    createEscrow, 
    releaseEscrow, 
    disputeEscrow, 
    getAllEscrows 
} from '../controllers/escrowController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Create an escrow (Logged-in buyers)
router.post('/create', protect, createEscrow);

// 2. Admin: Get all escrows for the dashboard
router.get('/admin/all', protect, restrictTo('admin'), getAllEscrows);

// 3. Release funds (Only Admins or Staff)
router.patch('/release/:id', protect, restrictTo('admin', 'staff'), releaseEscrow);

// 4. Dispute funds (Buyer or Admin can flag)
router.patch('/dispute/:id', protect, disputeEscrow);

export default router;