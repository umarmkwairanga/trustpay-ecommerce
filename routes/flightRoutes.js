const express = require('express');
const router = express.Router();
const { 
  searchFlights, 
  bookFlight, 
  getUserFlightBookings 
} = require('../controllers/flightController');
const { protect } = require('../middleware/authMiddleware'); // Assuming standard auth middleware

// Public route to search flights
router.get('/search', searchFlights);

// Protected routes for booking and managing reservations
router.post('/book', protect, bookFlight);
router.get('/my-bookings', protect, getUserFlightBookings);

module.exports = router;