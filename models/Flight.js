const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  airline: { type: String, required: true },
  flightNumber: { type: String, required: true, unique: true },
  departureAirport: { type: String, required: true }, // e.g., LOS (Lagos)
  arrivalAirport: { type: String, required: true },   // e.g., ABV (Abuja)
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  price: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  classType: { 
    type: String, 
    enum: ['Economy', 'Business', 'First Class'], 
    default: 'Economy' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Flight', flightSchema);