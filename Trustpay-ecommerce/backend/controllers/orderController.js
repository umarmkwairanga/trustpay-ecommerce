import Order from '../models/Order.js';
import AuditLog from '../models/AuditLog.js';
import flw from '../services/flutterwave.js';
import { sendOrderNotification } from '../services/notificationService.js';
import { addLoyaltyPoints } from './loyaltyController.js';

// 1. Create a new order
export const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, reference, sellerId } = req.body; 
        const newOrder = new Order({
            buyer: req.user.id,
            seller: sellerId,
            items, 
            totalAmount,
            reference, 
            status: 'pending'
        });
        await newOrder.save();
        
        await AuditLog.create({
            userId: req.user.id,
            action: 'CREATE_ORDER',
            targetId: newOrder._id,
            details: `Order created with reference: ${reference}`
        });

        res.status(201).json({ message: "Order created successfully", orderId: newOrder._id });
    } catch (err) {
        res.status(500).json({ message: "Error creating order", error: err.message });
    }
};

// 2. Verify Payment
export const verifyPayment = async (req, res) => {
    const { transaction_id } = req.body; 
    try {
        const response = await flw.Transaction.verify({ id: transaction_id });

        if (response.data.status === "successful") {
            const order = await Order.findOneAndUpdate(
                { reference: response.data.tx_ref },
                { status: 'paid' },
                { new: true }
            ).populate('buyer');
            
            if (order) {
                await AuditLog.create({
                    userId: order.buyer._id,
                    action: 'PAYMENT_VERIFIED',
                    targetId: order._id,
                    details: `Flutterwave payment successful: ${transaction_id}`
                });

                if (order.buyer?.phoneNumber) {
                    await sendOrderNotification(order.buyer.phoneNumber, order._id, 'PAID');
                }
            }
            res.status(200).json({ message: "Payment verified", order });
        } else {
            res.status(400).json({ message: "Payment verification failed" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error verifying payment", error: err.message });
    }
};

// 3. Confirm delivery (CEO Approval Required for Payout)
export const confirmDelivery = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        
        if (!order) return res.status(404).json({ message: "Order not found" });
        if (order.status === 'delivered') return res.status(400).json({ message: "Order already marked as delivered" });
        
        // Update status only. Payout is now handled by the CEO manually.
        order.status = 'delivered'; 
        await order.save();
        
        await AuditLog.create({
            userId: req.user.id,
            action: 'DELIVERY_CONFIRMED',
            targetId: order._id,
            details: `Delivery confirmed. Awaiting CEO payout approval.`
        });

        res.status(200).json({ message: "Delivery confirmed. Order is now in the CEO Approval Queue." });
    } catch (err) {
        res.status(500).json({ message: "Delivery confirmation failed", error: err.message });
    }
};

// 4. Dispute Handler
export const disputeOrder = async (req, res) => {
    try {
        const { orderId, reason } = req.body;
        const order = await Order.findByIdAndUpdate(orderId, 
            { status: 'disputed', disputeNotes: reason }, { new: true }).populate('buyer');
        
        await AuditLog.create({
            userId: req.user.id,
            action: 'DISPUTE_OPENED',
            targetId: orderId,
            details: `Dispute opened for order ${orderId}. Reason: ${reason}`
        });

        if (order && order.buyer?.phoneNumber) {
            await sendOrderNotification(order.buyer.phoneNumber, order._id, 'DISPUTED');
        }
        res.status(200).json({ message: "Dispute opened. Funds are locked.", order });
    } catch (err) {
        res.status(500).json({ message: "Error opening dispute", error: err.message });
    }
};

// 5. Admin Resolution
export const resolveDispute = async (req, res) => {
    try {
        const { orderId, resolution } = req.body; 
        const order = await Order.findById(orderId).populate('seller buyer');
        
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (resolution === 'release-to-seller') {
            const transferResponse = await flw.Transfer.initiate({
                account_bank: order.seller.bankCode,
                account_number: order.seller.accountNumber,
                amount: order.totalAmount,
                currency: "NGN",
                narration: `Resolution payout for ${orderId}`
            });

            if (transferResponse.status === "success") {
                order.status = 'completed';
                await order.save();
                res.status(200).json({ message: "Dispute resolved: Funds released" });
            }
        } else {
            order.status = 'completed';
            order.disputeNotes = "Resolved: Refunded to buyer";
            await order.save();
            res.status(200).json({ message: "Dispute resolved: Marked as refunded" });
        }
    } catch (err) {
        res.status(500).json({ message: "Resolution failed", error: err.message });
    }
};