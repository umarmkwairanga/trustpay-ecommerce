import BookingTransaction from '../models/BookingTransaction.js';
import BusinessProfile from '../models/BusinessProfile.js';

// @desc    Get all incoming booking requests for the logged-in provider's business
// @route   GET /api/provider/bookings
// @access  Private (Provider / Seller)
export const getProviderBookings = async (req, res) => {
    try {
        const business = await BusinessProfile.findOne({ user: req.user._id });
        if (!business) {
            return res.status(404).json({ success: false, message: 'Business profile not found for this user.' });
        }

        const bookings = await BookingTransaction.find({ business: business._id })
            .populate('customer', 'name email phone')
            .populate('bookingItem')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        console.error("Provider Bookings Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Accept, reject, or complete a booking request
// @route   PATCH /api/provider/bookings/:id/status
// @access  Private (Provider / Admin)
export const updateProviderBookingStatus = async (req, res) => {
    try {
        const { status } = req.body; // Expected values: 'Confirmed', 'Cancelled', 'Completed'
        const validStatuses = ['Pending', 'Awaiting Confirmation', 'Confirmed', 'Upcoming', 'In Progress', 'Completed', 'Cancelled', 'Disputed', 'Refunded'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid booking status provided.' });
        }

        const booking = await BookingTransaction.findById(req.params.id).populate('business');
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking transaction not found.' });
        }

        // Verify that the logged-in user owns the business linked to this booking (or is an admin)
        const isOwner = booking.business.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin' || req.user.role === 'ceo';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ success: false, message: 'Unauthorized to update this booking.' });
        }

        booking.status = status;
        
        // If the service/trip is marked completed, update escrow status to released for settlement
        if (status === 'Completed') {
            booking.escrowStatus = 'released';
        }

        await booking.save();

        res.status(200).json({
            success: true,
            message: `Booking status successfully updated to ${status}`,
            booking
        });
    } catch (error) {
        console.error("Update Booking Status Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};