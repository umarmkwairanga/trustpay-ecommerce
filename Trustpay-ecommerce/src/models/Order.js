import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        title: String,
        price: Number
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Pending' }, // e.g., Pending, Completed, Shipped
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);