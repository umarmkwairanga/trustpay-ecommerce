import Product from '../models/Product.js';

export const addProduct = async (req, res) => {
    try {
        // Destructure all required fields defined in your schema
        const { name, description, price, category, condition, imagePath, stock } = req.body;
        
        // Validation: Ensure required fields are provided
        if (!name || !price || !category || !condition || !imagePath) {
            return res.status(400).json({ message: "Please provide all required fields (name, price, category, condition, imagePath)" });
        }

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            condition, // Capturing the new field
            imagePath,
            stock: stock || 0,
            seller: req.user.id // Assigning to logged-in user
        });

        await newProduct.save();
        res.status(201).json({ message: "Product listed successfully", product: newProduct });
    } catch (err) {
        console.error("Error listing product:", err);
        res.status(500).json({ message: "Error listing product", error: err.message });
    }
};