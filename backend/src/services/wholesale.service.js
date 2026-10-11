const WholesaleApplication = require('../models/WholesaleApplication');
const Distributor = require('../models/Distributor');
const Quotation = require('../models/Quotation');
const User = require('../models/User');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const { ROLES, PRICING_TIERS, ORDER_STATUSES, PAYMENT_STATUSES } = require('../config/constants');

class WholesaleService {
  async submitApplication(data, userId = null) {
    if (userId) data.user = userId;
    const application = await WholesaleApplication.create(data);
    return application;
  }

  async getApplications(query = {}) {
    const { status } = query;
    const filter = status ? { status } : {};
    return await WholesaleApplication.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
  }

  async reviewApplication(applicationId, { status, assignedPricingTier, creditLimit, paymentTermsDays, adminRemarks, reviewerId }) {
    const application = await WholesaleApplication.findById(applicationId);
    if (!application) throw new Error('Wholesale application not found');

    application.status = status;
    application.adminRemarks = adminRemarks;
    application.reviewedBy = reviewerId;
    application.reviewedAt = new Date();

    if (status === 'Approved') {
      application.assignedPricingTier = assignedPricingTier || PRICING_TIERS.WHOLESALE;
      application.approvedCreditLimit = creditLimit || 0;
      application.paymentTermsDays = paymentTermsDays || 0;

      // If user exists, upgrade user role and tier
      if (application.user) {
        await User.findByIdAndUpdate(application.user, {
          role: ROLES.WHOLESALE_CUSTOMER,
          pricingTier: assignedPricingTier || PRICING_TIERS.WHOLESALE,
          'businessProfile.companyName': application.companyName,
          'businessProfile.businessType': application.businessType,
          'businessProfile.tradeLicenseNumber': application.tradeLicenseNumber,
          'businessProfile.creditLimit': creditLimit || 0,
          'businessProfile.paymentTermsDays': paymentTermsDays || 0,
          'businessProfile.isApproved': true
        });

        await Notification.create({
          user: application.user,
          title: 'Wholesale B2B Account Approved!',
          message: `Your corporate account for ${application.companyName} has been approved with tier ${assignedPricingTier || 'Wholesale'}. You can now view bulk rates and place institutional orders.`,
          type: 'WHOLESALE_APPROVAL',
          link: '/wholesale/dashboard'
        });
      }
    }

    await application.save();
    return application;
  }

  // Distributors
  async submitDistributorApplication(data, userId = null) {
    if (userId) data.user = userId;
    return await Distributor.create(data);
  }

  async getDistributors() {
    return await Distributor.find()
      .populate('user', 'name email phone')
      .populate('assignedSalesRep', 'name phone email')
      .sort({ createdAt: -1 });
  }

  // Quotations
  async requestQuotation(data, userId = null) {
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const count = await Quotation.countDocuments();
    const quotationNumber = `QT-${dateStr}-${(count + 101)}`;

    data.quotationNumber = quotationNumber;
    if (userId) data.customer = userId;
    if (!data.validUntil) {
      data.validUntil = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 days validity
    }

    return await Quotation.create(data);
  }

  async getQuotations(userId = null) {
    const filter = userId ? { customer: userId } : {};
    return await Quotation.find(filter)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name sku featuredImage')
      .sort({ createdAt: -1 });
  }

  async getQuotationById(id) {
    const quotation = await Quotation.findById(id)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name sku featuredImage');
    if (!quotation) throw new Error('Quotation not found');
    return quotation;
  }

  async updateQuotationStatus(id, status) {
    const quotation = await Quotation.findById(id);
    if (!quotation) throw new Error('Quotation not found');
    quotation.status = status;
    await quotation.save();
    return quotation;
  }
}

module.exports = new WholesaleService();
