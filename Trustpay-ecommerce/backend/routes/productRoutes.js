import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js'; 

const router = express.Router();

// GET all products (with optional search and category filters)
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST a new product
router.post('/', async (req, res) => {
    console.log("DEBUG: POST /api/products received:", req.body);
    try {
        const { name, price, category } = req.body;
        
        if (!name || !price || !category) {
            return res.status(400).json({ message: "Please include name, price, and category" });
        }

        const newProduct = new Product(req.body);
        await newProduct.save();
        console.log("DEBUG: Product saved successfully");
        res.status(201).json(newProduct);
    } catch (err) {
        console.error("DEBUG: Save error:", err.message);
        res.status(400).json({ error: err.message });
    }
});

// PUT (Update) an existing product by ID
router.put('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid product ID format" });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a product by ID
router.delete('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid product ID format" });
    }

    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;