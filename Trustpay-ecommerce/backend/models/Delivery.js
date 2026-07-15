import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
    // Link to the order (Escrow)
    order: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order', 
        required: true 
    },
    // Link to the rider assigned to the job
    rider: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'in-transit', 'delivered', 'failed'], 
        default: 'pending' 
    },
    trackingNumber: { type: String },
    currentLocation: { type: String }, // Useful for "Bolt-style" tracking
    deliveryDate: { type: Date }
}, { timestamps: true });

const Delivery = mongoose.model('Delivery', deliverySchema);
export default Delivery;