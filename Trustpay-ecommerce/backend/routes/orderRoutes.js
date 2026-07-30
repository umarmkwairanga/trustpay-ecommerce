import express from 'express';
import Transaction from '../models/Transaction.js'; // Ensure this points to your new Transaction model
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import flw from '../services/flutterwave.js'; // Flutterwave SDK import
import { 
    createOrder, 
    confirmDelivery, 
    disputeOrder, 
    resolveDispute 
} from '../controllers/orderController.js';

const router = express.Router();

// 1. Create a new order
router.post('/', protect, createOrder);

// 2. Verify payment (Now updates Transaction to HELD using Flutterwave SDK)
router.post('/verify-payment', protect, async (req, res) => {
    const { transaction_id } = req.body;

    try {
        const response = await flw.Transaction.verify({ id: transaction_id });

        if (response.data.status === 'successful') {
            // Update the Transaction model to 'HELD' status using tx_ref
            const updatedTxn = await Transaction.findOneAndUpdate(
                { reference: response.data.tx_ref }, 
                { status: 'HELD' },
                { new: true }
            );

            if (!updatedTxn) {
                return res.status(404).json({ message: "Transaction not found" });
            }

            res.status(200).json({ message: "Payment verified, funds HELD in escrow", transaction: updatedTxn });
        } else {
            res.status(400).json({ message: "Payment not successful on Flutterwave" });
        }
    } catch (error) {
        res.status(500).json({ message: "Verification server error", error: error.message });
    }
});

// 3. Confirm delivery (Triggers funds release from HELD to RELEASED)
router.put('/:orderId/confirm-delivery', protect, restrictTo('buyer'), async (req, res) => {
    try {
        const txn = await Transaction.findOneAndUpdate(
            { _id: req.params.orderId, status: 'HELD' },
            { status: 'RELEASED' },
            { new: true }
        );

        if (!txn) return res.status(400).json({ message: "Cannot release funds: Transaction not HELD or not found" });

        res.status(200).json({ message: "Delivery confirmed. Funds RELEASED to seller.", transaction: txn });
    } catch (error) {
        res.status(500).json({ message: "Error confirming delivery", error: error.message });
    }
});

// 4. Dispute handling
router.put('/dispute', protect, restrictTo('buyer'), disputeOrder);

// 5. Admin resolution
router.put('/admin/resolve', protect, restrictTo('admin'), resolveDispute);

export default router;