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

/**
 * Middleware to enforce Role-Based Access Control (RBAC) and verify approval status for providers
 * @param {string[]} allowedRoles - Array of roles permitted to access the route
 */
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: No user attached to request" });
        }

        // Check if user's role is allowed
        const isAllowed = allowedRoles.some(role => 
            role.toLowerCase() === req.user.role?.toLowerCase()
        );

        if (!isAllowed) {
            return res.status(403).json({ 
                message: `Forbidden: Role '${req.user.role}' is not authorized to access this resource` 
            });
        }

        // Ensure providers are approved before they can perform restricted actions (e.g., create listings)
        const isProvider = req.user.role?.toLowerCase().includes('provider') || req.user.role?.toLowerCase() === 'seller';
        const bypassStatusCheck = ['super admin', 'admin', 'ceo', 'customer', 'buyer'].includes(req.user.role?.toLowerCase());

        if (isProvider && !bypassStatusCheck && req.user.status && req.user.status !== 'approved') {
            return res.status(403).json({ 
                message: `Account status is '${req.user.status}'. Approved account status is required to manage resources.` 
            });
        }

        next();
    };
};