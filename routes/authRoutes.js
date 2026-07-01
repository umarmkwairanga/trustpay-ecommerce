import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Debug: This will print to your terminal when the server starts
console.log("Auth Routes Initialized");

// Base route for testing connection
router.get('/', (req, res) => {
    res.json({ message: "Auth routes are active" });
});

router.post('/register', register);
router.post('/login', login);

export default router;