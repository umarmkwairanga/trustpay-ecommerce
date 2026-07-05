import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    // Log incoming Authorization header
    console.log("--- DEBUG: Incoming Auth Header ---", req.headers.authorization);

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            // Log the secret being used and the token
            console.log("--- DEBUG: Verifying Token ---");
            console.log("Token:", token);
            console.log("Secret Available:", !!process.env.JWT_SECRET);

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: "User not found" });
            }

            console.log("--- DEBUG: Auth Success for User:", req.user._id, "---");
            return next();
        } catch (error) {
            console.error("--- DEBUG: JWT Verification Error ---");
            console.error("Error Message:", error.message);
            
            return res.status(401).json({ 
                message: "Not authorized, token failed",
                error: error.message 
            });
        }
    }

    return res.status(401).json({ message: "Not authorized, no token" });
};

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission' });
        }
        next();
    };
};