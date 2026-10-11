import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, FileText, CheckCircle2, ShieldCheck, Truck, Scale, 
  ArrowRight, PhoneCall, Mail, Award, Clock, Plus, Trash2, HelpCircle 
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../api/client';
import { toast } from 'sonner';

export const QuotationRequestPage = () => {
  const { user } = useAuth();
  const { language, formatPriceBDT } = useLanguage();
  const isBn = language === 'bn';

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submittedQuote, setSubmittedQuote] = useState(null);

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [tradeLicense, setTradeLicense] = useState('');
  const [businessType, setBusinessType] = useState('Supermarket & Retail Chain');
  const [contactPerson, setContactPerson] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [district, setDistrict] = useState('Dhaka');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Bank Wire / EFT (Standard Commercial)');
  const [deliveryTimeline, setDeliveryTimeline] = useState('Within 3-5 Business Days');
  const [notes, setNotes] = useState('');

  // Items State (Multi-item RFQ)
  const [items, setItems] = useState([
    {
      productName: 'Dinajpur Aromatic Chinigura Rice',
      packagingType: '50kg Food-Grade Jute Sack',
      quantity: 40,
      unitWeightKg: 50,
      targetPricePerKg: 135
    }
  ]);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoadingProducts(true);
        const res = await api.get('/products?limit=50');
        if (res.success && res.data) {
          setProducts(res.data);
          if (res.data.length > 0) {
            setItems([
              {
                productName: res.data[0].name,
                packagingType: '50kg Food-Grade Jute Sack',
                quantity: 40,
                unitWeightKg: 50,
                targetPricePerKg: res.data[0].variants?.[0]?.wholesalePrice 
                  ? Math.round(res.data[0].variants[0].wholesalePrice / (res.data[0].variants[0].weightKg || 1))
                  : 75
              }
            ]);
          }
        }
      } catch (err) {
        console.error('Error fetching catalog products:', err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchCatalog();
  }, []);

  const handleAddItem = () => {
    const defaultProd = products[0]?.name || 'Standard Agricultural Lot';
    setItems([
      ...items,
      {
        productName: defaultProd,
        packagingType: '50kg Food-Grade Jute Sack',
        quantity: 20,
        unitWeightKg: 50,
        targetPricePerKg: 70
      }
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) {
      toast.error(isBn ? 'কমপক্ষে একটি পণ্য প্রয়োজন' : 'At least one commodity line is required');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    
    // Auto-adjust unit weight if packaging changed
    if (field === 'packagingType') {
      if (value.includes('50kg')) updated[index].unitWeightKg = 50;
      else if (value.includes('25kg')) updated[index].unitWeightKg = 25;
      else if (value.includes('20kg')) updated[index].unitWeightKg = 20;
      else if (value.includes('10kg')) updated[index].unitWeightKg = 10;
      else if (value.includes('1 MT') || value.includes('Jumbo')) updated[index].unitWeightKg = 1000;
      else if (value.includes('Crate')) updated[index].unitWeightKg = 20;
    }

    setItems(updated);
  };

  // Calculations
  const totalVolumeKg = items.reduce((sum, it) => sum + (Number(it.quantity || 0) * Number(it.unitWeightKg || 1)), 0);
  const totalMetricTons = (totalVolumeKg / 1000).toFixed(2);
  const estimatedSubtotal = items.reduce((sum, it) => {
    const lineKg = Number(it.quantity || 0) * Number(it.unitWeightKg || 1);
    return sum + (lineKg * Number(it.targetPricePerKg || 0));
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName.trim() || !contactPerson.trim() || !phone.trim() || !deliveryAddress.trim()) {
      toast.error(isBn ? 'দয়া করে সমস্ত প্রয়োজনীয় তথ্য পূরণ করুন' : 'Please fill all required institutional contact fields');
      return;
    }

    try {
      setSubmitting(true);
      const formattedItems = items.map(it => {
        const lineKg = Number(it.quantity) * Number(it.unitWeightKg);
        return {
          productName: it.productName,
          variantSku: `B2B-${it.unitWeightKg}KG`,
          bagQuantity: Number(it.quantity),
          bagWeightKg: Number(it.unitWeightKg),
          totalKg: lineKg,
          unitPrice: Number(it.targetPricePerKg) * Number(it.unitWeightKg),
          totalPrice: lineKg * Number(it.targetPricePerKg)
        };
      });

      const freightEstimate = Math.round(totalVolumeKg * 1.5);
      const grandTotal = estimatedSubtotal + freightEstimate;

      const payload = {
        companyName,
        tradeLicenseNumber: tradeLicense,
        businessType,
        contactPerson,
        phone,
        email,
        district,
        deliveryAddress,
        paymentTerms,
        deliveryTimeline,
        notes,
        items: formattedItems,
        subtotal: estimatedSubtotal,
        deliveryCharge: freightEstimate,
        grandTotal
      };

      const res = await api.post('/wholesale/quotation-request', payload);
      if (res.success) {
        setSubmittedQuote(res.data);
        toast.success(isBn ? 'দরপত্র সফলভাবে জমা দেওয়া হয়েছে!' : 'Formal Quotation Proposal submitted successfully!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit quotation request');
    } finally {
      setSubmitting(false);
    }
  };

  const bangladeshDistricts = [
    'Dhaka', 'Chattogram', 'Rajshahi', 'Dinajpur', 'Bogura', 'Rangpur', 'Sylhet', 'Khulna', 
    'Barishal', 'Mymensingh', 'Comilla', 'Narayanganj', 'Gazipur', 'Kushtia', 'Jessore', 'Pabna'
  ];

  if (submittedQuote) {
    return (
      <div className="bg-[#FAF8F5] min-w-0 py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl border border-emerald-200/80 p-8 sm:p-12 shadow-sm text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {isBn ? 'দরপত্র গৃহীত হয়েছে' : 'RFQ Successfully Logged'}
            </span>
            <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-slate-900 mt-4 mb-2">
              {isBn ? 'আনুষ্ঠানিক কোটেশন প্রস্তুত হচ্ছে' : 'Formal Quotation Dossier Prepared'}
            </h1>
            <p className="text-slate-600 text-sm max-w-lg mx-auto mb-6">
              {isBn 
                ? `আপনার কোটেশন রেফারেন্স #${submittedQuote.quotationNumber}। আমাদের বাণিজ্যিক ট্রেড টিম ২ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবে।`
                : `Your institutional reference number is #${submittedQuote.quotationNumber}. Our commercial agri-trade desk will verify dispatch slot availability and reach out within 2 hours.`
              }
            </p>

            <div className="bg-[#F8FAF7] border border-slate-200 rounded-xl p-5 text-left mb-8 space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                <span className="text-slate-500">{isBn ? 'কোম্পানি' : 'Procuring Entity'}:</span>
                <span className="font-bold text-slate-900">{submittedQuote.companyName}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                <span className="text-slate-500">{isBn ? 'গন্তব্য জেলা' : 'Destination District'}:</span>
                <span className="font-bold text-slate-900">{submittedQuote.district}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                <span className="text-slate-500">{isBn ? 'মোট আয়তন' : 'Aggregate Volume'}:</span>
                <span className="font-bold text-emerald-900">{totalMetricTons} MT ({totalVolumeKg.toLocaleString()} KG)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">{isBn ? 'আনুমানিক সাবটোটাল' : 'Estimated Base Value'}:</span>
                <span className="font-bold text-slate-900 font-serif-display text-base">
                  {formatPriceBDT(submittedQuote.subtotal || estimatedSubtotal)}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/wholesale">
                <Button variant="outline" size="md">
                  {isBn ? 'হোলসেল পোর্টালে ফিরুন' : 'Return to Wholesale Portal'}
                </Button>
              </Link>
              <Link to="/shop">
                <Button variant="primary" size="md">
                  {isBn ? 'ক্যাটালগ ঘুরে দেখুন' : 'Explore Full Catalog'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-w-0 py-8 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link to="/" className="hover:text-emerald-800">{isBn ? 'হোম' : 'Home'}</Link>
            <span>/</span>
            <Link to="/wholesale" className="hover:text-emerald-800">{isBn ? 'হোলসেল' : 'Wholesale'}</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">{isBn ? 'দরপত্র আহ্বান' : 'Request Quotation (RFQ)'}</span>
          </div>

          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 block mb-1">
              {isBn ? 'বাণিজ্যিক কৃষি সংগ্রহ' : 'Commercial Agribusiness Procurement'}
            </span>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-slate-900">
              {isBn ? 'প্রাতিষ্ঠানিক পাইকারি কোটেশন ফর্ম' : 'Enterprise Bulk Commodity RFQ Desk'}
            </h1>
            <p className="text-slate-600 text-sm mt-2">
              {isBn 
                ? 'সরাসরি কৃষক ও আধুনিক অটো সিলোর সাথে সংযুক্ত। চাল, ভুট্টা, মৌসুমি আম, লিচু, আলু, ডাল ও মশলার বাল্ক সরবরাহ বুক করুন।'
                : 'Direct-from-grower aggregation with multi-silo logistics. Procure certified rice, yellow maize, seasonal mangoes, litchi, potatoes, lentils, and spices with formal tax invoice & BSTI compliance.'
              }
            </p>
          </div>
        </div>

        {/* Value Proposition Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block">{isBn ? 'সঠিক ওজন ও আর্দ্রতা' : 'Certified Weight & Moisture'}</span>
              <span className="text-[11px] text-slate-500">{isBn ? 'ডিজিটাল ওয়েব্রিজ ট্র্যাকিং' : 'Sortex & Lab Verified'}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block">{isBn ? 'সারা দেশে ট্রাক লোড' : 'Nationwide Fleet'}</span>
              <span className="text-[11px] text-slate-500">{isBn ? 'সরাসরি ফার্ম থেকে গুদাম' : '10T / 20T Covered Vans'}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block">{isBn ? 'চালান ও মূসক-৬.৩' : 'Tax & VAT Mushak 6.3'}</span>
              <span className="text-[11px] text-slate-500">{isBn ? 'সম্পূর্ণ বৈধ কর নথি' : 'NBR Compliant Billing'}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block">{isBn ? '২ ঘণ্টায় দরপত্র' : '2-Hour Turnaround'}</span>
              <span className="text-[11px] text-slate-500">{isBn ? 'ডেডিকেটেড ট্রেড ম্যানেজার' : 'Key Account Support'}</span>
            </div>
          </div>
        </div>

        {/* Main Form Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Details & Commodity Matrix */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Institutional Contact Information */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <Building2 className="w-5 h-5 text-emerald-800" />
                <div>
                  <h2 className="font-serif-display text-lg font-bold text-slate-900">
                    {isBn ? '১. প্রতিষ্ঠানের বিবরণ ও ক্রেতার পরিচিতি' : '1. Institutional Buyer Credentials'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {isBn ? 'আপনার বাণিজ্যিক প্রতিষ্ঠান বা হোলসেল ক্রয়ের তথ্য দিন' : 'Official registration details for commercial billing'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={isBn ? 'কোম্পানি / প্রতিষ্ঠানের নাম *' : 'Company / Enterprise Name *'}
                  placeholder="e.g. Apex Agro Foods Ltd. or Dhaka Supermarket"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />

                <Input
                  label={isBn ? 'ট্রেড লাইসেন্স / টিআইএন / বিআইএন' : 'Trade License / TIN / BIN No.'}
                  placeholder="e.g. TRAD/DNCC/102934/2025"
                  value={tradeLicense}
                  onChange={(e) => setTradeLicense(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label={isBn ? 'ব্যবসার ধরন' : 'Business Category'}
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  options={[
                    { value: 'Supermarket & Retail Chain', label: 'Supermarket & Retail Chain (স্বপ্ন / ইউনিমার্ট ধাঁচ)' },
                    { value: 'Hotel / Restaurant / Catering (HORECA)', label: 'Hotel / Restaurant / Catering (HORECA)' },
                    { value: 'Feed & Industrial Mill Processor', label: 'Feed & Industrial Mill (পোল্ট্রি / ফিড মিল)' },
                    { value: 'Agricultural Exporter', label: 'Fresh Produce Exporter (কৃষি পণ্য রপ্তানিকারক)' },
                    { value: 'Regional Wholesaler & Aratdar', label: 'Regional Wholesaler / আড়তদার' },
                    { value: 'Government / NGO Institutional', label: 'Institutional / NGO Relief Feeding' }
                  ]}
                />

                <Input
                  label={isBn ? 'দায়িত্বপ্রাপ্ত কর্মকর্তা / যোগাযোগের নাম *' : 'Contact Person & Designation *'}
                  placeholder="e.g. Md. Rafiqul Islam, Procurement Head"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={isBn ? 'সরাসরি মোবাইল নম্বর *' : 'Direct Mobile Phone *'}
                  placeholder="017XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />

                <Input
                  label={isBn ? 'প্রাতিষ্ঠানিক ইমেইল' : 'Corporate Email Address'}
                  placeholder="procurement@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label={isBn ? 'ডেলিভারি গন্তব্য জেলা *' : 'Delivery Destination District *'}
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  options={bangladeshDistricts.map(d => ({ value: d, label: d }))}
                />

                <Input
                  label={isBn ? 'নির্দিষ্ট আনলোডিং গোডাউন বা ওয়্যারহাউজ ঠিকানা *' : 'Unloading Warehouse / Depot Address *'}
                  placeholder="e.g. Shed 4, Tejgaon Industrial Area, Dhaka"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* 2. Commodity Requirements Line Items */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Scale className="w-5 h-5 text-emerald-800" />
                  <div>
                    <h2 className="font-serif-display text-lg font-bold text-slate-900">
                      {isBn ? '২. ফসলের ধরন ও পরিমাণের তালিকা' : '2. Agricultural Commodities & Packaging'}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {isBn ? 'আপনার প্রয়োজনীয় পণ্য, প্যাকেজিং বস্তা ও পরিমাণ যুক্ত করুন' : 'Add multiple products with desired bag sizes and volume'}
                    </p>
                  </div>
                </div>

                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddItem}
                  className="text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  {isBn ? 'পণ্য যোগ করুন' : 'Add Commodity'}
                </Button>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div key={idx} className="bg-[#FAF8F5] p-4 sm:p-5 rounded-xl border border-slate-200/80 space-y-4 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        {isBn ? `পণ্য #${idx + 1}` : `Commodity Line #${idx + 1}`}
                      </span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1 transition-colors"
                          title="Remove line"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          {isBn ? 'পণ্য নির্বাচন' : 'Commodity'}
                        </label>
                        <select
                          className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 outline-none focus:border-emerald-600"
                          value={item.productName}
                          onChange={(e) => handleItemChange(idx, 'productName', e.target.value)}
                        >
                          {products.map(p => (
                            <option key={p._id} value={p.name}>{p.name} ({p.banglaName || ''})</option>
                          ))}
                          <option value="Miniket Premium Rice (Balam)">Miniket Premium Rice (Balam)</option>
                          <option value="Nazirshail Polished White">Nazirshail Polished White</option>
                          <option value="Yellow Feed Maize (Maize/Corn)">Yellow Feed Maize (Maize/Corn)</option>
                          <option value="Rajshahi Himsagar Mango (Export Grade)">Rajshahi Himsagar Mango (Export Grade)</option>
                          <option value="Dinajpur Bedana Litchi">Dinajpur Bedana Litchi</option>
                          <option value="Bogura Diamond Potatoes (Seed/Table)">Bogura Diamond Potatoes</option>
                          <option value="Kushtia Red Masoor Dal (Lentils)">Kushtia Red Masoor Dal</option>
                          <option value="Pabna Organic Whole Turmeric">Pabna Organic Whole Turmeric</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          {isBn ? 'প্যাকিং সাইজ' : 'Packaging Type'}
                        </label>
                        <select
                          className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 outline-none focus:border-emerald-600"
                          value={item.packagingType}
                          onChange={(e) => handleItemChange(idx, 'packagingType', e.target.value)}
                        >
                          <option value="50kg Food-Grade Jute Sack">50kg Food-Grade Jute Sack</option>
                          <option value="25kg Woven Poly Sack">25kg Woven Poly Sack</option>
                          <option value="20kg Plastic Ventilated Crate">20kg Fresh Crate (Fruits)</option>
                          <option value="10kg Master Carton">10kg Master Carton</option>
                          <option value="1 MT Jumbo Bulk Bag">1 MT Jumbo Bulk Bag</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          {isBn ? 'বস্তা/ক্রাফট সংখ্যা' : 'Bag / Crate Count'}
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          {isBn ? 'লক্ষ্য দর (৳/কেজি)' : 'Target Rate (৳/KG)'}
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.targetPricePerKg}
                          onChange={(e) => handleItemChange(idx, 'targetPricePerKg', e.target.value)}
                          className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-200/60 font-mono">
                      <span>
                        {isBn ? 'লাইন মোট ওজন:' : 'Line Weight:'} <strong className="text-slate-800">{(item.quantity * item.unitWeightKg).toLocaleString()} KG</strong> ({((item.quantity * item.unitWeightKg) / 1000).toFixed(2)} MT)
                      </span>
                      <span>
                        {isBn ? 'আনুমানিক মূল্য:' : 'Line Value:'} <strong className="text-emerald-800 font-serif-display text-sm">{formatPriceBDT((item.quantity * item.unitWeightKg) * item.targetPricePerKg)}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Logistics, Credit & Commercial Terms */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <Truck className="w-5 h-5 text-emerald-800" />
                <div>
                  <h2 className="font-serif-display text-lg font-bold text-slate-900">
                    {isBn ? '৩. লজিস্টিকস ও বাণিজ্যিক শর্তাবলি' : '3. Commercial Terms & Dispatch Schedule'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {isBn ? 'ডেলিভারি সময়সীমা ও গ্রহণযোগ্য পেমেন্ট টার্মস নির্ধারণ করুন' : 'Preferred freight arrangement and settlement schedule'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label={isBn ? 'পেমেন্ট টার্মস / পরিশোধের পদ্ধতি' : 'Settlement & Payment Terms'}
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  options={[
                    { value: 'Bank Wire / EFT (Standard Commercial)', label: 'Bank Wire / EFT (Standard Commercial)' },
                    { value: 'Letter of Credit (LC) Irrevocable', label: 'Letter of Credit (LC) Irrevocable' },
                    { value: '15-Day Net Corporate Credit', label: '15-Day Net Corporate Credit (Verified Accounts)' },
                    { value: 'Cash against Delivery (CAD) at Depot', label: 'Cash Against Delivery (CAD) at Depot' },
                    { value: 'bKash / Nagad Corporate Merchant', label: 'bKash / Nagad Corporate Gateway' }
                  ]}
                />

                <Select
                  label={isBn ? 'বিতরণের প্রয়োজনীয় সময়সীমা' : 'Required Dispatch Timeline'}
                  value={deliveryTimeline}
                  onChange={(e) => setDeliveryTimeline(e.target.value)}
                  options={[
                    { value: 'Immediate Emergency (24-48 Hours)', label: 'Immediate Emergency (24-48 Hours)' },
                    { value: 'Within 3-5 Business Days', label: 'Within 3-5 Business Days (Standard Truckload)' },
                    { value: 'Weekly Staggered Schedule (1 Month)', label: 'Weekly Staggered Schedule (1 Month Supply)' },
                    { value: 'Seasonal Forward Booking (Harvest Reserve)', label: 'Seasonal Forward Booking (Harvest Reserve)' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBn ? 'বিশেষ নির্দেশাবলি বা ল্যাব স্পেসিফিকেশন' : 'Special Notes, Bag Branding or Moisture Specifications'}
                </label>
                <textarea
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Moisture must be <= 12.5%, sortex broken grains < 1%, private buyer label stencil requested..."
                  className="w-full text-xs p-3 bg-white border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Summary & Submission Card */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm sticky top-24 space-y-6">
              <h3 className="font-serif-display text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                {isBn ? 'কোটেশন সারসংক্ষেপ' : 'Procurement Valuation Summary'}
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{isBn ? 'মোট পণ্য সংখ্যা' : 'Selected Line Items'}</span>
                  <span className="font-bold text-slate-900">{items.length} {isBn ? 'টি' : 'Lines'}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>{isBn ? 'মোট আয়তন (কেজি)' : 'Total Gross Volume'}</span>
                  <span className="font-bold text-slate-900">{totalVolumeKg.toLocaleString()} KG</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>{isBn ? 'মেট্রিক টন' : 'Equivalent Metric Tons'}</span>
                  <span className="font-bold text-emerald-800 font-mono text-sm">{totalMetricTons} MT</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>{isBn ? 'আনুমানিক পণ্যমূল্য' : 'Est. Base Commodity Subtotal'}</span>
                  <span className="font-bold text-slate-900 font-serif-display">
                    {formatPriceBDT(estimatedSubtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>{isBn ? 'আনুমানিক ট্রাক ফ্রেইট' : 'Est. Logistics & Freight'}</span>
                  <span className="font-semibold text-slate-700">
                    {formatPriceBDT(Math.round(totalVolumeKg * 1.5))}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-sm">{isBn ? 'মোট সম্ভাব্য চুক্তি' : 'Estimated Value'}</span>
                  <span className="font-serif-display font-bold text-xl text-emerald-900">
                    {formatPriceBDT(estimatedSubtotal + Math.round(totalVolumeKg * 1.5))}
                  </span>
                </div>
              </div>

              <div className="bg-[#F8FAF7] rounded-xl p-4 border border-emerald-100 space-y-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>{isBn ? 'ধানসিঁড়ি বাণিজ্য নিশ্চয়তা' : 'Dhansiri Agribusiness Guarantee'}</span>
                </div>
                <p>
                  {isBn
                    ? 'প্রতিটি লট ডিজিটাল ওজন ও চালের ল্যাব টেস্ট সনদ সহ প্রেরিত হয়। ভেজালমুক্ত শতভাগ খাঁটি পণ্য।'
                    : 'All dispatches include Sortex batch test certificate, moisture verification, and official VAT invoice.'
                  }
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full text-sm font-semibold shadow-sm"
                disabled={submitting}
              >
                {submitting ? (
                  isBn ? 'জমা দেওয়া হচ্ছে...' : 'Submitting Formal RFQ...'
                ) : (
                  <>
                    {isBn ? 'দরপত্র প্রস্তাব পাঠান' : 'Submit Formal RFQ Proposal'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <div className="text-center pt-2">
                <span className="text-[11px] text-slate-500 block mb-1">
                  {isBn ? 'জরুরি আলোচনায় সরাসরি ট্রেড ডেস্কে কল করুন:' : 'Urgent trade desk procurement helpline:'}
                </span>
                <a href="tel:+8801700000000" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline">
                  <PhoneCall className="w-3.5 h-3.5" />
                  +880 1700-000000 (Commercial Ag-Desk)
                </a>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
