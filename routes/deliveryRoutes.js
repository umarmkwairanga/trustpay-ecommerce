import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { 
    assignRider, 
    updateStatus 
} from '../controllers/deliveryController.js';

const router = express.Router();

// Route: POST /api/delivery/assign
// Purpose: Admin assigns a rider to a delivery (Restricted to admin)
router.post('/assign', protect, restrictTo('admin'), assignRider);

// Route: PUT /api/delivery/update-status
// Purpose: Rider updates the delivery status (Restricted to rider)
router.put('/update-status', protect, restrictTo('rider'), updateStatus);

export default router;