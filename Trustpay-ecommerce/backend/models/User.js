import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    
    // Sanitized during pre-save
    phoneNumber: { 
        type: String, 
        required: true,
        trim: true 
    },
    
    role: { 
        type: String, 
        enum: [
            'buyer',
            'seller',
            'rider',
            'service_provider',
            'restaurant',
            'hotel',
            'flight',
            'vehicle',
            'real_estate',
            'event',
            'mentor', // Added mentor role
            'admin',
            'super_admin',
            'ceo',
            'delivery',
            'staff'
        ], 
        default: 'buyer' 
    },

    // New: Differentiates what this rider/driver can do
    serviceCapabilities: {
        type: [String],
        enum: ['goods', 'transport'],
        default: ['goods']
    },
    
    // KYC & Verification Fields
    isVerified: { type: Boolean, default: false },
    kycStatus: { 
        type: String, 
        enum: ['pending', 'verified', 'rejected'], 
        default: 'pending' 
    },
    govtIdPath: { type: String }, 
    
    businessName: { type: String }, 
    vehicleDetails: { type: String }, // e.g., Bike model or Car plate
    
    jobTitle: { type: String }, 
    salary: { type: Number },
    
    // FLUTTERWAVE PAYOUT FIELDS
    bankDetails: {
        bankName: { type: String },
        bankCode: { type: String }, 
        accountName: { type: String },
        accountNumber: { type: String }
    },

    // Added Mentor Profile Sub-Schema
    mentorProfile: {
        professionalTitle: { type: String },
        qualifications: [{ type: String }],
        institutionOrCompany: { type: String },
        yearsOfExperience: { type: Number, default: 0 },
        expertise: [{ type: String }],
        biography: { type: String },
        languages: [{ type: String }],
        categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MentorshipCategory' }],
        teachingExperience: { type: String },
        verificationDocuments: [{ type: String }],
        availability: { type: mongoose.Schema.Types.Mixed },
        bankInformation: {
            bankName: { type: String },
            accountNumber: { type: String },
            accountName: { type: String },
            flutterwaveSubaccountId: { type: String }
        },
        verificationStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'suspended'],
            default: 'pending'
        },
        rating: { type: Number, default: 0 },
        totalReviews: { type: Number, default: 0 }
    }
}, { timestamps: true });

// Pre-save hook: Hash password AND Sanitize phone number
userSchema.pre('save', async function(next) {
    // 1. Sanitize Phone Number: Remove all non-numeric characters (except leading +)
    if (this.phoneNumber) {
        this.phoneNumber = this.phoneNumber.replace(/[^\d+]/g, '');
    }

    // 2. Hash Password
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('User', userSchema);
export default User;