const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware: protect routes that require a logged-in user.
 * Reads the Bearer token from Authorization header, verifies it,
 * and attaches the user object to req.user.
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user to request (without password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found. Please log in again.' });
    }

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ message: 'Invalid token. Please log in again.' });
  }
};

/**
 * Middleware: restrict to specific roles.
 * Usage: authorize('admin') or authorize('admin', 'organizer')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. This action requires one of these roles: ${roles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
