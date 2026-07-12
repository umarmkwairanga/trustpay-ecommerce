import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
    const { items, totalAmount } = req.body;
    try {
        const newOrder = await Order.create({
            buyerId: req.user.id, // Comes from protect middleware
            items,
            totalAmount
        });
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: "Failed to place order" });
    }
};