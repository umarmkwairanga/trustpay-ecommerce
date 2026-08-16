import express from 'express';
import { 
    getAdminProviders, 
    updateProviderVerificationStatus, 
    getCeoBookingKPIs 
} from '../controllers/adminCeoBookingController.js';
// Import your auth and admin role-check middleware if available:
// import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth/admin middleware here if desired, e.g., router.use(protect, authorize('admin', 'ceo'));

router.get('/providers', getAdminProviders);
router.patch('/providers/:id/status', updateProviderVerificationStatus);
router.get('/ceo/kpis', getCeoBookingKPIs);

export default router;