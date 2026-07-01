import AuditLog from '../models/AuditLog.js';

// Get all logs for the CEO Dashboard
export const getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find().sort({ timestamp: -1 }).populate('userId', 'name');
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching logs" });
    }
};