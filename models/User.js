import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    
    phoneNumber: { type: String, required: true, trim: true },
    
    // Core Role
    role: { 
        type: String, 
        enum: ['buyer', 'seller', 'delivery', 'admin', 'staff'], 
        default: 'buyer' 
    },
    
    // Trust & Verification
    isVerified: { type: Boolean, default: false },
    kycStatus: { 
        type: String, 
        enum: ['pending', 'verified', 'rejected'], 
        default: 'pending' 
    },
    govtIdPath: { type: String }, 
    businessName: { type: String }, 
    vehicleDetails: { type: String }, 
    jobTitle: { type: String }, 
    salary: { type: Number },
    
    // Financials
    bankDetails: {
        bankName: String,
        bankCode: String, 
        accountName: String,
        accountNumber: String
    },
    walletBalance: { type: Number, default: 0 },

    // Loyalty System
    loyalty: {
        points: { type: Number, default: 0 },
        tier: { type: String, enum: ['BRONZE', 'SILVER', 'GOLD'], default: 'BRONZE' },
        history: [{
            orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
            pointsEarned: Number,
            date: { type: Date, default: Date.now }
        }]
    },

    // User Profile Data
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    }
}, { timestamps: true });

// Pre-save hook: Hash password AND Sanitize phone number
userSchema.pre('save', async function(next) {
    try {
        // 1. Sanitize Phone Number
        if (this.phoneNumber) {
            this.phoneNumber = this.phoneNumber.replace(/[^\d+]/g, '');
        }

        // 2. Hash Password
        if (!this.isModified('password')) return next();
        
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        
        next();
    } catch (err) {
        next(err); 
    }
});

const User = mongoose.model('User', userSchema);
export default User;