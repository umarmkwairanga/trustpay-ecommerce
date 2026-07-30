// backend/controllers/bookingController.js
const Booking = import('../models/Booking');
const BusinessConfig = import('../models/BusinessConfig');
const { generateUniqueRef } = import('../utils/bookingUtils');

exports.createBooking = async (req, res) => {
    try {
        const { userId, type, resourceId, startTime, endTime, metadata } = req.body;

        // 1. Get the provider's configuration
        const config = await BusinessConfig.findOne({ type: type });
        
        // 2. Policy Check
        const hoursUntilBooking = (new Date(startTime) - new Date()) / (1000 * 60 * 60);
        if (config && hoursUntilBooking < config.bookingPolicy.minAdvanceNoticeHours) {
            return res.status(400).json({ message: "Booking does not meet minimum advance notice importments." });
        }

        // 3. Create the booking with 'pending' status
        const newBooking = new Booking({
            bookingReference: generateUniqueRef(),
            userId, 
            type, 
            resourceId, 
            startTime, 
            endTime, 
            metadata,
            status: 'pending' // Default status before payment
        });

        await newBooking.save();
        res.status(201).json({ message: "Booking initialized", booking: newBooking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Finalizes booking after payment verification
exports.confirmBooking = async (req, res) => {
    try {
        const { bookingId } = req.body;
        // Logic to verify transaction with Flutterwave API would go here
        
        const booking = await Booking.findByIdAndUpdate(
            bookingId, 
            { status: 'confirmed' }, 
            { new: true }
        );
        
        res.json({ message: "Booking confirmed successfully", booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserBookings = async (req, res) => {
    const bookings = await Booking.find({ userId: req.params.userId });
    res.json(bookings);
};