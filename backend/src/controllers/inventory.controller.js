const inventoryService = require('../services/inventory.service');
const { sendResponse } = require('../utils/apiResponse');

const getInventory = async (req, res, next) => {
  try {
    const items = await inventoryService.getInventory(req.query);
    return sendResponse(res, 200, 'Inventory items retrieved', items);
  } catch (error) {
    next(error);
  }
};

const adjustStock = async (req, res, next) => {
  try {
    const { productId, variantSku, warehouseId, adjustedQty, reason, type } = req.body;
    const result = await inventoryService.adjustStock({
      productId,
      variantSku,
      warehouseId,
      adjustedQty,
      reason,
      type,
      performedBy: req.user._id
    });
    return sendResponse(res, 200, 'Stock adjusted successfully', result);
  } catch (error) {
    next(error);
  }
};

const getMovements = async (req, res, next) => {
  try {
    const movements = await inventoryService.getMovements(req.query);
    return sendResponse(res, 200, 'Inventory movements retrieved', movements);
  } catch (error) {
    next(error);
  }
};

// Suppliers
const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await inventoryService.getSuppliers();
    return sendResponse(res, 200, 'Suppliers retrieved', suppliers);
  } catch (error) {
    next(error);
  }
};

const createSupplier = async (req, res, next) => {
  try {
    const supplier = await inventoryService.createSupplier(req.body);
    return sendResponse(res, 201, 'Supplier added successfully', supplier);
  } catch (error) {
    next(error);
  }
};

const updateSupplier = async (req, res, next) => {
  try {
    const supplier = await inventoryService.updateSupplier(req.params.id, req.body);
    return sendResponse(res, 200, 'Supplier updated', supplier);
  } catch (error) {
    next(error);
  }
};

// Purchase Orders
const getPurchaseOrders = async (req, res, next) => {
  try {
    const orders = await inventoryService.getPurchaseOrders();
    return sendResponse(res, 200, 'Purchase orders retrieved', orders);
  } catch (error) {
    next(error);
  }
};

const createPurchaseOrder = async (req, res, next) => {
  try {
    const po = await inventoryService.createPurchaseOrder(req.body, req.user._id);
    return sendResponse(res, 201, 'Purchase order created successfully', po);
  } catch (error) {
    next(error);
  }
};

const receivePurchaseOrder = async (req, res, next) => {
  try {
    const po = await inventoryService.receivePurchaseOrder(req.params.id, req.body, req.user._id);
    return sendResponse(res, 200, 'Purchase order received and inventory updated', po);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInventory,
  adjustStock,
  getMovements,
  getSuppliers,
  createSupplier,
  updateSupplier,
  getPurchaseOrders,
  createPurchaseOrder,
  receivePurchaseOrder
};
