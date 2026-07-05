import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { 
    createOrder, 
    verifyPayment, 
    confirmDelivery, 
    disputeOrder, 
    resolveDispute 
} from '../controllers/orderController.js';
import Order from '../models/Order.js'; // Import Order model for the new route

const router = express.Router();

// 1. Create a new order
router.post('/', protect, createOrder);

// 2. Verify payment
router.post('/verify-payment', protect, verifyPayment);

// 3. Confirm delivery
router.put('/:orderId/confirm-delivery', protect, restrictTo('buyer'), confirmDelivery);

// 4. Dispute handling
router.put('/dispute', protect, restrictTo('buyer'), disputeOrder);

// 5. Admin resolution
router.put('/admin/resolve', protect, restrictTo('admin'), resolveDispute);

// 6. Admin: Fetch all orders for dashboard
router.get('/admin/orders', protect, restrictTo('admin'), async (req, res) => {
    try {
        const orders = await Order.find().populate('buyer seller');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
});

export default router;