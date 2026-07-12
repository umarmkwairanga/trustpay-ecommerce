const mongoose = require('mongoose');

const baseOptions = {
  discriminatorKey: 'kind', // This creates the 'kind' field in MongoDB
  collection: 'products',   // All products live in one collection
  timestamps: true
};

const baseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['available', 'sold', 'pending'], default: 'available' }
}, baseOptions);

module.exports = mongoose.model('Product', baseSchema);