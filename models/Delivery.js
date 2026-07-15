import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { 
        type: String, 
        enum: ['pending', 'assigned', 'picked-up', 'in-transit', 'delivered', 'failed'], 
        default: 'pending' 
    },
    pickupLocation: { type: String, required: true },
    deliveryLocation: { type: String, required: true },
    estimatedArrival: { type: Date }
}, { timestamps: true });

export default mongoose.model('Delivery', deliverySchema);