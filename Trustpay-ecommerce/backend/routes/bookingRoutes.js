// backend/routes/bookingRoutes.js
const express = import('express');
const router = express.Router();
const { 
    createBooking, 
    getUserBookings, 
    confirmBooking 
} = import('../controllers/bookingController');

// POST: Create a new booking (status: pending)
router.post('/create', createBooking);

// POST: Confirm booking after payment verification
router.post('/confirm', confirmBooking);

// GET: Fetch bookings for a specific user
router.get('/user/:userId', getUserBookings);

module.exports = router;