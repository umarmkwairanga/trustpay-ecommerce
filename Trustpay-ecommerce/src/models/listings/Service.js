const mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  category: { type: String, required: true }, // Must be approved category
  price: { type: Number, required: true },
  pricingModel: { type: String, enum: ['hourly', 'fixed', 'project'], default: 'fixed' },
  location: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['active', 'paused'], default: 'active' }
}, { timestamps: true });
module.exports = mongoose.model('Service', serviceSchema);