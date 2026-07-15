import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    cuisine: { type: String, required: true },
    address: { type: String, required: true },
    menu: [{
        name: String,
        price: Number,
        description: String,
        isAvailable: { type: Boolean, default: true }
    }],
    rating: { type: Number, default: 0 }
});

export default mongoose.model('Restaurant', restaurantSchema);