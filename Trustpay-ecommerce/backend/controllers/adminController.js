const mongoose = require('mongoose');
const User = require('../models/User');
const Escrow = require('../models/Escrow');
const Wallet = require('../models/Wallet');
const Content = require('../models/Content');
const AuditLog = require('../models/AuditLog');
const Product = require('../models/Product');
const Category = require('../models/Category');
const AiAuditLog = require('../models/AiAuditLog');
const slugify = require('slugify');
const { sendNotification } = require('../utils/notificationHelper');
const { translateText } = require('../utils/aiService');
const { logAction } = require('../utils/auditHelper');

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

// Fetch Audit Logs
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

// ==========================================
// AI MODERATION & REVIEW QUEUE MANAGEMENT (NEW)
// ==========================================

// Get all products/audit logs requiring manual Admin AI review
exports.getAiReviewsQueue = async (req, res) => {
  try {
    const pendingReviews = await AiAuditLog.find({ decision: 'AI_REVIEW_REQUIRED' })
      .populate('sellerId', 'name email')
      .populate('productId')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: pendingReviews.length,
      pendingReviews
    });
  } catch (error) {
    console.error('Error fetching AI review queue:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load AI moderation review queue.',
      error: error.message
    });
  }
};

// Admin action to resolve an AI_REVIEW_REQUIRED product
exports.resolveAiReview = async (req, res) => {
  try {
    const { auditId, action, categoryId, newCategoryName } = req.body; 
    // Expected actions: 'APPROVE' or 'REJECT'

    if (!auditId || !action) {
      return res.status(400).json({
        success: false,
        message: 'Please provide auditId and action (APPROVE or REJECT).'
      });
    }

    const auditLog = await AiAuditLog.findById(auditId);
    if (!auditLog) {
      return res.status(404).json({ success: false, message: 'Audit log record not found.' });
    }

    const product = await Product.findById(auditLog.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Associated product not found.' });
    }

    if (action === 'REJECT') {
      product.status = 'rejected';
      await product.save();

      auditLog.decision = 'REJECTED';
      auditLog.reason = 'Manually rejected by TrustPayEcommerce Administrator.';
      await auditLog.save();

      await logAction(req.user._id, 'REJECT_AI_PRODUCT_REVIEW', auditLog.productId, { action: 'REJECT' });

      return res.status(200).json({
        success: true,
        message: 'Product listing rejected and disabled by Admin.'
      });
    }

    if (action === 'APPROVE') {
      let targetCatId = categoryId;

      if (newCategoryName) {
        const slug = slugify(newCategoryName, { lower: true, strict: true });
        let existingCategory = await Category.findOne({
          $or: [
            { slug },
            { name: { $regex: new RegExp(`^${newCategoryName}$`, 'i') } }
          ]
        });

        if (existingCategory) {
          targetCatId = existingCategory._id;
        } else {
          const newCategory = await Category.create({
            name: newCategoryName,
            slug,
            createdBy: req.user._id,
            approvalMethod: 'admin_override',
            status: 'active'
          });
          targetCatId = newCategory._id;
        }
      }

      if (!targetCatId) {
        return res.status(400).json({
          success: false,
          message: 'A valid existing category ID or new category name must be provided for approval.'
        });
      }

      const validCategory = await Category.findById(targetCatId);
      if (!validCategory) {
        return res.status(400).json({ success: false, message: 'Selected category does not exist.' });
      }

      product.category = validCategory._id;
      product.status = 'active';
      await product.save();

      auditLog.decision = 'APPROVED_NEW_CATEGORY';
      auditLog.finalCategoryId = validCategory._id;
      auditLog.reason = 'Manually approved and categorized by TrustPayEcommerce Administrator.';
      await auditLog.save();

      await logAction(req.user._id, 'APPROVE_AI_PRODUCT_REVIEW', auditLog.productId, { categoryId: targetCatId });

      return res.status(200).json({
        success: true,
        message: 'Product approved, categorized, and published live successfully.',
        product
      });
    }

    return res.status(400).json({ success: false, message: 'Invalid action provided. Use APPROVE or REJECT.' });

  } catch (error) {
    console.error('Error resolving AI review:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while resolving review.',
      error: error.message
    });
  }
};