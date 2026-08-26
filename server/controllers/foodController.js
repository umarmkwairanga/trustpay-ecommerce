import FoodOrder from '../models/FoodOrder.js';
import Escrow from '../models/Escrow.js';

export const updateFoodOrderStatus = async (req, res) => {
    const { orderId, status } = req.body; // status: 'preparing', 'out-for-delivery', 'delivered'

    try {
        const order = await FoodOrder.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        // TRIGGER: If delivered, release the funds from Escrow immediately
        if (status === 'delivered') {
            await Escrow.findOneAndUpdate(
                { order: order._id },
                { status: 'released' }
            );
            // Optionally: Trigger notification to restaurant owner here
        }

        res.status(200).json({ message: "Order status updated", order });
    } catch (error) {
        res.status(500).json({ message: "Failed to update order", error: error.message });
    }
};