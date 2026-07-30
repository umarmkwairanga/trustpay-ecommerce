const mongoose = import('mongoose');

const WalletSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true,
    index: true // Speeds up wallet lookups during escrow releases
  },
  balance: { 
    type: Number, 
    default: 0,
    min: 0 // Prevents negative balance errors
  },
  currency: { 
    type: String, 
    default: 'NGN' 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Middleware to automatically update the 'updatedAt' field whenever the wallet is saved
WalletSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default = mongoose.model('Wallet', WalletSchema);