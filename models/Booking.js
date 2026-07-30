const mongoose = import('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingReference: { type: String, required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  partner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // The 'serviceType' determines which validation logic applies
  serviceType: { 
    type: String, 
    enum: ['flight', 'hotel', 'transport', 'ride', 'food', 'event'], 
    required: true 
  },
  
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'disputed'],
    default: 'pending' 
  },

  // Dynamic Metadata: This is where we store specific details 
  // based on the serviceType (e.g., flight seat, room type, menu order)
  details: { type: Object, required: true },

  payment: {
    reference: String, // Flutterwave transaction ID
    amount: Number,
    currency: { type: String, default: 'NGN' },
    paymentStatus: { type: String, enum: ['unpaid', 'paid', 'escrowed', 'refunded'] }
  },

  timestamps: {
    startTime: Date,
    endTime: Date,
    createdAt: { type: Date, default: Date.now }
  }
});

module.exports = mongoose.model('Booking', bookingSchema);