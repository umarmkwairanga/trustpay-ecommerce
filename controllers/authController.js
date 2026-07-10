import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
    try {
        // Let the Model's pre-save hook handle the hashing and phone sanitization
        const user = await User.create(req.body);
        
        res.status(201).json({ 
            message: "User registered successfully",
            userId: user._id 
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Use select('+password') if your schema sets password to { select: false }
        const user = await User.findOne({ email });
        
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { id: user._id, role: user.role }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1d' }
            );
            
            res.json({ 
                token, 
                role: user.role,
                username: user.username 
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
};