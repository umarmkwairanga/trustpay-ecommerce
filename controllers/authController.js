import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { asyncHandler } from '../utils/asyncHandler.js';

// 1. Register: Uses Model pre-save hook for password hashing
export const register = asyncHandler(async (req, res) => {
    const user = await User.create(req.body);
    
    res.status(201).json({ 
        message: "User registered successfully",
        userId: user._id 
    });
});

// 2. Login: Verifies credentials and issues a role-based JWT
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    // Ensure your User model schema has 'select: false' on the password field
    const user = await User.findOne({ email }).select('+password');
    
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );
        
        res.json({ 
            token, 
            role: user.role,
            username: user.name 
        });
    } else {
        // Create an error to be caught by the central errorHandler
        const err = new Error("Invalid credentials");
        err.statusCode = 401;
        throw err;
    }
});