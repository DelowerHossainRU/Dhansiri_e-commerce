import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, FileText, CheckCircle2, ShieldCheck, Truck, Scale, 
  ArrowRight, Users, PhoneCall, Mail, Award, Clock 
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { toast } from 'sonner';

export const WholesalePortalPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeFormTab, setActiveFormTab] = useState('quote'); // 'quote' | 'apply'
  const [submitting, setSubmitting] = useState(false);

  // Quote Request State
  const [quoteCompany, setQuoteCompany] = useState('');
  const [quoteContactPerson, setQuoteContactPerson] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quoteDistrict, setQuoteDistrict] = useState('Dhaka');
  const [quoteDeliveryAddress, setQuoteDeliveryAddress] = useState('');
  const [quoteVariety, setQuoteVariety] = useState('Chinigura Premium Aromatic');
  const [quoteBagQuantity, setQuoteBagQuantity] = useState(20);
  const [quoteBagWeight, setQuoteBagWeight] = useState(25);

  // Wholesale Registration State
  const [appApplicantName, setAppApplicantName] = useState(user?.name || '');
  const [appCompanyName, setAppCompanyName] = useState('');
  const [appBusinessType, setAppBusinessType] = useState('Hotel / Restaurant / Catering (HORECA)');
  const [appPhone, setAppPhone] = useState(user?.phone || '');
  const [appEmail, setAppEmail] = useState(user?.email || '');
  const [appDistrict, setAppDistrict] = useState('Dhaka');
  const [appAddress, setAppAddress] = useState('');
  const [appTradeLicense, setAppTradeLicense] = useState('');
  const [appMonthlyTon, setAppMonthlyTon] = useState(5);

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const totalKg = quoteBagQuantity * quoteBagWeight;
      const unitRate = quoteVariety.includes('Chinigura') ? 135 : 72; // Est. B2B rate per kg
      const subtotal = totalKg * unitRate;

      const res = await api.post('/wholesale/quotation-request', {
        companyName: quoteCompany,
        contactPerson: quoteContactPerson,
        phone: quotePhone,
        email: quoteEmail,
        district: quoteDistrict,
        deliveryAddress: quoteDeliveryAddress,
        items: [{
          productName: quoteVariety,
          variantSku: `B2B-${quoteBagWeight}KG`,
          bagQuantity: Number(quoteBagQuantity),
          bagWeightKg: Number(quoteBagWeight),
          totalKg,
          unitPrice: unitRate * quoteBagWeight,
          totalPrice: subtotal
        }],
        subtotal,
        deliveryCharge: Math.round(totalKg * 1.5),
        grandTotal: subtotal + Math.round(totalKg * 1.5)
      });

      if (res.success) {
        toast.success(`Formal quotation request #${res.data.quotationNumber} submitted to commercial trade desk!`);
        setQuoteCompany('');
        setQuoteContactPerson('');
        setQuotePhone('');
        setQuoteEmail('');
        setQuoteDeliveryAddress('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit quotation request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.post('/wholesale/apply', {
        applicantName: appApplicantName,
        companyName: appCompanyName,
        businessType: appBusinessType,
        phone: appPhone,
        email: appEmail,
        district: appDistrict,
        address: appAddress,
        tradeLicenseNumber: appTradeLicense,
        estimatedMonthlyTon: Number(appMonthlyTon)
      });

      if (res.success) {
        toast.success('Wholesale account application submitted! Our corporate credit desk will review within 24 hours.');
        setAppCompanyName('');
        setAppTradeLicense('');
        setAppAddress('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Editorial B2B Header */}
      <section
        className="py-16 sm:py-20 border-b transition-colors duration-200"
        style={{
          backgroundColor: 'var(--brand-subtle)',
          borderColor: 'var(--brand-border)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span
              className="text-xs uppercase tracking-widest font-bold block"
              style={{ color: 'var(--brand-accent)' }}
            >
              Commercial Trade & Institutional Division
            </span>
            <h1
              className="font-serif-display text-4xl sm:text-5xl font-bold leading-tight"
              style={{ color: 'var(--brand-primary)' }}
            >
              Enterprise Grain Supply & Wholesale Contracts
            </h1>
            <p className="text-base text-[#52525B] max-w-2xl font-light leading-relaxed">
              Serving Bangladesh’s premier hotels, supermarkets, catering conglomerates, and corporate cafeterias. Guaranteed year-round supply, 13.2% moisture-stabilized grain, official VAT documentation, and direct mill-gate pricing.
            </p>
            <div className="flex flex-wrap gap-4 pt-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white border rounded-xs text-[#1E2420]" style={{ borderColor: 'var(--brand-border)' }}>
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Minimum Order: 250 Kg
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white border rounded-xs text-[#1E2420]" style={{ borderColor: 'var(--brand-border)' }}>
                <Truck className="w-4 h-4 text-emerald-600" /> Dedicated Truck Logistics
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white border rounded-xs text-[#1E2420]" style={{ borderColor: 'var(--brand-border)' }}>
                <Clock className="w-4 h-4 text-emerald-600" /> Net 15-30 Days Credit
              </span>
            </div>
          </div>
          <div
            className="lg:col-span-4 bg-white border p-6 rounded-xs space-y-4 text-xs shadow-md"
            style={{ borderColor: 'var(--brand-border)' }}
          >
            <h3 className="font-serif-display text-base font-bold" style={{ color: 'var(--brand-primary)' }}>
              Direct Trade Desk Contact
            </h3>
            <p className="text-[#52525B]">Reach our institutional desk directly for tenders, high-tonnage quotes, and export inquiries.</p>
            <div className="pt-2 space-y-2.5">
              <div className="flex items-center gap-2 font-semibold text-[#1E2420]">
                <PhoneCall className="w-4 h-4" style={{ color: 'var(--brand-accent)' }} /> +880 1722-111111
              </div>
              <div className="flex items-center gap-2 font-medium text-[#1E2420]">
                <Mail className="w-4 h-4" style={{ color: 'var(--brand-accent)' }} /> b2b@dhansiriagro.com
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Interactive Forms */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form Tabs */}
          <div className="lg:col-span-7 bg-white border border-slate-200 p-6 sm:p-8 rounded-xs shadow-xs">
            <div className="flex border-b border-slate-200 mb-6">
              <button
                onClick={() => setActiveFormTab('quote')}
                className={`flex-1 pb-3 text-xs sm:text-sm font-serif-display font-bold uppercase tracking-wider transition-colors border-b-2 ${
                  activeFormTab === 'quote'
                    ? 'border-slate-800 text-slate-900'
                    : 'border-transparent text-[#71717A] hover:text-slate-900'
                }`}
              >
                1. Request Commercial Quotation
              </button>
              <button
                onClick={() => setActiveFormTab('apply')}
                className={`flex-1 pb-3 text-xs sm:text-sm font-serif-display font-bold uppercase tracking-wider transition-colors border-b-2 ${
                  activeFormTab === 'apply'
                    ? 'border-slate-800 text-slate-900'
                    : 'border-transparent text-[#71717A] hover:text-slate-900'
                }`}
              >
                2. Apply for B2B Account
              </button>
            </div>

            {/* Form 1: Request Commercial Quotation */}
            {activeFormTab === 'quote' && (
              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <p className="text-xs text-[#71717A] mb-4">
                  Generate an official price proposal. Our automated sales desk will issue a formal breakdown with delivery logistics.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Company / Establishment Name *"
                    placeholder="e.g. The Westin Dhaka, Radisson Blu, Shwapno"
                    value={quoteCompany}
                    onChange={(e) => setQuoteCompany(e.target.value)}
                    required
                  />
                  <Input
                    label="Procurement Officer Name *"
                    placeholder="e.g. Md. Ashraful Alam"
                    value={quoteContactPerson}
                    onChange={(e) => setQuoteContactPerson(e.target.value)}
                    required
                  />
                  <Input
                    label="Official Phone Number *"
                    placeholder="e.g. 01711223344"
                    value={quotePhone}
                    onChange={(e) => setQuotePhone(e.target.value)}
                    required
                  />
                  <Input
                    label="Corporate Email *"
                    type="email"
                    placeholder="procurement@company.com"
                    value={quoteEmail}
                    onChange={(e) => setQuoteEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <Select
                    label="Desired Rice Variety *"
                    value={quoteVariety}
                    onChange={(e) => setQuoteVariety(e.target.value)}
                  >
                    <option value="Chinigura Premium Aromatic">Dinajpur Chinigura Aromatic</option>
                    <option value="Miniket Supreme Double-Parboiled">Miniket Supreme (Buhler Auto-Milled)</option>
                    <option value="Nazirshail Aged Shonali">Nazirshail Aged Shonali</option>
                    <option value="Kalijira Royal Fragrant">Sherpur Royal Kalijira</option>
                    <option value="Imperial Aged Royal Basmati">Imperial Aged Royal Basmati</option>
                  </Select>

                  <Input
                    label="Bag Quantity (Sacks) *"
                    type="number"
                    min="10"
                    value={quoteBagQuantity}
                    onChange={(e) => setQuoteBagQuantity(e.target.value)}
                    required
                  />

                  <Select
                    label="Bag Weight Standard *"
                    value={quoteBagWeight}
                    onChange={(e) => setQuoteBagWeight(Number(e.target.value))}
                  >
                    <option value={25}>25 Kg Master Sack</option>
                    <option value={50}>50 Kg Heavy Woven Sack</option>
                  </Select>
                </div>

                <div className="pt-2">
                  <Input
                    label="Fulfillment Delivery Address & Warehouse Location *"
                    placeholder="e.g. Central Warehouse, Tejgaon Industrial Area, Dhaka"
                    value={quoteDeliveryAddress}
                    onChange={(e) => setQuoteDeliveryAddress(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full mt-4" loading={submitting}>
                  Submit Quotation Request <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </form>
            )}

            {/* Form 2: Wholesale Account Registration */}
            {activeFormTab === 'apply' && (
              <form onSubmit={handleApplicationSubmit} className="space-y-4">
                <p className="text-xs text-[#71717A] mb-4">
                  Approved accounts gain access to real-time wholesale catalog pricing, corporate invoicing, and credit lines.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Applicant Full Name *"
                    value={appApplicantName}
                    onChange={(e) => setAppApplicantName(e.target.value)}
                    required
                  />
                  <Input
                    label="Company Name *"
                    placeholder="e.g. Bengal Feast Catering Ltd."
                    value={appCompanyName}
                    onChange={(e) => setAppCompanyName(e.target.value)}
                    required
                  />
                  <Select
                    label="Business Sector *"
                    value={appBusinessType}
                    onChange={(e) => setAppBusinessType(e.target.value)}
                  >
                    <option value="Hotel / Restaurant / Catering (HORECA)">Hotel / Restaurant / Catering (HORECA)</option>
                    <option value="Supermarket Chain">Supermarket Chain</option>
                    <option value="Wholesale Grain Merchant">Wholesale Grain Merchant</option>
                    <option value="Exporter">Exporter</option>
                    <option value="Institutional / Corporate Buyer">Institutional / Corporate Buyer</option>
                    <option value="Retailer">Independent Retailer</option>
                  </Select>
                  <Input
                    label="Trade License Number *"
                    placeholder="TRAD/DNCC/XXXXXX"
                    value={appTradeLicense}
                    onChange={(e) => setAppTradeLicense(e.target.value)}
                    required
                  />
                  <Input
                    label="Contact Phone *"
                    value={appPhone}
                    onChange={(e) => setAppPhone(e.target.value)}
                    required
                  />
                  <Input
                    label="Corporate Email *"
                    type="email"
                    value={appEmail}
                    onChange={(e) => setAppEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <Input
                    label="Registered Commercial Address *"
                    value={appAddress}
                    onChange={(e) => setAppAddress(e.target.value)}
                    required
                  />
                  <Input
                    label="Estimated Monthly Volume (Metric Tons) *"
                    type="number"
                    min="1"
                    value={appMonthlyTon}
                    onChange={(e) => setAppMonthlyTon(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" variant="gold" size="lg" className="w-full mt-4" loading={submitting}>
                  Register Wholesale Business Profile <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </form>
            )}
          </div>

          {/* Right Column: Wholesale Specifications & Benefits */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xs space-y-4">
              <h3 className="font-serif-display text-lg font-bold text-slate-900">
                Institutional Business Advantages
              </h3>
              <div className="space-y-3 text-xs text-[#52525B]">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">Direct Mill-Gate Pricing</span>
                    Save 15% to 22% compared to secondary grain wholesale markets (Badamtoli/Chawkbazar).
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">Guaranteed Batch Homogeneity</span>
                    Zero mixing of BRRI-28 into Miniket or ordinary fine rice into Chinigura.
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">Corporate Credit Facility</span>
                    Flexible Net 15-day and Net 30-day settlement terms for vetted hospitality chains.
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">Tax & VAT Compliant Invoicing</span>
                    Full commercial Challan and Mushak 6.3 compliant invoicing provided with each consignment.
                  </div>
                </div>
              </div>
            </div>

            {/* Bulk Master Sack Specs Box */}
            <div className="p-6 bg-white border border-slate-200 rounded-xs space-y-3">
              <h4 className="font-serif-display text-sm font-bold text-slate-900">Master Packaging Specifications</h4>
              <p className="text-xs text-[#71717A] leading-relaxed font-light">
                Available in 25 Kg and 50 Kg moisture-proof woven polypropylene sacks with inner food-grade liner to withstand multi-stage warehouse handling.
              </p>
              <div className="pt-2">
                <Link to="/distributors" className="text-xs font-bold text-slate-900 hover:text-emerald-800 inline-flex items-center gap-1">
                  Interested in Regional Distributorship? Apply here <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
