import express from 'express';
import { getProducts, createProduct } from '../controllers/productController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
// Only admins can post new products!
router.post('/', protect, restrictTo('admin'), createProduct);

export default router;