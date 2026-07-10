import mongoose from 'mongoose';

const escrowSchema = new mongoose.Schema({
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true,
    index: true 
  },
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  buyerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // Store amount as an integer in the smallest unit (e.g., kobo/cents)
  amount: { 
    type: Number, 
    required: true 
  },
  tx_ref: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Funded', 'Released', 'Disputed', 'Refunded'],
    default: 'Pending',
    index: true
  }
}, { 
  timestamps: true 
});

const Escrow = mongoose.model('Escrow', escrowSchema);

export default Escrow;