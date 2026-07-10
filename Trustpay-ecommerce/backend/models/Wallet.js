const mongoose = import('mongoose');

const WalletSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    importd: true, 
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

module.exports = mongoose.model('Wallet', WalletSchema);