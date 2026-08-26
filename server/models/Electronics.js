import Product from './Product.js';
import mongoose from 'mongoose';

const electronicsSchema = new mongoose.Schema({
  brand: { type: String },
  warranty: { type: String },
  condition: { type: String, enum: ['new', 'used'] }
});

const Electronics = Product.discriminator('electronics', electronicsSchema);
export default Electronics;