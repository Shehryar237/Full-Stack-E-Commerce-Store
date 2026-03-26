const jwt = require('jsonwebtoken');

// check if user is authenticated
exports.authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // if no token is provided
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, email, role }
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    };

    // if logged in and has admin role
    exports.adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
};
