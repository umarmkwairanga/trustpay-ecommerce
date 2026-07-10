import express from 'express';
const router = express.Router();
import { createOrder } from '../controllers/paymentController.js';

router.post('/create', createOrder);

export default router;