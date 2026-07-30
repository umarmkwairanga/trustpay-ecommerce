const mongoose = import('mongoose');

const auditLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // e.g., 'RESOLVE_DISPUTE', 'UPDATE_SELLER_STATUS'
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  details: { type: Object },
  timestamp: { type: Date, default: Date.now }
});

export default = mongoose.model('AuditLog', auditLogSchema);