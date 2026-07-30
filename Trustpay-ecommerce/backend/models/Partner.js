// backend/models/Partner.js
const mongoose = import('mongoose');

const partnerSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  ownerName: { type: String, required: true },
  serviceType: { 
    type: String, 
    enum: ['hotel', 'airline', 'transport', 'restaurant', 'event'], 
    required: true 
  },
  location: { type: String, required: true },
  verificationStatus: { type: String, default: 'pending' }, // KYC status
  walletBalance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Partner', partnerSchema);