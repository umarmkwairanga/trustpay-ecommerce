const mongoose = require('mongoose');
const Product = require('./Product'); // Import your base model

const furnitureSchema = new mongoose.Schema({
  material: String,
  dimensions: String,
  style: String,
  assemblyRequired: Boolean
});

// This creates a 'furniture' discriminator
module.exports = Product.discriminator('furniture', furnitureSchema);