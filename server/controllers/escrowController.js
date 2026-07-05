import Order from '../models/Order.js';

// @desc    Buyer confirms delivery and releases funds from escrow
export const releaseFunds = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);

        if (!order || order.status !== 'in-escrow') {
            return res.status(400).json({ message: "Order not eligible for fund release" });
        }

        // Verify that the user triggering this is the buyer
        if (order.buyer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Logic: Transition status to completed
        order.status = 'completed';
        order.resolvedAt = Date.now();
        await order.save();

        // [FUTURE STEP]: Trigger Payout to Seller's bank account
        
        res.status(200).json({ message: "Funds released to seller successfully" });
    } catch (error) {
        res.status(500).json({ message: "Escrow release failed" });
    }
};