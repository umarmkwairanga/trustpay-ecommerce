import express from 'express';
import { createOrder } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All order routes require authentication
router.use(protect);

// POST /api/orders - Create an order from the user's cart
router.post('/', createOrder);

export default router;