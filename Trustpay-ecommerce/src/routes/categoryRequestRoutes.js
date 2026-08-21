import express from 'express';
import { 
  requestCategory, 
  getCategoryRequests, 
  reviewCategoryRequest, 
  getApprovedCategories 
} from '../controllers/categoryRequestController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / Provider route to fetch active categories for listing creation
router.get('/approved', protect, getApprovedCategories);

// Service Provider route to submit a category request
router.post('/request', protect, authorize('service_provider'), requestCategory);

// Admin routes for managing requests
router.get('/admin/requests', protect, authorize('admin', 'Super Admin', 'ceo'), getCategoryRequests);
router.put('/admin/requests/:requestId', protect, authorize('admin', 'Super Admin', 'ceo'), reviewCategoryRequest);

export default router;