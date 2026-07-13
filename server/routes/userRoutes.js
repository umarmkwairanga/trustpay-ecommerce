import express from 'express';
import { updateUserSettings } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'; // Ensure you have your auth middleware

const router = express.Router();

// The PUT route to save settings
router.put('/update-settings', protect, updateUserSettings);

export default router;