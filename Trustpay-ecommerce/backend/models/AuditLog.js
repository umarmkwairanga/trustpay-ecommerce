import mongoose from 'mongoose';

const aiAuditLogSchema = new mongoose.Schema({
  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: false 
  },
  proposedCategory: { 
    type: String, 
    required: true,
    trim: true
  },
  decision: { 
    type: String, 
    enum: ['APPROVED_NEW_CATEGORY', 'USE_EXISTING_CATEGORY', 'REJECTED', 'AI_REVIEW_REQUIRED'],
    required: true 
  },
  confidence: { 
    type: Number, 
    required: true 
  },
  existingCategoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    default: null 
  },
  finalCategoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    default: null 
  },
  reason: { 
    type: String, 
    required: true 
  }
}, { 
  timestamps: true 
});

const AiAuditLog = mongoose.model('AiAuditLog', aiAuditLogSchema);
export default AiAuditLog;