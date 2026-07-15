import express from 'express';
import { 
    createOrder, 
    confirmDelivery, 
    resolveDispute, 
    disputeOrder,
    getPayoutQueue,  // New
    releasePayout,   // New
    flutterwaveWebhook // New
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// 1. PUBLIC WEBHOOK ROUTE
// This must be placed before 'router.use(protect)' 
// because Flutterwave doesn't send an auth token.
router.post('/webhook', flutterwaveWebhook);

// 2. PROTECTED ROUTES
router.use(protect);

// User routes
router.post('/', createOrder);
router.post('/dispute', disputeOrder);

// Admin/CEO ONLY routes
router.put('/confirm-delivery/:orderId', admin, confirmDelivery);
router.put('/resolve-dispute', admin, resolveDispute);

// New Payout Routes
router.get('/payout-queue', admin, getPayoutQueue);
router.put('/release-payout/:orderId', admin, releasePayout);

export default router;