import express from 'express';
import { getProviderBookings, updateProviderBookingStatus } from '../controllers/providerBookingController.js';
// Import your auth middleware (e.g., protect, authorize) if used in your app:
// import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware: router.use(protect);

router.get('/', getProviderBookings);
router.patch('/:id/status', updateProviderBookingStatus);

export default router;