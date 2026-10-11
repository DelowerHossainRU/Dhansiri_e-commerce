const { verifyAccessToken } = require('../utils/token');
const User = require('../models/User');
const { sendError } = require('../utils/apiResponse');
const { ROLES } = require('../config/constants');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return sendError(res, 401, 'Authentication required. Please sign in.');
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('+role +pricingTier +status');

    if (!user) {
      return sendError(res, 401, 'User account no longer exists.');
    }

    if (user.status === 'Suspended') {
      return sendError(res, 403, 'Your account has been suspended. Please contact administrator.');
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 401, 'Invalid or expired authentication token.');
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id).select('+role +pricingTier +status');
      if (user && user.status === 'Active') {
        req.user = user;
      }
    }
    next();
  } catch (err) {
    // Silently continue without user
    next();
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required.');
    }

    // Super Admin has universal access
    if (req.user.role === ROLES.SUPER_ADMIN) {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 403, `Access denied. Role [${req.user.role}] is not authorized for this resource.`);
    }

    next();
  };
};

module.exports = {
  protect,
  optionalAuth,
  authorize
};
