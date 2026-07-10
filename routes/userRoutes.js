import express from 'express';
import { updateProfile, getProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes for handling profile and banking info
router.route('/profile')
    .get(protect, getProfile)
    .put(protect, updateProfile);

export default router;