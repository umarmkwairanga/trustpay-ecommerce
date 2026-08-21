import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: [
            // Existing roles
            'Super Admin', 
            'Finance Officer', 
            'Support Manager', 
            'Compliance Officer', 
            'Restaurant Manager', 
            'Travel Vendor', 
            'Rider', 
            'Customer', 
            'Content Moderator',
            // Six new provider roles & standard system types
            'buyer',
            'seller',
            'rider',
            'admin',
            'ceo',
            'flight_provider',
            'hotel_provider',
            'restaurant_provider',
            'vehicle_provider',
            'real_estate_provider',
            'service_provider'
        ], 
        default: 'Customer' 
    },
    // Provider Verification and Profile Fields
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'suspended'],
        default: 'approved'
    },
    businessName: { type: String },
    businessAddress: { type: String },
    phone: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    verificationDocuments: [{ type: String }],
    bankDetails: {
        accountName: String,
        accountNumber: String,
        bankName: String
    },
    // 2FA Fields
    twoFactorSecret: { type: String },
    isTwoFactorEnabled: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Middleware to hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Helper method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;