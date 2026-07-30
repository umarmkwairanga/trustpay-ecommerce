const mongoose = import('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { 
        type: String, 
        required: true,
        enum: [
            'Electronics', 'Fashion', 'Textiles', 'Beauty', 'Home & Living', 
            'Food', 'Books', 'Agriculture', 'Building Materials', 'Automotive', 
            'Professional Services', 'Plastics & Ceramics' // Added
        ]
    },
    stock: { type: Number, default: 0 },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    escrowrequired: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

export default = mongoose.model('Product', productSchema);