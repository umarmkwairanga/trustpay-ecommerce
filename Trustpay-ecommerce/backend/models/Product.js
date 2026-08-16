import mongoose from 'mongoose';

export const PRODUCT_CONDITIONS = ['new', 'used'];

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Product name is required'], 
    trim: true,
    index: true 
  },
  price: { 
    type: Number, 
    required: [true, 'Product price is required'], 
    min: [0, 'Price cannot be negative']
  },
  // CHANGED: Now dynamic. References the Category model instead of a fixed string enum.
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: [true, 'Product category is required'],
    index: true 
  },
  // ADDED: Tracks what the seller typed if it didn't fit an existing category
  proposedCategoryName: { 
    type: String, 
    trim: true,
    default: null 
  },
  // ADDED: Tracks moderation state (active, pending ai review, rejected)
  status: {
    type: String,
    enum: ['active', 'ai_review', 'rejected', 'inactive'],
    default: 'active'
  },
  condition: {
    type: String,
    required: [true, 'Product condition is required'],
    enum: {
      values: PRODUCT_CONDITIONS,
      message: '{VALUE} is not a valid condition'
    },
    default: 'new'
  },
  imagePath: { 
    type: String, 
    required: [true, 'Product image is required'] 
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be less than zero']
  },
  description: {
    type: String,
    trim: true
  }
}, { 
  timestamps: true 
});

const Product = mongoose.model('Product', productSchema);
export default Product;