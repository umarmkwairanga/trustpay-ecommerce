import mongoose from 'mongoose';

const transportBookingSchema = new mongoose.Schema({
    passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider' },
    pickup: String,
    destination: String,
    status: { type: String, enum: ['searching', 'in-transit', 'completed'], default: 'searching' },
    fare: Number,
    escrow: { type: mongoose.Schema.Types.ObjectId, ref: 'Escrow' }
});

export default mongoose.model('TransportBooking', transportBookingSchema);