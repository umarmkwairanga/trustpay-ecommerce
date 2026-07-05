import Product from '../models/Product.js';

// @desc    Get all products (with optional filtering/search)
export const getProducts = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        // Filter by category if provided
        if (category) {
            query.category = category;
        }

        // Search by name (case-insensitive) if provided
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(query);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error: Unable to fetch products" });
    }
};

// @desc    Create a new product
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        
        // Basic check to ensure required fields exist
        if (!name || !price || !category) {
            return res.status(400).json({ message: "Please include name, price, and category" });
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock
        });

        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create product" });
    }
};