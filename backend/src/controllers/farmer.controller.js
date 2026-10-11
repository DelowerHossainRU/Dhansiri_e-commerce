const farmerService = require('../services/farmer.service');
const { sendResponse, sendError } = require('../utils/apiResponse');

const getFarmers = async (req, res, next) => {
  try {
    const result = await farmerService.getFarmers(req.query);
    return sendResponse(res, 200, 'Farmers retrieved successfully', result.farmers, {
      total: result.total,
      page: result.page,
      totalPages: result.totalPages
    });
  } catch (error) {
    next(error);
  }
};

const getFarmerById = async (req, res, next) => {
  try {
    const farmer = await farmerService.getFarmerById(req.params.id);
    return sendResponse(res, 200, 'Farmer details retrieved', farmer);
  } catch (error) {
    next(error);
  }
};

const applyFarmer = async (req, res, next) => {
  try {
    const farmer = await farmerService.applyFarmer(req.body);
    return sendResponse(res, 201, 'Farmer application submitted successfully. Our sourcing team will contact you.', farmer);
  } catch (error) {
    next(error);
  }
};

const createFarmer = async (req, res, next) => {
  try {
    const farmer = await farmerService.createFarmer(req.body);
    return sendResponse(res, 201, 'Farmer profile created', farmer);
  } catch (error) {
    next(error);
  }
};

const updateFarmer = async (req, res, next) => {
  try {
    const farmer = await farmerService.updateFarmer(req.params.id, req.body);
    return sendResponse(res, 200, 'Farmer profile updated', farmer);
  } catch (error) {
    next(error);
  }
};

const updateVerification = async (req, res, next) => {
  try {
    let statusVal = req.body.verificationStatus || req.body.status;
    if (statusVal) {
      statusVal = statusVal.charAt(0).toUpperCase() + statusVal.slice(1).toLowerCase();
    }
    const { notes } = req.body;
    const farmer = await farmerService.updateVerification(req.params.id, statusVal, notes);
    return sendResponse(res, 200, 'Farmer verification status updated', farmer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFarmers,
  getFarmerById,
  applyFarmer,
  createFarmer,
  updateFarmer,
  updateVerification
};
