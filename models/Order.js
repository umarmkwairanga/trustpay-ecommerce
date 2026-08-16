import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // ADDED: Link the seller so we can access their bank details for payouts
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        price: Number,
        name: String
    }],
    totalAmount: { type: Number, required: true },
    
    // Commission Tracking
    commission: { type: Number, default: 0 },
    
    // TrustPayEcommerceEcommerce Statuses
    status: { 
        type: String, 
        enum: ['pending', 'paid', 'flagged', 'in-escrow', 'shipped', 'delivered', 'completed', 'disputed'],
        default: 'pending' 
    },
    
    // AI Fraud Shield Fields
    riskScore: { type: Number, default: 0 },
    fraudReasoning: { type: String },
    
    // Dispute Resolution Fields
    disputeNotes: { type: String },
    resolvedAt: { type: Date },
    
    // PAYMENT TRACKING
    paymentId: { type: String }, 
    reference: { type: String, unique: true, index: true } 
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);