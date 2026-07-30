// controllers/productController.js
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

export const addProduct = asyncHandler(async (req, res) => {
    const newProduct = new Product({
        ...req.body,
        imagePath: req.file ? req.file.path : null
    });
    const savedProduct = await newProduct.save();
    res.status(201).json({ message: 'Product added successfully!', product: savedProduct });
});

export const updateProduct = asyncHandler(async (req, res) => {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedProduct) {
        const err = new Error("Product not found");
        err.statusCode = 404;
        throw err;
    }
    res.json(updatedProduct);
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
        const err = new Error("Product not found");
        err.statusCode = 404;
        throw err;
    }
    res.json({ message: "Product deleted successfully" });
});