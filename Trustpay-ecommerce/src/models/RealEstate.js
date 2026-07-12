import mongoose from 'mongoose';
import Product from './Product.js'; 

const realEstateSchema = new mongoose.Schema({
  propertyType: { 
    type: String, 
    enum: ['apartment', 'house', 'land', 'commercial'], 
    required: true 
  },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  squareFootage: { type: Number, required: true },
  amenities: { type: [String] },
  isFurnished: { type: Boolean, default: false },
  
  // Fields to support file uploads and user ownership
  image: { type: String }, 
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// Using Mongoose discriminator for inheritance
const RealEstate = Product.discriminator('realEstate', realEstateSchema);

export default RealEstate;