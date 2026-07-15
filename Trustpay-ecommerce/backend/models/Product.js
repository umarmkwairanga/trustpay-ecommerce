import mongoose from 'mongoose';

// Define valid categories and conditions
export const PRODUCT_CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Groceries', 'Automotive'];
export const PRODUCT_CONDITIONS = ['new', 'used'];

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Product name is required'], // Fixed typo
    trim: true,
    index: true 
  },
  price: { 
    type: Number, 
    required: [true, 'Product price is required'], 
    min: [0, 'Price cannot be negative']
  },
  category: { 
    type: String, 
    required: [true, 'Product category is required'],
    enum: {
      values: PRODUCT_CATEGORIES,
      message: '{VALUE} is not a supported category'
    },
    trim: true,
    index: true 
  },
  // Added condition field
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