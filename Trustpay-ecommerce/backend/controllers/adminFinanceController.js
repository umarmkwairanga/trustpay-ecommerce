// controllers/adminFinanceController.js
import Order from '../models/Order.js';
import flw from '../services/flutterwave.js';
import AuditLog from '../models/AuditLog.js';

export const approvePayout = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId).populate('seller');

        if (!order || order.status !== 'delivered') {
            return res.status(400).json({ message: "Order not eligible for payout" });
        }

        // Trigger Flutterwave Transfer
        const transferResponse = await flw.Transfer.initiate({
            account_bank: order.seller.bankCode,
            account_number: order.seller.accountNumber,
            amount: order.totalAmount,
            currency: "NGN",
            narration: `CEO Approved Payout for order ${order._id}`,
            reference: `ceo_payout_${order._id}`
        });

        if (transferResponse.status === "success") {
            order.status = 'completed'; // Move to final state
            await order.save();
            
            await AuditLog.create({
                userId: req.user.id, // This will be the CEO/Admin ID
                action: 'CEO_APPROVED_PAYOUT',
                targetId: order._id,
                details: `CEO released funds to seller: ${order.seller.businessName}`
            });

            res.status(200).json({ message: "Payout approved and funds released" });
        }
    } catch (err) {
        res.status(500).json({ message: "CEO Payout Approval failed", error: err.message });
    }
};