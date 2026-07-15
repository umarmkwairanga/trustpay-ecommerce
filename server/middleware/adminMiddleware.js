export const admin = (req, res, next) => {
    // req.user is populated by your existing auth middleware
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Not authorized as an admin" });
    }
};