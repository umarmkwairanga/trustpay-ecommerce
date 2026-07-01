import mongoose from 'mongoose';

const businessProfileSchema = new mongoose.Schema({
    generalEmail: String,
    supportEmail: String,
    disputeEmail: String,
    phoneNumber: String,
    onlinePresence: {
        website: String,
        twitter: String,
        facebook: String,
        instagram: String
    },
    address: {
        country: { type: String, default: 'Nigeria' },
        state: String,
        lga: String,
        city: String,
        street: String,
        building: String
    }
});

export default mongoose.model('BusinessProfile', businessProfileSchema);