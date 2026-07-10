import express from 'express';
import { register, login } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js'; // Import the middleware

const router = express.Router();

// Route for testing
router.get('/', (req, res) => res.json({ message: "Connected" }));

// Registration and Login
router.post('/register', register);
router.post('/login', login);

// Protected Profile Route
router.get('/profile', protect, (req, res) => {
    res.json({ message: "This is your private profile data", user: req.user });
});

export default router;