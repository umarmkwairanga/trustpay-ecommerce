import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { 
    getAllRestaurants, 
    getMenu, 
    updateMenu 
} from '../controllers/restaurantController.js';

const router = express.Router();

// Public: Get all restaurants for the food list
router.get('/', getAllRestaurants);

// Public: Get menu for a specific restaurant
router.get('/:id/menu', getMenu);

// Protected: Restaurant owner updates their own menu
router.put('/menu', protect, restrictTo('restaurant-owner'), updateMenu);

export default router;