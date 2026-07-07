export const isAdmin = (req, res, next) => {
    // Assuming your auth middleware sets req.user
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Admins only." });
    }
};