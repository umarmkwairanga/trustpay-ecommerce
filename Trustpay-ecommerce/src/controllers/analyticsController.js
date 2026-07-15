import Order from '../models/Order.js';

export const getPlatformStats = async (req, res) => {
    try {
        const totalSales = await Order.aggregate([
            { $match: { status: 'paid' } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        
        res.status(200).json({ 
            totalRevenue: totalSales[0]?.total || 0,
            activeOrders: await Order.countDocuments({ status: 'pending' })
        });
    } catch (error) {
        res.status(500).json({ message: "Analytics fetch failed" });
    }
};