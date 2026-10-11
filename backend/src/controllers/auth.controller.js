const authService = require('../services/auth.service');
const { sendResponse, sendError } = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, businessProfile } = req.body;
    if (!name || !email || !password || !phone) {
      return sendError(res, 400, 'Please provide name, email, password, and phone number.');
    }
    const result = await authService.register({ name, email, password, phone, role, businessProfile });
    return sendResponse(res, 201, 'Account successfully registered.', result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 400, 'Please enter email and password.');
    }
    const result = await authService.login(email, password);
    return sendResponse(res, 200, 'Login successful.', result);
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    const result = await authService.refreshToken(token);
    return sendResponse(res, 200, 'Token refreshed successfully.', result);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user._id);
    return sendResponse(res, 200, 'Profile retrieved.', user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user._id, req.body);
    return sendResponse(res, 200, 'Profile updated successfully.', user);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return sendError(res, 400, 'Both current and new password are required.');
    }
    await authService.changePassword(req.user._id, currentPassword, newPassword);
    return sendResponse(res, 200, 'Password changed successfully.');
  } catch (error) {
    next(error);
  }
};

const addAddress = async (req, res, next) => {
  try {
    const addresses = await authService.addAddress(req.user._id, req.body);
    return sendResponse(res, 201, 'Address added successfully.', addresses);
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const addresses = await authService.deleteAddress(req.user._id, req.params.addressId);
    return sendResponse(res, 200, 'Address deleted successfully.', addresses);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  getMe,
  updateProfile,
  changePassword,
  addAddress,
  deleteAddress
};
