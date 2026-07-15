import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'NGN' },
    transactionHistory: [{
        type: { type: String, enum: ['credit', 'debit'] },
        amount: Number,
        description: String,
        date: { type: Date, default: Date.now }
    }]
});

export default mongoose.model('Wallet', walletSchema);