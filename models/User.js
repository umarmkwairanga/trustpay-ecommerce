import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  
  // KYC Fields
  kyc: {
    status: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'unverified' },
    documentType: { type: String },
    documentNumber: { type: String }
  },

  // 2FA Fields
  twoFactor: {
    isEnabled: { type: Boolean, default: false },
    secret: { type: String }
  },

  // Bank Details
  bankDetails: {
    bankName: { type: String },
    accountName: { type: String },
    accountNumber: { type: String }
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;