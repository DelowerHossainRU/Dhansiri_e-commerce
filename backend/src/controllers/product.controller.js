const productService = require('../services/product.service');
const { sendResponse, sendError } = require('../utils/apiResponse');

const getProducts = async (req, res, next) => {
  try {
    const userTier = req.user ? req.user.pricingTier : 'retail';
    const result = await productService.getProducts(req.query, userTier);
    return sendResponse(res, 200, 'Products fetched successfully', result.products, result.pagination);
  } catch (error) {
    next(error);
  }
};

const getProductBySlug = async (req, res, next) => {
  try {
    const result = await productService.getProductBySlug(req.params.slug);
    return sendResponse(res, 200, 'Product details retrieved', result);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    return sendResponse(res, 200, 'Product retrieved', product);
  } catch (error) {
    next(error);
  }
};

const getSeasonalProducts = async (req, res, next) => {
  try {
    const products = await productService.getSeasonalProducts(req.query.limit || 8);
    return sendResponse(res, 200, 'Seasonal products retrieved', products);
  } catch (error) {
    next(error);
  }
};

const getFreshHarvest = async (req, res, next) => {
  try {
    const products = await productService.getFreshHarvest(req.query.limit || 8);
    return sendResponse(res, 200, 'Freshly harvested products retrieved', products);
  } catch (error) {
    next(error);
  }
};

const getBestSellers = async (req, res, next) => {
  try {
    const products = await productService.getBestSellers(req.query.limit || 8);
    return sendResponse(res, 200, 'Best seller products retrieved', products);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    return sendResponse(res, 201, 'Product created successfully', product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    return sendResponse(res, 200, 'Product updated successfully', product);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    return sendResponse(res, 200, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  getProductById,
  getSeasonalProducts,
  getFreshHarvest,
  getBestSellers,
  createProduct,
  updateProduct,
  deleteProduct
};
