const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { ROLES } = require('../config/constants');

// All inventory endpoints protected for staff/manager/admin
router.use(protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.STAFF));

router.get('/', inventoryController.getInventory);
router.post('/adjust', inventoryController.adjustStock);
router.get('/movements', inventoryController.getMovements);

// Suppliers
router.get('/suppliers', inventoryController.getSuppliers);
router.post('/suppliers', inventoryController.createSupplier);
router.put('/suppliers/:id', inventoryController.updateSupplier);

// Purchase Orders
router.get('/purchases', inventoryController.getPurchaseOrders);
router.post('/purchases', inventoryController.createPurchaseOrder);
router.post('/purchases/:id/receive', inventoryController.receivePurchaseOrder);

module.exports = router;
