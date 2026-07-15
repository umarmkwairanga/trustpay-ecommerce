import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
    // Destructure everything from req.body (including the fraud data added by middleware)
    const { items, totalAmount, riskScore, fraudReasoning } = req.body;
    
    try {
        const newOrder = await Order.create({
            buyer: req.user.id, // Ensure this matches your Order schema field name
            items,
            totalAmount,
            // Save the AI insights
            riskScore,
            fraudReasoning,
            // Set status to 'flagged' if the risk is moderate; otherwise 'pending'
            status: riskScore >= 40 ? 'flagged' : 'pending'
        });

        res.status(201).json({
            message: "Order placed successfully",
            order: newOrder
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to place order", error: error.message });
    }
};