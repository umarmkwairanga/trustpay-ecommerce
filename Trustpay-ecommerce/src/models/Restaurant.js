import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cuisine: [String],
    address: String,
    isOpen: { type: Boolean, default: true },
    deliveryFee: { type: Number, default: 0 }
});

export default mongoose.model('Restaurant', restaurantSchema);