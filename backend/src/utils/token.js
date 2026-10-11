const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      role: user.role, 
      email: user.email,
      pricingTier: user.pricingTier 
    },
    process.env.JWT_SECRET || 'dhansiri_agro_jwt_super_secret_key_2026_secured',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET || 'dhansiri_agro_jwt_refresh_super_secret_key_2026_secured',
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
  );
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'dhansiri_agro_jwt_super_secret_key_2026_secured');
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'dhansiri_agro_jwt_refresh_super_secret_key_2026_secured');
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
