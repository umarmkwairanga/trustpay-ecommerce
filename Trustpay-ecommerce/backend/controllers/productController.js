import Product from '../models/Product.js'; // Use ESM import with .js extension

export const addProduct = async (req, res) => {
    try {
        const { title, description, price, images } = req.body;
        
        // req.user is populated by your authMiddleware
        const newProduct = new Product({
            title,
            description,
            price,
            images,
            seller: req.user.id // Assigning the product to the logged-in user
        });

        await newProduct.save();
        res.status(201).json({ message: "Product listed successfully", product: newProduct });
    } catch (err) {
        res.status(500).json({ message: "Error listing product", error: err.message });
    }
};