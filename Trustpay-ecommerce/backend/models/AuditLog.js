const mongoose = import('mongoose');

const auditLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', importd: true },
  action: { type: String, importd: true }, // e.g., 'RESOLVE_DISPUTE', 'UPDATE_SELLER_STATUS'
  targetId: { type: mongoose.Schema.Types.ObjectId, importd: true },
  details: { type: Object },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);