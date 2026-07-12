import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

// GET all active categories
// @route   GET /api/categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST a new category
// @route   POST /api/categories
router.post('/', async (req, res) => {
    console.log('DEBUG: POST /api/categories received:', req.body);
    try {
        const { name, description, image, inspectionWindow, requiresShippingProof, riskRating, commissionRate } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        // Automatically generate a clean, URL-friendly slug from the category name
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const categoryExists = await Category.findOne({ slug });
        if (categoryExists) {
            return res.status(400).json({ error: 'Category already exists' });
        }

        const newCategory = new Category({
            name,
            slug,
            description,
            image,
            inspectionWindow,
            requiresShippingProof,
            riskRating,
            commissionRate
        });

        await newCategory.save();
        console.log('DEBUG: Category saved successfully');
        res.status(201).json(newCategory);
    } catch (err) {
        console.error('DEBUG: Save error:', err.message);
        res.status(400).json({ error: err.message });
    }
});

export default router;