import express from 'express';
const router = express.Router();
// Ensure these paths match your actual folder structure
import { protect } from '../middleware/authMiddleware.js'; 
import { authorizeCEO } from '../middleware/auth.js'; 
import Order from '../models/Order.js';
import User from '../models/User.js';
import Escrow from '../models/Escrow.js';

router.get('/dashboard-stats', protect, authorizeCEO, async (req, res) => {
  try {
    // 1. Calculate Total Revenue from completed orders
    const completedOrders = await Order.find({ status: 'completed' });
    const totalRevenue = completedOrders.reduce((acc, order) => acc + (order.platformFee || 0), 0);

    // 2. Calculate Escrow Balance from held funds
    const activeEscrow = await Escrow.find({ status: 'held' });
    const escrowBalance = activeEscrow.reduce((acc, esc) => acc + (esc.amount || 0), 0);

    // 3. Count Active Users
    const activeUsers = await User.countDocuments({ isActive: true });

    // 4. Count Open Disputes
    const disputeCount = await Order.countDocuments({ status: 'disputed' });

    res.json({ 
      totalRevenue, 
      escrowBalance, 
      activeUsers, 
      disputeCount 
    });
  } catch (error) {
    console.error("CEO Stats Error:", error);
    res.status(500).json({ message: "Server error fetching stats" });
  }
});

export default router;