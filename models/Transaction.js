import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    reference: { 
        type: String, 
        required: true, 
        unique: true, 
        index: true 
    },
    buyer: { type: String, required: true },
    seller: { type: String, required: true },
    product: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['PENDING_PAYMENT', 'HELD', 'RELEASED', 'REFUNDED', 'DISPUTED'],
        default: 'PENDING_PAYMENT' 
    },
    itemDescription: { type: String },
    metadata: {
        feeAmount: { type: Number },
        deliveryStatus: { type: String, default: 'NOT_STARTED' }
    }
}, { 
    timestamps: true 
});

const Transaction = mongoose.model('Transaction', TransactionSchema);
export default Transaction;