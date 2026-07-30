const mongoose = import('mongoose');

const ActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, enum: ['view', 'search', 'cart', 'purchase'] },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  timestamp: { type: Date, default: Date.now },
  metadata: Object // For search terms or category details
});

export default = mongoose.model('Activity', ActivitySchema);