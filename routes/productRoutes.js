const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// This line tells the app: When you see /add-product, use the addProduct function
router.post('/add-product', productController.addProduct);

module.exports = router;