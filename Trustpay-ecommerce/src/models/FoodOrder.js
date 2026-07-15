import mongoose from 'mongoose';

const foodOrderSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    items: [{ name: String, quantity: Number, price: Number }],
    totalAmount: Number,
    status: { 
        type: String, 
        enum: ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
        default: 'pending' 
    },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Link to delivery partner
}, { timestamps: true });

export default mongoose.model('FoodOrder', foodOrderSchema);