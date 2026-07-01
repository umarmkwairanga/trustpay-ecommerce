const express = import('express');
const router = express.Router();
const adminController = import('../controllers/adminController');
const payoutController = import('../controllers/payoutController'); // Added
const { protect, restrictTo } = import('../middleware/authMiddleware');

// Protect all routes with authentication
router.use(protect);

// Apply role-based access for Admin and CEO
router.use(restrictTo('admin', 'ceo'));

// Dashboard Stats
router.get('/stats', adminController.getDashboardStats);

// Disputes & Audit
router.patch('/resolve-dispute', adminController.resolveDispute);
router.get('/audit-logs', adminController.getAuditLogs);

// Financial Management Routes
router.post('/release-funds/:escrowId', adminController.releaseFunds); // Added
router.post('/process-payout', payoutController.processPayout);       // Added

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