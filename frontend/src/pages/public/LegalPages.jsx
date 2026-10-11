import React from 'react';

export const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-serif-display text-3xl font-bold text-slate-900 mb-6">Terms of Trade & Commercial Sale</h1>
      <div className="space-y-6 text-sm text-[#52525B] leading-relaxed font-light">
        <p>Welcome to Dhansiri Agro Industries Ltd. By accessing our platform or placing orders, you agree to comply with the terms set forth below.</p>
        <h3 className="font-serif-display text-base font-bold text-slate-900">1. Product Specifications & Moisture Standards</h3>
        <p>All grain shipments comply with Bangladesh BSTI BDS 1819 standards. Moisture is stabilized at 12.8% to 13.5%. Minor optical variation is natural across seasonal harvests.</p>
        <h3 className="font-serif-display text-base font-bold text-slate-900">2. Wholesale & Commercial Deliveries</h3>
        <p>Wholesale quotations remain valid for 15 calendar days from issuance. Payment terms are strictly enforced under the approved credit limit.</p>
        <h3 className="font-serif-display text-base font-bold text-slate-900">3. Pricing & Taxes</h3>
        <p>All retail prices are shown in Bangladeshi Taka (৳ BDT). Commercial invoices include official Mushak 6.3 documentation where applicable.</p>
      </div>
    </div>
  );
};

export const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-serif-display text-3xl font-bold text-slate-900 mb-6">Privacy & Data Governance Policy</h1>
      <div className="space-y-6 text-sm text-[#52525B] leading-relaxed font-light">
        <p>Dhansiri Agro respects the privacy of our customers, farmers, and wholesale partners. We collect information solely to fulfill orders, conduct trade verifications, and provide delivery tracking notifications.</p>
        <h3 className="font-serif-display text-base font-bold text-slate-900">1. Information Collection</h3>
        <p>We collect names, phone numbers, delivery addresses, and business registration documents (for wholesale accounts). We do not store full credit card or mobile wallet pins.</p>
        <h3 className="font-serif-display text-base font-bold text-slate-900">2. Security</h3>
        <p>All customer transactions and data are protected using TLS encryption, bcrypt hashing, and role-based access control.</p>
      </div>
    </div>
  );
};

export const ReturnsPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-serif-display text-3xl font-bold text-slate-900 mb-6">Quality Guarantee, Refund & Return Policy</h1>
      <div className="space-y-6 text-sm text-[#52525B] leading-relaxed font-light">
        <p>We take pride in our zero-broken and optical sortex sorting standards. If an order fails to meet our stated specifications, we provide an immediate replacement or full refund.</p>
        <h3 className="font-serif-display text-base font-bold text-slate-900">1. Return Eligibility</h3>
        <p>Grain packs may be returned within 48 hours of doorstep delivery if the package seal was breached during transport, or if moisture levels exceed standard limits.</p>
        <h3 className="font-serif-display text-base font-bold text-slate-900">2. Refund Processing</h3>
        <p>Approved refunds are credited back to the original bKash/Nagad or bank account within 3 business days.</p>
      </div>
    </div>
  );
};

export const ShippingPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-serif-display text-3xl font-bold text-slate-900 mb-6">Shipping Coverage & Fulfillment Policy</h1>
      <div className="space-y-6 text-sm text-[#52525B] leading-relaxed font-light">
        <h3 className="font-serif-display text-base font-bold text-slate-900">1. Delivery Zones</h3>
        <p>Dhaka City Metropolitan: 24 to 48 hours delivery via our dedicated van fleet. Free shipping on orders over ৳2,500.</p>
        <p>Nationwide (All 64 Districts): Dispatched via premier courier logistics with full airway bill tracking, arriving within 3 to 5 business days.</p>
        <h3 className="font-serif-display text-base font-bold text-slate-900">2. Bulk Freight Logistics</h3>
        <p>Commercial orders exceeding 1 Metric Ton are dispatched by dedicated 3-ton to 10-ton flatbed covered trucks directly from the Dinajpur or Tejgaon silos.</p>
      </div>
    </div>
  );
};
