import express from 'express';
import { 
  getAllProviders, 
  updateProviderStatus, 
  getCEOAnalytics 
} from '../controllers/adminProviderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin provider verification routes
router.get('/providers', protect, authorize('admin', 'Super Admin', 'ceo'), getAllProviders);
router.put('/providers/:providerId/status', protect, authorize('admin', 'Super Admin', 'ceo'), updateProviderStatus);

// CEO analytics route
router.get('/ceo/analytics', protect, authorize('Super Admin', 'ceo'), getCEOAnalytics);

export default router;