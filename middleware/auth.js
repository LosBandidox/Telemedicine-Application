const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Authentication middleware
exports.isAuthenticated = (req, res, next) => {
  const token = req.session.token;
  if (!token) {
    return res.status(401).json({ message: 'You are not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin authorization middleware
exports.isAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.userId);
    if (!admin) {
      return res.status(403).json({ message: 'You are not authorized' });
    }
    next();
  } catch (err) {
    next(err);
  }
};
