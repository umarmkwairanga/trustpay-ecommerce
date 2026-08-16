import BookingTransaction from '../models/BookingTransaction.js';
import BookingItem from '../models/BookingItem.js';
import crypto from 'crypto';

// @desc    Initiate a booking & calculate TrustPayEcommerce escrow/platform fees
// @route   POST /api/bookings/initiate
// @access  Private (Buyer / Customer)
export const initiateBooking = async (req, res) => {
    try {
        const { bookingItemId, startDate, endDate, timeSlot, quantity, guestDetails } = req.body;

        // 1. Verify the bookable item exists and is available
        const item = await BookingItem.findById(bookingItemId).populate('business');
        if (!item || !item.availabilityRules.isAvailable) {
            return res.status(404).json({ success: false, message: 'Bookable item not found or currently unavailable.' });
        }

        // 2. Calculate pricing & TrustPayEcommerce 5% platform fee
        const qty = quantity || 1;
        const subtotal = item.pricing.basePrice * qty;
        const platformFee = subtotal * 0.05; // 5% TrustPayEcommerce platform fee
        const totalAmount = subtotal + platformFee;

        // 3. Generate unique transaction reference for Flutterwave
        const bookingReference = `TRX-BOOK-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

        // 4. Create the booking transaction record
        const booking = await BookingTransaction.create({
            customer: req.user._id,
            business: item.business._id,
            bookingItem: item._id,
            bookingReference,
            schedule: {
                startDate,
                endDate,
                timeSlot
            },
            quantity: qty,
            pricingDetails: {
                subtotal,
                platformFee,
                totalAmount,
                currency: item.pricing.currency || 'NGN'
            },
            guestDetails,
            status: 'Pending',
            paymentStatus: 'pending',
            escrowStatus: 'held'
        });

        res.status(201).json({
            success: true,
            message: 'Booking initiated successfully. Proceed to payment.',
            bookingReference,
            totalAmount,
            currency: item.pricing.currency || 'NGN',
            booking
        });
    } catch (error) {
        console.error("Booking Initiation Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get customer's bookings (My Bookings)
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getCustomerBookings = async (req, res) => {
    try {
        const bookings = await BookingTransaction.find({ customer: req.user._id })
            .populate('bookingItem')
            .populate('business', 'businessName contactInfo location')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};