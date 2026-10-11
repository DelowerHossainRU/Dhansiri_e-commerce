const qualityService = require('../services/quality.service');
const { sendResponse, sendError } = require('../utils/apiResponse');

const getInspections = async (req, res, next) => {
  try {
    const result = await qualityService.getInspections(req.query);
    return sendResponse(res, 200, 'Quality inspection records retrieved', result.inspections, {
      total: result.total,
      page: result.page,
      totalPages: result.totalPages
    });
  } catch (error) {
    next(error);
  }
};

const getInspectionById = async (req, res, next) => {
  try {
    const inspection = await qualityService.getInspectionById(req.params.id);
    return sendResponse(res, 200, 'Quality inspection record retrieved', inspection);
  } catch (error) {
    next(error);
  }
};

const createInspection = async (req, res, next) => {
  try {
    const inspection = await qualityService.createInspection(req.body, req.user ? req.user._id : null);
    return sendResponse(res, 201, 'Quality inspection record created', inspection);
  } catch (error) {
    next(error);
  }
};

const updateInspection = async (req, res, next) => {
  try {
    const inspection = await qualityService.updateInspection(req.params.id, req.body);
    return sendResponse(res, 200, 'Quality inspection record updated', inspection);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInspections,
  getInspectionById,
  createInspection,
  updateInspection
};
