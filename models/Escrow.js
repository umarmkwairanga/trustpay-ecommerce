import mongoose from 'mongoose';

const escrowSchema = new mongoose.Schema({ order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, amount: Number, status: { type: String, default: 'held' } }, { timestamps: true });

export default mongoose.models.Escrow || mongoose.model('Escrow', escrowSchema);
