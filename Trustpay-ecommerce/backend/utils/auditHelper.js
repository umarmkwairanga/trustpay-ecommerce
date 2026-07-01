const AuditLog = import('../models/AuditLog');

const logAction = async (actorId, action, targetId, details) => {
  try {
    await AuditLog.create({ actor: actorId, action, targetId, details });
  } catch (err) {
    console.error("Audit Logging Failed:", err);
  }
};

module.exports = { logAction };