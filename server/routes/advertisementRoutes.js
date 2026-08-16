import express from 'express';
import { protect, authorize } from '../middleware/auth.js'; // Ensure correct middleware path
import {
    createCampaign,
    submitCampaignPaymentWebhook,
    getSellerCampaigns,
    pauseCampaign
} from '../controllers/advertisementController.js';
import {
    getAllAdvertisements,
    approveAdvertisement,
    rejectAdvertisement,
    updatePricingConfig
} from '../controllers/adminAdvertisementController.js';

const router = express.Router();

// Seller Endpoints
router.post('/campaigns', protect, createCampaign);
router.get('/seller/campaigns', protect, getSellerCampaigns);
router.put('/campaigns/:id/pause', protect, pauseCampaign);
router.post('/payments/webhook', submitCampaignPaymentWebhook);

// Admin Endpoints
router.get('/admin/all', protect, authorize('admin', 'CEO'), getAllAdvertisements);
router.put('/admin/:id/approve', protect, authorize('admin', 'CEO'), approveAdvertisement);
router.put('/admin/:id/reject', protect, authorize('admin', 'CEO'), rejectAdvertisement);
router.put('/admin/pricing', protect, authorize('admin', 'CEO'), updatePricingConfig);

export default router;