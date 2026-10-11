const adminService = require('../services/admin.service');
const { sendResponse, sendError } = require('../utils/apiResponse');

const getDashboardMetrics = async (req, res, next) => {
  try {
    const data = await adminService.getDashboardMetrics();
    return sendResponse(res, 200, 'Dashboard metrics retrieved', data);
  } catch (error) {
    next(error);
  }
};

const getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate, format } = req.query;
    const report = await adminService.getSalesReport(startDate, endDate);
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="sales-report.csv"');
      return res.status(200).send(report.csvContent);
    }
    return sendResponse(res, 200, 'Sales report retrieved', report);
  } catch (error) {
    next(error);
  }
};

const getInventoryReport = async (req, res, next) => {
  try {
    const { format } = req.query;
    const report = await adminService.getInventoryReport();
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="inventory-report.csv"');
      return res.status(200).send(report.csvContent);
    }
    return sendResponse(res, 200, 'Inventory report retrieved', report);
  } catch (error) {
    next(error);
  }
};

// Coupons
const getCoupons = async (req, res, next) => {
  try {
    const coupons = await adminService.getCoupons();
    return sendResponse(res, 200, 'Coupons retrieved', coupons);
  } catch (error) {
    next(error);
  }
};

const createCoupon = async (req, res, next) => {
  try {
    const coupon = await adminService.createCoupon(req.body);
    return sendResponse(res, 201, 'Coupon created', coupon);
  } catch (error) {
    next(error);
  }
};

const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await adminService.updateCoupon(req.params.id, req.body);
    return sendResponse(res, 200, 'Coupon updated', coupon);
  } catch (error) {
    next(error);
  }
};

const deleteCoupon = async (req, res, next) => {
  try {
    await adminService.deleteCoupon(req.params.id);
    return sendResponse(res, 200, 'Coupon deleted');
  } catch (error) {
    next(error);
  }
};

// Audit logs
const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await adminService.getAuditLogs(req.query.limit);
    return sendResponse(res, 200, 'Audit logs retrieved', logs);
  } catch (error) {
    next(error);
  }
};

// Upload media
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 400, 'No file uploaded.');
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    return sendResponse(res, 200, 'File uploaded successfully', {
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardMetrics,
  getSalesReport,
  getInventoryReport,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAuditLogs,
  uploadFile
};
