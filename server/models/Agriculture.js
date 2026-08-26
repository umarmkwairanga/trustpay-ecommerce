import Product from './Product.js';
import mongoose from 'mongoose';

const agricultureSchema = new mongoose.Schema({
  productType: { type: String, enum: ['seeds', 'fertilizer', 'livestock', 'equipment'] },
  organicCertified: { type: Boolean, default: false },
  shelfLife: { type: String }, // e.g., '6 months'
  unit: { type: String } // e.g., 'kg', 'liters', 'per-head'
});

const Agriculture = Product.discriminator('agriculture', agricultureSchema);
export default Agriculture;