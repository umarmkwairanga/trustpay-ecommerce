const express = require('express');
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getCart)     // View cart
    .post(protect, addToCart); // Add item

router.delete('/:productId', protect, removeFromCart); // Remove item

module.exports = router;