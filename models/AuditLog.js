import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    action: { 
        type: String, 
        required: true 
    }, // e.g., "RELEASE_ESCROW", "REFUND_ORDER", "ASSIGN_RIDER"
    targetId: { 
        type: String, 
        required: true 
    }, // The ID of the order or product being modified
    details: { 
        type: String, 
        required: true 
    }, // Descriptive text about what happened
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

const AuditLog = mongoose.model('AuditLog', auditSchema);

export default AuditLog;