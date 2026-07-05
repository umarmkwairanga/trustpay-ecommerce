const mongoose = import('mongoose');
const User = import('../models/User');
const Escrow = import('../models/Escrow');
const Wallet = import('../models/Wallet');
const Content = import('../models/Content');
const AuditLog = import('../models/AuditLog'); // Ensure this is imported
const { sendNotification } = import('../utils/notificationHelper');
const { translateText } = import('../utils/aiService');
const { logAction } = import('../utils/auditHelper');

// Get Platform Overview Statistics with RBAC
exports.getDashboardStats = async (req, res) => {
  try {
    const { role, region } = req.user; 
    const isGlobalAccess = role === 'admin' || role === 'ceo';
    const matchCriteria = isGlobalAccess ? {} : { region: region };

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalUsers, transactionStats, revenueData, activeDisputes] = await Promise.all([
      User.countDocuments(isGlobalAccess ? {} : { region: region }),
      Escrow.aggregate([
        { $match: matchCriteria },
        {
          $group: {
            _id: null,
            totalVolume: { $sum: "$amount" },
            totalTransactions: { $sum: 1 },
            pendingEscrow: {
              $sum: { $cond: [{ $eq: ["$status", "Pending"] }, "$amount", 0] }
            }
          }
        }
      ]),
      Escrow.aggregate([
        { $match: { ...matchCriteria, status: 'Completed', createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$amount" }
          }
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: "$_id", revenue: 1 } }
      ]),
      Escrow.countDocuments({ ...matchCriteria, status: 'Disputed' })
    ]);

    const stats = transactionStats.length > 0 
      ? transactionStats[0] 
      : { totalVolume: 0, totalTransactions: 0, pendingEscrow: 0 };

    res.status(200).json({
      totalUsers,
      transactionStats: [stats],
      revenueData: revenueData || [],
      activeDisputes
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard statistics" });
  }
};

// Fetch Audit Logs (NEW)
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('actor', 'name email')
      .sort({ timestamp: -1 })
      .limit(50);
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
};

// Fetch Active Disputes
exports.getActiveDisputes = async (req, res) => {
  try {
    const { role, region } = req.user;
    const query = (role === 'admin' || role === 'ceo') ? { status: 'Disputed' } : { status: 'Disputed', region };
    const disputes = await Escrow.find(query);
    res.status(200).json(disputes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch active disputes" });
  }
};

// Get all transaction logs
exports.getTransactionLogs = async (req, res) => {
  try {
    const { role, region } = req.user;
    const query = (role === 'admin' || role === 'ceo') ? {} : { region };
    const logs = await Escrow.find(query).sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};

// User Management
exports.getAllUsers = async (req, res) => {
  try {
    const { role, region } = req.user;
    const query = (role === 'admin' || role === 'ceo') ? {} : { region };
    const users = await User.find(query).select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.updateUserVerification = async (req, res) => {
  try {
    const { userId, isVerified } = req.body;
    const user = await User.findByIdAndUpdate(userId, { isVerified }, { new: true });
    
    await logAction(req.user._id, 'UPDATE_USER_VERIFICATION', userId, { isVerified });
    await sendNotification(userId, `Your account verification status is now: ${isVerified ? 'Verified' : 'Unverified'}`);
    
    res.status(200).json({ message: "Verification status updated", user });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Seller Management
exports.getSellerApplications = async (req, res) => {
  try {
    const { role, region } = req.user;
    const query = (role === 'admin' || role === 'ceo') ? { role: 'Seller' } : { role: 'Seller', region };
    const sellers = await User.find(query);
    res.status(200).json(sellers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sellers" });
  }
};

exports.updateSellerStatus = async (req, res) => {
  try {
    const { sellerId, status } = req.body;
    const seller = await User.findByIdAndUpdate(sellerId, { sellerStatus: status, isVerified: status === 'Approved' }, { new: true });
    
    await logAction(req.user._id, 'UPDATE_SELLER_STATUS', sellerId, { status });
    await sendNotification(sellerId, `Your seller application has been: ${status}`);
    
    res.status(200).json({ message: `Seller status updated to ${status}`, seller });
  } catch (err) {
    res.status(500).json({ error: "Failed to update seller status" });
  }
};

// Resolve a Dispute
exports.resolveDispute = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { escrowId, resolution } = req.body;
    const escrow = await Escrow.findById(escrowId).session(session);
    if (!escrow) throw new Error("Escrow not found");

    if (resolution === 'refund') {
      escrow.status = 'Refunded';
      await Wallet.findOneAndUpdate({ userId: escrow.buyerId }, { $inc: { balance: escrow.amount } }, { session });
    } else if (resolution === 'release') {
      escrow.status = 'Completed';
      await Wallet.findOneAndUpdate({ userId: escrow.sellerId }, { $inc: { balance: escrow.amount } }, { session });
    } else {
      throw new Error("Invalid resolution action");
    }
    
    await escrow.save({ session });
    await logAction(req.user._id, 'RESOLVE_DISPUTE', escrowId, { resolution });
    
    await session.commitTransaction();
    await sendNotification(escrow.buyerId, `Dispute for Escrow ${escrowId} resolved: ${resolution}`);
    await sendNotification(escrow.sellerId, `Dispute for Escrow ${escrowId} resolved: ${resolution}`);
    
    res.status(200).json({ message: "Dispute resolved and funds moved successfully" });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

// CMS
exports.getPageContent = async (req, res) => {
  try {
    const { page } = req.params;
    const content = await Content.findOne({ page });
    res.status(200).json(content || { body: "", translations: {} });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch content" });
  }
};

exports.updatePageContent = async (req, res) => {
  try {
    const { page, body } = req.body;
    const existingContent = await Content.findOne({ page });
    
    if (!existingContent || existingContent.body !== body) {
      const [yoruba, igbo, hausa] = await Promise.all([
        translateText(body, 'Yoruba'),
        translateText(body, 'Igbo'),
        translateText(body, 'Hausa')
      ]);

      await Content.findOneAndUpdate(
        { page }, 
        { 
          body, 
          translations: { yoruba, igbo, hausa }, 
          updatedAt: Date.now() 
        }, 
        { upsert: true }
      );
      
      await logAction(req.user._id, 'UPDATE_CMS_CONTENT', page, { updated: true });
    }
    
    res.status(200).json({ message: "Content updated successfully" });
  } catch (err) {
    console.error("CMS Translation Error:", err);
    res.status(500).json({ error: "Failed to update content" });
  }
};