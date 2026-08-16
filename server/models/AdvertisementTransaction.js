const mongoose = require('mongoose');

const advertisementTransactionSchema = new mongoose.Schema({
    advertisement: { type: mongoose.Schema.Types.ObjectId, ref: 'Advertisement', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    paymentGatewayReference: { type: String, required: true, unique: true },
    paymentStatus: { type: String, enum: ['Pending', 'Success', 'Failed', 'Refunded'], default: 'Pending' },
    gatewayResponse: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('AdvertisementTransaction', advertisementTransactionSchema);