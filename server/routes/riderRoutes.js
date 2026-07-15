import express from 'express';
import { getAvailableDeliveries, updateDeliveryStatus } from '../controllers/riderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('rider')); // Only riders can access these

router.get('/my-deliveries', getAvailableDeliveries);
router.put('/update-status/:deliveryId', updateDeliveryStatus);

export default router;