import Product from '../models/Product.js';

// 1. Get all products (sorted by newest)
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ createdAt: -1 })
            .populate('sellerId', 'name email'); // Link seller details
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};

// 2. Get products by category (kind)
export const getByCategory = async (req, res) => {
    const { kind } = req.params; 
    try {
        const products = await Product.find({ kind: kind })
            .sort({ createdAt: -1 })
            .populate('sellerId', 'name');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching category", error: error.message });
    }
};

// 3. Get only the logged-in user's listings (for Profile page)
export const getMyListings = async (req, res) => {
    try {
        // Requires authentication middleware to have set req.user
        const listings = await Product.find({ sellerId: req.user.id })
            .sort({ createdAt: -1 });
        res.status(200).json(listings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user listings", error: error.message });
    }
};