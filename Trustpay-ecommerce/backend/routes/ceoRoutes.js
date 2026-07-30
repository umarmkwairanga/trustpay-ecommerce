// backend/routes/ceoRoutes.js
import express from 'express';
const router = express.Router();
const { protect } = import('../middleware/authMiddleware');
const { authorizeCEO } = import('../middleware/auth'); // The middleware we discussed
const Order = import('../models/Order');
const User = import('../models/User');
const Escrow = import('../models/Escrow');

router.get('/dashboard-stats', protect, authorizeCEO, async (req, res) => {
  try {
    // 1. Calculate Total Revenue (Completed orders)
    const completedOrders = await Order.find({ status: 'completed' });
    const totalRevenue = completedOrders.reduce((acc, order) => acc + order.platformFee, 0);

    // 2. Calculate Escrow Balance (Funds held)
    const activeEscrow = await Escrow.find({ status: 'held' });
    const escrowBalance = activeEscrow.reduce((acc, esc) => acc + esc.amount, 0);

    // 3. Count Active Users
    const activeUsers = await User.countDocuments({ isActive: true });

    // 4. Count Open Disputes
    const disputeCount = await Order.countDocuments({ status: 'disputed' });

    res.json({ totalRevenue, escrowBalance, activeUsers, disputeCount });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching stats" });
  }
});

export default router;