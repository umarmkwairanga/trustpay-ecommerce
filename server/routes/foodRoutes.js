// src/routes/foodRoutes.js
import express from 'express';
import { updateFoodOrderStatus } from '../controllers/foodController.js';

const router = express.Router();

// Route to update order status (e.g., from 'preparing' to 'delivered')
router.patch('/update-status', updateFoodOrderStatus);

export default router;