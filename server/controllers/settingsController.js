const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const bcrypt = require('bcryptjs');

exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -pin');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user.settings || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    // Prevent privilege escalation or unauthorized role changes via settings
    if (updates.role || updates.permissions || updates.isAdmin || updates.isCeo) {
      if (req.user.role !== 'admin' && req.user.role !== 'ceo') {
        return res.status(403).json({ success: false, message: 'Unauthorized permission modification attempt.' });
      }
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Merge settings
    user.settings = { ...user.settings, ...updates };
    await user.save();

    // Audit log for sensitive changes
    if (updates.security || updates.payoutSettings || updates.password) {
      await AuditLog.create({
        user: userId,
        action: 'UPDATE_SENSITIVE_SETTINGS',
        details: { fieldsUpdated: Object.keys(updates) },
        ipAddress: req.ip
      });
    }

    res.status(200).json({ success: true, message: 'Settings updated successfully', data: user.settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};