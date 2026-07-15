import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'NGN' },
    lastUpdated: { type: Date, default: Date.now },
    // Tracks if the wallet is active or frozen (e.g., for security reasons)
    status: { type: String, enum: ['active', 'frozen'], default: 'active' }
});

export default mongoose.model('Wallet', walletSchema);