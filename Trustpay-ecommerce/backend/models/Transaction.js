const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    buyer: String,
    seller: String,
    product: String,
    amount: Number,
    status: { type: String, default: 'PENDING_PAYMENT' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);