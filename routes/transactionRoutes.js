import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
    logTransaction, 
    updateTransactionStatus, 
    getHistory 
} from '../controllers/transactionController.js';

const router = express.Router();

// Route: POST /api/transactions/
// Purpose: Log a new transaction (typically called by system)
router.post('/', protect, logTransaction);

// Route: PUT /api/transactions/update
// Purpose: Update status (Escrow transitions)
router.put('/update', protect, updateTransactionStatus);

// Route: GET /api/transactions/history
// Purpose: View transaction history for Buyer or Seller dashboard
router.get('/history', protect, getHistory);

export default router;