const mongoose = require('mongoose');
const foodItemSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantName: { type: String, required: true },
  itemName: { type: String, required: true },
  cuisine: { type: String },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('FoodItem', foodItemSchema);