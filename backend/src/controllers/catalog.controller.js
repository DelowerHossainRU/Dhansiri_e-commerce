const catalogService = require('../services/catalog.service');
const { sendResponse } = require('../utils/apiResponse');

// Categories
const getCategories = async (req, res, next) => {
  try {
    const onlyActive = req.query.all !== 'true';
    const categories = await catalogService.getCategories(onlyActive);
    return sendResponse(res, 200, 'Categories retrieved', categories);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const category = await catalogService.createCategory(req.body);
    return sendResponse(res, 201, 'Category created', category);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await catalogService.updateCategory(req.params.id, req.body);
    return sendResponse(res, 200, 'Category updated', category);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    await catalogService.deleteCategory(req.params.id);
    return sendResponse(res, 200, 'Category deleted');
  } catch (error) {
    next(error);
  }
};

// Rice Varieties
const getVarieties = async (req, res, next) => {
  try {
    const onlyActive = req.query.all !== 'true';
    const varieties = await catalogService.getVarieties(onlyActive);
    return sendResponse(res, 200, 'Rice varieties retrieved', varieties);
  } catch (error) {
    next(error);
  }
};

const createVariety = async (req, res, next) => {
  try {
    const variety = await catalogService.createVariety(req.body);
    return sendResponse(res, 201, 'Rice variety created', variety);
  } catch (error) {
    next(error);
  }
};

const updateVariety = async (req, res, next) => {
  try {
    const variety = await catalogService.updateVariety(req.params.id, req.body);
    return sendResponse(res, 200, 'Rice variety updated', variety);
  } catch (error) {
    next(error);
  }
};

const deleteVariety = async (req, res, next) => {
  try {
    await catalogService.deleteVariety(req.params.id);
    return sendResponse(res, 200, 'Rice variety deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getVarieties,
  createVariety,
  updateVariety,
  deleteVariety
};
