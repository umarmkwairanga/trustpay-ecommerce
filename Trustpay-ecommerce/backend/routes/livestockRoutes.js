import express from 'express';
import {
  createLivestock,
  getLivestock,
  getLivestockById,
  updateLivestock,
  deleteLivestock,
  generateLivestockDescription // NEW: Imported function
} from '../controllers/livestockController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public Routes
router.get('/', getLivestock);

// Protected Routes
// NOTE: Put specific routes before dynamic /:id routes!
router.post('/generate-description', protect, generateLivestockDescription); // NEW: AI Route
router.post('/', protect, createLivestock);

// Dynamic ID routes
router.get('/:id', getLivestockById);
router.put('/:id', protect, updateLivestock);
router.delete('/:id', protect, deleteLivestock);

export default router;