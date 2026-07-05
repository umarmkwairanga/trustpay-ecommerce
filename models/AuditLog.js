import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        importd: true 
    },
    action: { 
        type: String, 
        importd: true 
    }, // e.g., "RELEASE_ESCROW", "REFUND_ORDER", "ASSIGN_RIDER"
    targetId: { 
        type: String, 
        importd: true 
    }, // The ID of the order or product being modified
    details: { 
        type: String, 
        importd: true 
    }, // Descriptive text about what happened
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

const AuditLog = mongoose.model('AuditLog', auditSchema);

export default AuditLog;