const ROLES = {
  CUSTOMER: 'Customer',
  WHOLESALE_CUSTOMER: 'Wholesale Customer',
  DISTRIBUTOR: 'Distributor',
  SALES_REP: 'Sales Representative',
  STAFF: 'Staff',
  MANAGER: 'Manager',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super Admin'
};

const ORDER_STATUSES = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  PACKED: 'Packed',
  SHIPPED: 'Shipped',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  RETURNED: 'Returned',
  REFUNDED: 'Refunded'
};

const PAYMENT_STATUSES = {
  PENDING: 'Pending',
  PAID: 'Paid',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
  PARTIAL: 'Partial'
};

const PAYMENT_METHODS = {
  COD: 'Cash on Delivery',
  BKASH: 'bKash',
  NAGAD: 'Nagad',
  ROCKET: 'Rocket',
  BANK_TRANSFER: 'Bank Transfer',
  CREDIT_LINE: 'Credit Line'
};

const INVENTORY_MOVEMENT_TYPES = {
  PURCHASE: 'Purchase',
  SALE: 'Sale',
  RETURN: 'Return',
  DAMAGE: 'Damage',
  ADJUSTMENT: 'Adjustment',
  TRANSFER: 'Transfer'
};

const LEAD_STAGES = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  QUOTATION: 'Quotation',
  NEGOTIATION: 'Negotiation',
  WON: 'Won',
  LOST: 'Lost'
};

const LEAD_SOURCES = {
  WEBSITE: 'Website',
  FACEBOOK: 'Facebook',
  PHONE: 'Phone',
  WHATSAPP: 'WhatsApp',
  REFERRAL: 'Referral',
  DISTRIBUTOR: 'Distributor',
  RETAILER: 'Retailer',
  EXHIBITION: 'Exhibition',
  OTHER: 'Other'
};

const SUPPORT_STATUSES = {
  OPEN: 'Open',
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed'
};

const PRICING_TIERS = {
  RETAIL: 'retail',
  WHOLESALE: 'wholesale',
  DISTRIBUTOR: 'distributor',
  CORPORATE: 'corporate'
};

module.exports = {
  ROLES,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PAYMENT_METHODS,
  INVENTORY_MOVEMENT_TYPES,
  LEAD_STAGES,
  LEAD_SOURCES,
  SUPPORT_STATUSES,
  PRICING_TIERS
};
