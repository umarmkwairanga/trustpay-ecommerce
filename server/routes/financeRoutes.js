import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { transferFromEscrow } from '../controllers/walletController.js';

const router = express.Router();

// Only Finance Officers and Super Admins can move money
router.patch('/release-funds', 
    protect, 
    authorizeRoles('Finance Officer', 'Super Admin'), 
    transferFromEscrow
);

export default router;