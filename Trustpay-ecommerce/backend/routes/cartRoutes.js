const express = import('express');
const { addToCart, getCart, removeFromCart } = import('../controllers/cartController');
const { protect } = import('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getCart)     // View cart
    .post(protect, addToCart); // Add item

router.delete('/:productId', protect, removeFromCart); // Remove item

export default router;