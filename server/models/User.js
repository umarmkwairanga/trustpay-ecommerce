import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Existing fields
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },

  // New Security & Compliance Fields (For Escrow)
  is2FAEnabled: { type: Boolean, default: false },
  kycStatus: { 
    type: String, 
    enum: ['unverified', 'pending', 'verified'], 
    default: 'unverified' 
  },
  idNumber: { type: String }, // Stores BVN or NIN
  idType: { type: String },   // e.g., 'BVN', 'NIN', 'Passport'
  
  // Payment Details (For Flutterwave Integration)
  paymentDetails: {
    bankName: { type: String },
    accountNumber: { type: String },
    accountHolderName: { type: String }
  },
  
  // Notification Preferences
  preferences: {
    smsAlerts: { type: Boolean, default: true },
    emailUpdates: { type: Boolean, default: true }
  },
  
  // Audit Trail
  lastLogin: { type: Date, default: Date.now }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;