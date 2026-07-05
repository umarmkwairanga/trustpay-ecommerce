import mongoose from 'mongoose';

const escrowSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    productId: { type: String, required: true },
    buyerId: { type: String, required: true },
    sellerId: { type: String, required: true },
    sellerEmail: { type: String, required: true }, // Required for your email service
    amount: { type: Number, required: true },
    tx_ref: { type: String, required: true, unique: true },
    status: { type: String, default: 'Pending' } // Can be 'Pending', 'Funded', 'Released'
}, { timestamps: true });

const Escrow = mongoose.model('Escrow', escrowSchema);
export default Escrow;