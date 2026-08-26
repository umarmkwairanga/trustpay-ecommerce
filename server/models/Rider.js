import mongoose from 'mongoose';

const riderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicleType: { type: String, enum: ['bike', 'car', 'truck'], required: true },
    isAvailable: { type: Boolean, default: true },
    // GeoJSON format for MongoDB
    currentLocation: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
    },
    rating: { type: Number, default: 5.0 }
});

// CRITICAL: Index for location-based searches
riderSchema.index({ currentLocation: '2dsphere' });

export default mongoose.model('Rider', riderSchema);