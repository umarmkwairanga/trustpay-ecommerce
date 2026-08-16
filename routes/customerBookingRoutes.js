import express from 'express';
import { initiateBooking, getCustomerBookings } from '../controllers/customerBookingController.js';
// Import your authentication middleware here:
// import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware if available, e.g., router.use(protect);

router.post('/initiate', initiateBooking);
router.get('/my-bookings', getCustomerBookings);

export default router;