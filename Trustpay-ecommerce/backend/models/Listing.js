const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    vertical: { 
        type: String, 
        enum: ['ecommerce', 'restaurant', 'flight', 'event', 'service', 'hotel', 'transport'], 
        required: true 
    },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    
    // Vertical-specific metadata
    metadata: {
        // Hotels
        roomType: String,
        amenities: [String],
        city: String,
        address: String,

        // Transport
        transportType: String, // e.g., 'Intercity Bus', 'Car Rental'
        departureLocation: String,
        arrivalLocation: String,
        departureTime: Date,
        availableSeats: Number
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);