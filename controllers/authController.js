import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// 1. Register: Uses Model pre-save hook for password hashing
export const register = async (req, res) => {
    try {
        const user = await User.create(req.body);
        
        res.status(201).json({ 
            message: "User registered successfully",
            userId: user._id 
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// 2. Login: Verifies credentials and issues a role-based JWT
export const login = async (req, res) => {
    try {
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
                username: user.name // Assuming you store name as 'name'
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ error: "Login failed: " + err.message });
    }
};