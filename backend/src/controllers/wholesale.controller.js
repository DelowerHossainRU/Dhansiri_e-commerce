const wholesaleService = require('../services/wholesale.service');
const { sendResponse, sendError } = require('../utils/apiResponse');

const submitApplication = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const application = await wholesaleService.submitApplication(req.body, userId);
    return sendResponse(res, 201, 'Wholesale account application submitted successfully. Our trade desk will review your documents.', application);
  } catch (error) {
    next(error);
  }
};

const getApplications = async (req, res, next) => {
  try {
    const applications = await wholesaleService.getApplications(req.query);
    return sendResponse(res, 200, 'Applications retrieved', applications);
  } catch (error) {
    next(error);
  }
};

const reviewApplication = async (req, res, next) => {
  try {
    const application = await wholesaleService.reviewApplication(req.params.id, {
      ...req.body,
      reviewerId: req.user._id
    });
    return sendResponse(res, 200, `Application has been ${req.body.status}`, application);
  } catch (error) {
    next(error);
  }
};

// Distributors
const submitDistributorApplication = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const distributor = await wholesaleService.submitDistributorApplication(req.body, userId);
    return sendResponse(res, 201, 'Distributor franchise application received.', distributor);
  } catch (error) {
    next(error);
  }
};

const getDistributors = async (req, res, next) => {
  try {
    const distributors = await wholesaleService.getDistributors();
    return sendResponse(res, 200, 'Distributors retrieved', distributors);
  } catch (error) {
    next(error);
  }
};

// Quotations
const requestQuotation = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const quotation = await wholesaleService.requestQuotation(req.body, userId);
    return sendResponse(res, 201, 'Quotation request submitted.', quotation);
  } catch (error) {
    next(error);
  }
};

const getQuotations = async (req, res, next) => {
  try {
    const userId = ['Admin', 'Super Admin'].includes(req.user.role) ? null : req.user._id;
    const quotations = await wholesaleService.getQuotations(userId);
    return sendResponse(res, 200, 'Quotations retrieved', quotations);
  } catch (error) {
    next(error);
  }
};

const getQuotationById = async (req, res, next) => {
  try {
    const quotation = await wholesaleService.getQuotationById(req.params.id);
    return sendResponse(res, 200, 'Quotation details retrieved', quotation);
  } catch (error) {
    next(error);
  }
};

const updateQuotationStatus = async (req, res, next) => {
  try {
    const quotation = await wholesaleService.updateQuotationStatus(req.params.id, req.body.status);
    return sendResponse(res, 200, 'Quotation status updated', quotation);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitApplication,
  getApplications,
  reviewApplication,
  submitDistributorApplication,
  getDistributors,
  requestQuotation,
  getQuotations,
  getQuotationById,
  updateQuotationStatus
};
