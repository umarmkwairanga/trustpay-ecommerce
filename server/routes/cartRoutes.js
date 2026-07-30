import express from 'express';
import { getCart, addToCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All cart routes import login
router.get('/', getCart);
router.post('/', addToCart);

export default router;