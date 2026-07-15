import Delivery from '../models/Delivery.js';

// Assign a rider to an order
export const assignRider = async (req, res) => {
    try {
        const { deliveryId, riderId } = req.body;
        const delivery = await Delivery.findByIdAndUpdate(
            deliveryId, 
            { riderId, status: 'assigned' }, 
            { new: true }
        );
        res.status(200).json({ message: "Rider assigned", delivery });
    } catch (error) {
        res.status(500).json({ message: "Error assigning rider" });
    }
};

// Update delivery status (e.g., picked-up, delivered)
export const updateStatus = async (req, res) => {
    try {
        const { deliveryId, status } = req.body;
        const delivery = await Delivery.findByIdAndUpdate(deliveryId, { status }, { new: true });
        res.status(200).json({ message: "Status updated", delivery });
    } catch (error) {
        res.status(500).json({ message: "Error updating status" });
    }
};