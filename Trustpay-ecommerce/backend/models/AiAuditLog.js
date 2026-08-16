const mongoose = require('mongoose');

const aiAuditLogSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    decision: {
        type: String,
        enum: ['USE_EXISTING_CATEGORY', 'APPROVED_NEW_CATEGORY', 'AI_REVIEW_REQUIRED', 'REJECTED', 'APPROVED_NEW_CATEGORY_OVERRIDE'],
        required: true
    },
    confidence: {
        type: Number,
        required: true
    },
    reason: {
        type: String
    },
    finalCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
}, { timestamps: true });

module.exports = mongoose.model('AiAuditLog', aiAuditLogSchema);