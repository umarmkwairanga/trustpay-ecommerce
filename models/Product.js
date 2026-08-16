import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({ sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } }, { strict: false, timestamps: true });
export default mongoose.models.Product || mongoose.model('Product', productSchema);