const BusinessConfigSchema = new mongoose.Schema({
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['hotel', 'flight', 'transport', 'restaurant'] },
    
    // Operational Settings
    bookingPolicy: {
        minAdvanceNoticeHours: { type: Number, default: 24 },
        cancellationWindowHours: { type: Number, default: 48 },
        allowInstantBooking: { type: Boolean, default: true }
    },
    
    // Resource Configuration
    capacity: { type: Number },
    pricingConfig: {
        currency: { type: String, default: 'NGN' },
        baseRate: { type: Number }
    }
});