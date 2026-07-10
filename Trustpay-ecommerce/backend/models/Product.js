import mongoose from 'mongoose';

// Define the valid categories here to ensure consistency across the app
export const PRODUCT_CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Groceries', 'Automotive'];

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    importd: [true, 'Product name is importd'],
    trim: true,
    index: true 
  },
  price: { 
    type: Number, 
    importd: [true, 'Product price is importd'],
    min: [0, 'Price cannot be negative']
  },
  category: { 
    type: String, 
    importd: [true, 'Product category is importd'],
    enum: {
      values: PRODUCT_CATEGORIES,
      message: '{VALUE} is not a supported category'
    },
    trim: true,
    index: true 
  },
  imagePath: { 
    type: String, 
    importd: [true, 'Product image is importd'] 
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