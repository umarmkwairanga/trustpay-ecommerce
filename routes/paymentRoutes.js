import express from 'express';
import { handleWebhook } from '../controllers/paymentController.js';

const router = express.Router();
router.post('/webhook', handleWebhook);

export default router;