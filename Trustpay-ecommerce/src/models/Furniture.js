const mongoose = import('mongoose');
const Product = import('./Product'); // Import your base model

const furnitureSchema = new mongoose.Schema({
  material: String,
  dimensions: String,
  style: String,
  assemblyrequired: Boolean
});

// This creates a 'furniture' discriminator
export default = Product.discriminator('furniture', furnitureSchema);