import mongoose from 'mongoose';

const travelBookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['flight', 'hotel'], required: true },
    provider: { type: String, required: true }, // e.g., Air Peace, Transcorp Hilton
    details: {
        checkIn: Date,    // For Hotels
        checkOut: Date,   // For Hotels
        flightDate: Date, // For Flights
        pnr: String       // Booking reference
    },
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'checked-in', 'completed', 'cancelled'], 
        default: 'pending' 
    },
    escrow: { type: mongoose.Schema.Types.ObjectId, ref: 'Escrow' }
}, { timestamps: true });

export default mongoose.model('TravelBooking', travelBookingSchema);