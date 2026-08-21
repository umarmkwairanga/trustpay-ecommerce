const mongoose = require('mongoose');

const flightBookingSchema = new mongoose.Schema({
  flight: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Flight', 
    required: true 
  },
  buyer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  passengers: [{
    fullName: { type: String, required: true },
    seatNumber: { type: String },
    ticketNumber: { type: String }
  }],
  totalAmount: { type: Number, required: true },
  escrowStatus: { 
    type: String, 
    enum: ['Held in Escrow', 'Released to Airline', 'Refunded'], 
    default: 'Held in Escrow' 
  },
  bookingStatus: { 
    type: String, 
    enum: ['Confirmed', 'Cancelled', 'Completed'], 
    default: 'Confirmed' 
  }
}, { timestamps: true });

module.exports = mongoose.model('FlightBooking', flightBookingSchema);