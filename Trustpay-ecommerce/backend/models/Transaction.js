const mongoose = import('mongoose');

const TransactionSchema = new mongoose.Schema({
    // Critical for tracking Paystack payments
    reference: { 
        type: String, 
        required: true, 
        unique: true, 
        index: true 
    },
    
    // Using Strings for now as per your initial structure, 
    // but you can later change these to { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    buyer: { type: String, required: true },
    seller: { type: String, required: true },
    product: { type: String, required: true },
    
    amount: { type: Number, required: true },
    
    // Status management for the Escrow flow
    status: { 
        type: String, 
        enum: ['PENDING_PAYMENT', 'HELD', 'RELEASED', 'REFUNDED', 'DISPUTED'],
        default: 'PENDING_PAYMENT' 
    },

    // Extra details for support and disputes
    itemDescription: { type: String },
    metadata: {
        feeAmount: { type: Number },
        deliveryStatus: { type: String, default: 'NOT_STARTED' }
    }
}, { 
    // Automatically handles createdAt and updatedAt
    timestamps: true 
});

export default = mongoose.model('Transaction', TransactionSchema);