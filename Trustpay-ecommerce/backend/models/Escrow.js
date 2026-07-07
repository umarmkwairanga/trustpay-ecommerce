import mongoose from 'mongoose';

const escrowSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  tx_ref: { type: String, required: true, unique: true, index: true },
  status: { type: String, enum: ['Pending', 'Funded', 'Completed', 'Disputed', 'Refunded'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const Escrow = mongoose.model('Escrow', escrowSchema);

export default Escrow;