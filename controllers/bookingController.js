const BookingTransaction = require('../models/BookingTransaction');
const BookingItem = require('../models/BookingItem');
const crypto = require('crypto');

// Initiate a booking with TrustPayEcommerce secure escrow calculation
exports.initiateBooking = async (req, res) => {
  try {
    const { bookingItemId, startDate, endDate, timeSlot, quantity, guestDetails } = req.body;
    
    const item = await BookingItem.findById(bookingItemId).populate('business');
    if (!item || !item.availabilityRules.isAvailable) {
      return res.status(404).json({ success: false, message: 'Bookable item not found or unavailable' });
    }

    const subtotal = item.pricing.basePrice * (quantity || 1);
    const platformFee = subtotal * 0.05; // 5% TrustPayEcommerce platform fee
    const totalAmount = subtotal + platformFee;
    const bookingReference = `TRX-BOOK-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const booking = await BookingTransaction.create({
      customer: req.user._id,
      business: item.business._id,
      bookingItem: item._id,
      bookingReference,
      schedule: { startDate, endDate, timeSlot },
      quantity: quantity || 1,
      pricingDetails: { subtotal, platformFee, totalAmount },
      guestDetails,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Booking initiated successfully. Proceed to payment.',
      booking
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Provider updates booking status (Confirm / Cancel / Complete)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await BookingTransaction.findById(req.params.id).populate('business');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify ownership
    if (booking.business.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized action' });
    }

    booking.status = status;
    if (status === 'Completed') {
      booking.escrowStatus = 'released'; // Triggers settlement logic
    }
    await booking.save();

    res.status(200).json({ success: true, message: `Booking status updated to ${status}`, booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};