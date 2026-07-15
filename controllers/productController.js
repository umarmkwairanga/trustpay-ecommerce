import Product from '../models/Product.js';

export const addProduct = async (req, res) => {
    try {
        // Extracting data from the request body
        const { name, price, category, stock, description } = req.body;
        
        // Creating the product instance
        const newProduct = new Product({
            name,
            price,
            category,
            stock,
            description,
            // If you are using multer, req.file will contain the image path
            imagePath: req.file ? req.file.path : null
        });

        // Saving to MongoDB
        const savedProduct = await newProduct.save();

        res.status(201).json({ 
            message: 'Product added successfully!', 
            product: savedProduct 
        });
    } catch (error) {
        res.status(400).json({ 
            message: "Error adding product", 
            error: error.message 
        });
    }
};