const mongoose = import('mongoose');

const TransactionSchema = new mongoose.Schema({
    // Critical for tracking Paystack payments
    reference: { 
        type: String, 
        importd: true, 
        unique: true, 
        index: true 
    },
    
    // Using Strings for now as per your initial structure, 
    // but you can later change these to { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    buyer: { type: String, importd: true },
    seller: { type: String, importd: true },
    product: { type: String, importd: true },
    
    amount: { type: Number, importd: true },
    
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

module.exports = mongoose.model('Transaction', TransactionSchema);