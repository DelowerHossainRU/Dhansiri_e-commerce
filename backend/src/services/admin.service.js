const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Inventory = require('../models/Inventory');
const WholesaleApplication = require('../models/WholesaleApplication');
const Quotation = require('../models/Quotation');
const Coupon = require('../models/Coupon');
const AuditLog = require('../models/AuditLog');
const Farmer = require('../models/Farmer');
const QualityInspection = require('../models/QualityInspection');
const PurchaseOrder = require('../models/PurchaseOrder');
const Warehouse = require('../models/Warehouse');
const { ORDER_STATUSES, PAYMENT_STATUSES } = require('../config/constants');

class AdminService {
  async getDashboardMetrics() {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: ORDER_STATUSES.PENDING });
    const totalCustomers = await User.countDocuments({ role: { $in: ['Customer', 'Wholesale Customer', 'Distributor'] } });
    const totalProducts = await Product.countDocuments();
    const seasonalProducts = await Product.countDocuments({ isSeasonal: true });
    const totalFarmers = await Farmer.countDocuments();
    const verifiedFarmers = await Farmer.countDocuments({ verificationStatus: 'Verified' });
    const qualityInspectionsCount = await QualityInspection.countDocuments();
    const pendingWholesale = await WholesaleApplication.countDocuments({ status: 'Pending' });
    const pendingQuotations = await Quotation.countDocuments({ status: 'Sent' });

    // Aggregate total revenue from non-cancelled orders
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: ORDER_STATUSES.CANCELLED } } },
      { $group: { _id: null, totalRevenue: { $sum: '$grandTotal' }, totalKg: { $sum: '$totalWeightKg' } } }
    ]);

    const totalRevenue = revenueAgg.length ? revenueAgg[0].totalRevenue : 0;
    const totalTonsSold = revenueAgg.length ? (revenueAgg[0].totalKg / 1000) : 0;
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Low stock count
    const lowStockInventories = await Inventory.countDocuments({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] }
    });

    // Recent 5 orders
    const recentOrders = await Order.find()
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(6);

    // Monthly sales aggregation for chart
    const monthlySales = await Order.aggregate([
      { $match: { orderStatus: { $ne: ORDER_STATUSES.CANCELLED } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$grandTotal' },
          ordersCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    // Top selling products by items
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productName',
          totalQuantity: { $sum: '$items.quantity' },
          totalSales: { $sum: '$items.totalPrice' }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]);

    // Warehouse stock summary
    const warehouses = await Warehouse.find({ isActive: true });

    return {
      metrics: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        totalCustomers,
        totalProducts,
        seasonalProducts,
        totalFarmers,
        verifiedFarmers,
        qualityInspectionsCount,
        totalTonsSold: Number(totalTonsSold.toFixed(2)),
        averageOrderValue,
        lowStockCount: lowStockInventories,
        pendingWholesale,
        pendingQuotations,
        warehousesCount: warehouses.length
      },
      monthlySales,
      topProducts,
      recentOrders,
      warehouses
    };
  }

  // Reports Generation (CSV & Data)
  async getSalesReport(startDate, endDate) {
    const filter = { orderStatus: { $ne: ORDER_STATUSES.CANCELLED } };
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(filter)
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });

    let csvContent = 'Order Number,Date,Customer Name,Phone,Grand Total (BDT),Payment Status,Order Status,Delivery Method\n';
    orders.forEach(o => {
      const custName = o.customer ? o.customer.name.replace(/,/g, '') : 'Guest';
      const custPhone = o.customer ? o.customer.phone : o.shippingAddress?.phone || '';
      const date = o.createdAt.toISOString().slice(0, 10);
      csvContent += `${o.orderNumber},${date},${custName},${custPhone},${o.grandTotal},${o.paymentStatus},${o.orderStatus},${o.deliveryMethod || 'Standard'}\n`;
    });

    return { orders, csvContent };
  }

  async getInventoryReport() {
    const inventories = await Inventory.find()
      .populate('product', 'name sku category')
      .populate('warehouse', 'name code district')
      .sort({ stock: 1 });

    let csvContent = 'Product Name,SKU,Variant SKU,Warehouse,Total Stock,Reserved Stock,Available Stock,Low Stock Threshold,Status\n';
    inventories.forEach(inv => {
      const prodName = inv.product ? inv.product.name.replace(/,/g, '') : 'N/A';
      const sku = inv.product ? inv.product.sku : 'N/A';
      const whName = inv.warehouse ? inv.warehouse.name.replace(/,/g, '') : 'N/A';
      const status = inv.stock <= inv.lowStockThreshold ? 'LOW STOCK' : 'HEALTHY';
      csvContent += `${prodName},${sku},${inv.variantSku},${whName},${inv.stock},${inv.reservedStock},${inv.stock - inv.reservedStock},${inv.lowStockThreshold},${status}\n`;
    });

    return { inventories, csvContent };
  }

  // Coupons
  async getCoupons() {
    return await Coupon.find().sort({ createdAt: -1 });
  }

  async createCoupon(data) {
    return await Coupon.create(data);
  }

  async updateCoupon(id, data) {
    const coupon = await Coupon.findByIdAndUpdate(id, data, { new: true });
    if (!coupon) throw new Error('Coupon not found');
    return coupon;
  }

  async deleteCoupon(id) {
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) throw new Error('Coupon not found');
    return coupon;
  }

  // Audit logs
  async getAuditLogs(limit = 100) {
    return await AuditLog.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(Number(limit));
  }
}

module.exports = new AdminService();
