import Order from '../models/Order.js';
import AuditLog from '../models/AuditLog.js';
import flw from '../services/flutterwave.js';
import { sendOrderNotification } from '../services/notificationService.js';

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

// 2. Verify Payment via Flutterwave
export const verifyPayment = async (req, res) => {
    const { transaction_id } = req.body; 
    try {
        const response = await flw.Transaction.verify({ id: transaction_id });

        if (response.data.status === "successful") {
            const order = await Order.findOneAndUpdate(
                { reference: response.data.tx_ref },
                { 
                    status: 'paid',
                    flutterwaveTransactionId: response.data.data.id // CRITICAL: Store this for refunds
                },
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

// 3. Confirm delivery and release funds
export const confirmDelivery = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate('seller buyer');
        
        if (!order) return res.status(404).json({ message: "Order not found" });
        if (order.status !== 'paid') return res.status(400).json({ message: "Order not eligible for payout" });
        
        const transferResponse = await flw.Transfer.initiate({
            account_bank: order.seller.bankCode, 
            account_number: order.seller.accountNumber,
            amount: order.totalAmount,
            currency: "NGN",
            narration: `Payout for order ${order._id}`,
            reference: `payout_${order._id}`
        });

        if (transferResponse.status === "success") {
            order.status = 'delivered';
            await order.save();
            
            await AuditLog.create({
                userId: req.user.id,
                action: 'RELEASE_ESCROW',
                targetId: order._id,
                details: `Funds released to seller ${order.seller.name}`
            });

            if (order.buyer?.phoneNumber) await sendOrderNotification(order.buyer.phoneNumber, order._id, 'DELIVERED');
            res.status(200).json({ message: "Funds released to seller successfully" });
        }
    } catch (err) {
        res.status(500).json({ message: "Payout failed", error: err.message });
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

        if (order?.buyer?.phoneNumber) await sendOrderNotification(order.buyer.phoneNumber, order._id, 'DISPUTED');
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
        if (order.status !== 'disputed') return res.status(400).json({ message: "Order is not in dispute" });

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
                res.status(200).json({ message: "Dispute resolved: Funds released to seller" });
            }
        } else {
            // REFUND LOGIC
            const refundResponse = await flw.Transaction.refund({
                id: order.flutterwaveTransactionId,
                amount: order.totalAmount
            });

            if (refundResponse.status === "success") {
                order.status = 'refunded';
                order.disputeNotes = "Resolved: Refunded to buyer via Flutterwave";
                await order.save();
                
                await AuditLog.create({
                    userId: req.user.id,
                    action: 'DISPUTE_RESOLVED_REFUND',
                    targetId: orderId,
                    details: `Dispute resolved: Refunded to buyer`
                });
                res.status(200).json({ message: "Dispute resolved: Refunded to buyer" });
            } else {
                throw new Error("Flutterwave refund failed");
            }
        }
    } catch (err) {
        res.status(500).json({ message: "Resolution failed", error: err.message });
    }
};