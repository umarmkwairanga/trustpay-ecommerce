import express from 'express';
// 1. Change this to a standard static import
import * as productController from '../controllers/productController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validate.js';
import { productSchema } from '../validations/productValidation.js';

const router = express.Router();

// 2. Now you can use the controller functions directly
// Added validation and auth middleware to secure the route
router.post('/add-product', authMiddleware, validateRequest(productSchema), productController.addProduct);

export default router;