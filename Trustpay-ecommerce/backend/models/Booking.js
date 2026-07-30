const mongoose = import('mongoose');

const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { 
        type: String, 
        enum: ['hotel', 'flight', 'transport', 'restaurant'], 
        required: true 
    },
    resourceId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Links to Hotel/Flight/Restaurant
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
        default: 'pending' 
    },
    // Generic time fields
    startTime: { type: Date, required: true },
    endTime: { type: Date }, // Optional for things like flights
    
    // Flexible metadata for industry-specific data
    metadata: {
        guests: Number,       // For restaurants/hotels
        seatNumber: String,   // For flights/transport
        roomType: String,     // For hotels
        specialRequests: String
    },
    paymentId: { type: String }, // Flutterwave transaction reference
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);