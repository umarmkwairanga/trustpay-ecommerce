const mongoose = require('mongoose');
const Product = require('./Product');

const serviceSchema = new mongoose.Schema({
  hourlyRate: Number,
  experienceLevel: String, // e.g., 'Junior', 'Senior'
  availability: String,    // e.g., 'Mon-Fri'
  serviceType: String      // e.g., 'Consulting', 'Repair'
});

module.exports = Product.discriminator('service', serviceSchema);