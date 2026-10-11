const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/token');
const { ROLES, PRICING_TIERS } = require('../config/constants');

class AuthService {
  async register(data) {
    const existing = await User.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      const error = new Error('An account with this email address already exists.');
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
      phone: data.phone,
      role: data.role && [ROLES.CUSTOMER, ROLES.WHOLESALE_CUSTOMER].includes(data.role) ? data.role : ROLES.CUSTOMER,
      pricingTier: data.role === ROLES.WHOLESALE_CUSTOMER ? PRICING_TIERS.WHOLESALE : PRICING_TIERS.RETAIL,
      businessProfile: data.businessProfile || {},
      status: 'Active'
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.refreshToken;

    return { user: safeUser, accessToken, refreshToken };
  }

  async login(email, password) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password +refreshToken');
    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    if (user.status === 'Suspended') {
      const error = new Error('Your account has been suspended. Please contact customer administration.');
      error.statusCode = 403;
      throw error;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.refreshToken;

    return { user: safeUser, accessToken, refreshToken };
  }

  async refreshToken(token) {
    if (!token) {
      const error = new Error('Refresh token is required.');
      error.statusCode = 401;
      throw error;
    }

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      const error = new Error('Invalid refresh token.');
      error.statusCode = 401;
      throw error;
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    user.refreshToken = newRefreshToken;
    await user.save();

    return { accessToken, refreshToken: newRefreshToken };
  }

  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async updateProfile(userId, updateData) {
    const allowed = ['name', 'phone', 'avatar', 'businessProfile'];
    const sanitized = {};
    for (const key of allowed) {
      if (updateData[key] !== undefined) sanitized[key] = updateData[key];
    }

    const user = await User.findByIdAndUpdate(userId, sanitized, { new: true, runValidators: true });
    return user;
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      const error = new Error('Current password does not match.');
      error.statusCode = 400;
      throw error;
    }

    user.password = newPassword;
    await user.save();
    return true;
  }

  async addAddress(userId, addressData) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if (addressData.isDefault) {
      user.addresses.forEach(a => { a.isDefault = false; });
    } else if (user.addresses.length === 0) {
      addressData.isDefault = true;
    }

    user.addresses.push(addressData);
    await user.save();
    return user.addresses;
  }

  async deleteAddress(userId, addressId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    user.addresses = user.addresses.filter(a => a._id.toString() !== addressId);
    await user.save();
    return user.addresses;
  }
}

module.exports = new AuthService();
