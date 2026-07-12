import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_change_me";

export const protect = (req, res, next) => {
    // Look for the token in the "Authorization" header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user info to the request
        next(); // Move to the next function
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};