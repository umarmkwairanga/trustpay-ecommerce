const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const payoutController = require('../controllers/payoutController'); // Added
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Protect all routes with authentication
router.use(protect);

// Apply role-based access for Admin and CEO
router.use(restrictTo('admin', 'ceo'));

// Dashboard Stats
router.get('/stats', adminController.getDashboardStats);

// Disputes & Audit
router.patch('/resolve-dispute', adminController.resolveDispute);
router.get('/audit-logs', adminController.getAuditLogs);

// AI Moderation & Review Queue Routes (NEW)
router.get('/ai-reviews', adminController.getAiReviewsQueue);
router.post('/ai-reviews/resolve', adminController.resolveAiReview);

// Financial Management Routes
router.post('/release-funds/:escrowId', adminController.releaseFunds); // Added
router.post('/process-payout', payoutController.processPayout);      // Added

// User & Seller Management
router.get('/disputes', adminController.getActiveDisputes);
router.get('/transactions', adminController.getTransactionLogs);
router.get('/users', adminController.getAllUsers);
router.patch('/update-verification', adminController.updateUserVerification);
router.get('/sellers', adminController.getSellerApplications);
router.patch('/update-seller', adminController.updateSellerStatus);

// CMS Routes
router.get('/content/:page', adminController.getPageContent);
router.patch('/content/update', adminController.updatePageContent);

module.exports = router;