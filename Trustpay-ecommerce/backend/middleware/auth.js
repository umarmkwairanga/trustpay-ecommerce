import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 1. Middleware to verify the user is logged in
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach the user to the request object
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// 2. Middleware to verify the user has the 'ceo' role
export const authorizeCEO = (req, res, next) => {
  if (req.user && req.user.role === 'ceo') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. CEO status required.' });
  }
};