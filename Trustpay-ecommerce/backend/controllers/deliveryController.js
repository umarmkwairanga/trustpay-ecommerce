import Delivery from '../models/Delivery.js';
import Order from '../models/Order.js';

export const updateDeliveryStatus = async (req, res) => {
    try {
        const { status } = req.body; // e.g., 'delivered'
        
        // 1. Update the Delivery record
        const delivery = await Delivery.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );

        if (!delivery) return res.status(404).json({ message: "Delivery not found" });

        // 2. IF delivered, update the Order status so it appears in the Payout Dashboard
        if (status === 'delivered') {
            await Order.findByIdAndUpdate(delivery.order, { status: 'delivered' });
            console.log(`Order ${delivery.order} marked as delivered. Ready for payout.`);
        }

        res.status(200).json({ message: "Delivery status updated", delivery });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};