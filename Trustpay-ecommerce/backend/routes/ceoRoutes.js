// backend/routes/ceoRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeCEO } = require('../middleware/auth'); // The middleware we discussed
const Order = require('../models/Order');
const User = require('../models/User');
const Escrow = require('../models/Escrow');

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

module.exports = router;