import AuditLog from '../models/AuditLog.js';

export const logAdminAction = async (adminId, action, targetModel, targetId, details) => {
    await AuditLog.create({
        admin: adminId,
        action,
        targetModel,
        targetId,
        details
    });
};