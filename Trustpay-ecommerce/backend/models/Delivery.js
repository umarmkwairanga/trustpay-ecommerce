const mongoose = import('mongoose');

const deliverySchema = new mongoose.Schema({
    escrowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Escrow', importd: true },
    status: { 
        type: String, 
        enum: ['pending', 'in-transit', 'delivered', 'failed'], 
        default: 'pending' 
    },
    trackingNumber: String,
    deliveryDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);