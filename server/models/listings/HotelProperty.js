const mongoose = require('mongoose');
const hotelPropertySchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyName: { type: String, required: true },
  propertyType: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  description: { type: String },
  amenities: [String],
  pricePerNight: { type: Number, required: true },
  roomsAvailable: { type: Number, required: true },
  images: [String],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });
module.exports = mongoose.model('HotelProperty', hotelPropertySchema);