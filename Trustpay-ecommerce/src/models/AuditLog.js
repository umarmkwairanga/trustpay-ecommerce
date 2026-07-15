import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // e.g., "RELEASED_ESCROW_FUNDS"
    targetModel: String, // e.g., "Escrow"
    targetId: mongoose.Schema.Types.ObjectId,
    details: Object, // Stores before/after values
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('AuditLog', auditLogSchema);