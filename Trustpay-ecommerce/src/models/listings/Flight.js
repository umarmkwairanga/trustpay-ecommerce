const mongoose = require('mongoose');
const flightSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  airline: { type: String, required: true },
  flightNumber: { type: String, required: true },
  departureAirport: { type: String, required: true },
  arrivalAirport: { type: String, required: true },
  departureDate: { type: Date, required: true },
  arrivalDate: { type: Date, required: true },
  availableSeats: { type: Number, required: true },
  cabinClass: { type: String, enum: ['Economy', 'Business', 'First'], default: 'Economy' },
  price: { type: Number, required: true },
  status: { type: String, enum: ['scheduled', 'delayed', 'cancelled', 'completed'], default: 'scheduled' }
}, { timestamps: true });
module.exports = mongoose.model('Flight', flightSchema);