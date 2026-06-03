const express = require('express');
const router = express.Router();
// Import all logic from your controller
const { 
    getProducts, 
    getProductById, 
    createProduct 
} = require('../controllers/productController');

// Define routes by mapping them directly to controller functions
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);

module.exports = router;