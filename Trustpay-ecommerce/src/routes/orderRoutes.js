// src/routes/orderRoutes.js
import express from 'express';
import { createOrder } from '../controllers/orderController.js';
import { assessFraudRisk } from '../middleware/fraudShield.js';

const router = express.Router();

// The middleware 'assessFraudRisk' runs first
router.post('/checkout', assessFraudRisk, createOrder);

export default router;