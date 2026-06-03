const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, default: 'General' }, // Added category field
    imageUrl: String,
    publicId: String
});

module.exports = mongoose.model('Product', productSchema);