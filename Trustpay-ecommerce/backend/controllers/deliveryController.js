const Delivery = import('../models/Delivery');

// Update delivery status (e.g., set to 'delivered')
exports.updateDeliveryStatus = async (req, res) => {
    try {
        const { status, trackingNumber } = req.body;
        const delivery = await Delivery.findByIdAndUpdate(
            req.params.id, 
            { status, trackingNumber }, 
            { new: true }
        );
        res.status(200).json(delivery);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};