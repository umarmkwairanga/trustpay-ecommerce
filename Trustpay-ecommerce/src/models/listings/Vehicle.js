const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  category: { type: String, required: true }, // e.g. SUV, Sedan, Truck
  price: { type: Number, required: true },
  listingType: { type: String, enum: ['sale', 'rental'], required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['available', 'booked', 'sold'], default: 'available' }
}, { timestamps: true });
module.exports = mongoose.model('Vehicle', vehicleSchema);