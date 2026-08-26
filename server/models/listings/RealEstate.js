const mongoose = require('mongoose');
const realEstateSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  propertyType: { type: String, required: true }, // Apartment, Land, Duplex
  listingType: { type: String, enum: ['sale', 'rent'], required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  status: { type: String, enum: ['available', 'pending', 'sold'], default: 'available' }
}, { timestamps: true });
module.exports = mongoose.model('RealEstate', realEstateSchema);