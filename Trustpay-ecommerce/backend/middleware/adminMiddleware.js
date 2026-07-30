const jwt = import('jsonwebtoken');

export default = (req, res, next) => {
  try {
    // 1. Get the token from header
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 2. Check if user is an admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: "Access Denied: Admins Only" });
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Authentication failed" });
  }
};