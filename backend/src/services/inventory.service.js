const Inventory = require('../models/Inventory');
const InventoryMovement = require('../models/InventoryMovement');
const Warehouse = require('../models/Warehouse');
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const PurchaseOrder = require('../models/PurchaseOrder');
const { INVENTORY_MOVEMENT_TYPES } = require('../config/constants');

class InventoryService {
  async getInventory(query = {}) {
    const { warehouseId, lowStockOnly, search } = query;
    const filter = {};

    if (warehouseId) filter.warehouse = warehouseId;

    const items = await Inventory.find(filter)
      .populate('product', 'name sku featuredImage variants')
      .populate('warehouse', 'name code district');

    let result = items;
    if (lowStockOnly === 'true') {
      result = result.filter(item => item.stock <= item.lowStockThreshold);
    }
    if (search) {
      result = result.filter(item => 
        (item.product && item.product.name.toLowerCase().includes(search.toLowerCase())) ||
        item.variantSku.toLowerCase().includes(search.toLowerCase())
      );
    }

    return result;
  }

  async adjustStock({ productId, variantSku, warehouseId, adjustedQty, reason, type, performedBy }) {
    let inventory = await Inventory.findOne({
      product: productId,
      variantSku,
      warehouse: warehouseId
    });

    if (!inventory) {
      inventory = await Inventory.create({
        product: productId,
        variantSku,
        warehouse: warehouseId,
        stock: 0
      });
    }

    const previousStock = inventory.stock;
    inventory.stock = Math.max(0, inventory.stock + Number(adjustedQty));
    await inventory.save();

    // Also update aggregate on Product model variant
    await Product.updateOne(
      { _id: productId, 'variants.variantSku': variantSku },
      { $inc: { 'variants.$.stock': Number(adjustedQty) } }
    );

    // Record movement ledger
    const movement = await InventoryMovement.create({
      product: productId,
      variantSku,
      warehouse: warehouseId,
      type: type || INVENTORY_MOVEMENT_TYPES.ADJUSTMENT,
      quantity: Number(adjustedQty),
      balanceAfter: inventory.stock,
      referenceType: 'AuditAdjustment',
      reason: reason || 'Manual inventory adjustment',
      performedBy
    });

    return { inventory, movement };
  }

  async getMovements(query = {}) {
    const { productId, type, limit = 50 } = query;
    const filter = {};
    if (productId) filter.product = productId;
    if (type) filter.type = type;

    return await InventoryMovement.find(filter)
      .populate('product', 'name sku')
      .populate('warehouse', 'name code')
      .populate('performedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit));
  }

  // Suppliers
  async getSuppliers() {
    return await Supplier.find().populate('riceVarietiesSupplied', 'name').sort({ companyName: 1 });
  }

  async createSupplier(data) {
    return await Supplier.create(data);
  }

  async updateSupplier(id, data) {
    return await Supplier.findByIdAndUpdate(id, data, { new: true });
  }

  // Purchase Orders
  async getPurchaseOrders() {
    return await PurchaseOrder.find()
      .populate('supplier', 'companyName contactPerson phone district')
      .populate('warehouse', 'name code')
      .populate('items.riceVariety', 'name')
      .sort({ createdAt: -1 });
  }

  async createPurchaseOrder(data, createdBy) {
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const count = await PurchaseOrder.countDocuments();
    const poNumber = `PO-${dateStr}-${(count + 101)}`;

    data.poNumber = poNumber;
    data.createdBy = createdBy;
    return await PurchaseOrder.create(data);
  }

  async receivePurchaseOrder(poId, receivedData, performedBy) {
    const po = await PurchaseOrder.findById(poId);
    if (!po) throw new Error('Purchase order not found');

    po.status = 'Received';
    po.receivedAt = new Date();
    await po.save();

    // Update inventory for received items
    for (const item of po.items) {
      if (item.product && item.variantSku) {
        await this.adjustStock({
          productId: item.product,
          variantSku: item.variantSku,
          warehouseId: po.warehouse,
          adjustedQty: item.bagQuantity,
          reason: `Procurement PO ${po.poNumber} intake from ${po.supplier}`,
          type: INVENTORY_MOVEMENT_TYPES.PURCHASE,
          performedBy
        });
      }
    }

    return po;
  }
}

module.exports = new InventoryService();
