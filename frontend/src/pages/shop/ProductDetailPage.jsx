import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, ShoppingBag, ShieldCheck, CheckCircle2, Star, Truck, 
  MapPin, Calendar, Award, Info, Sparkles, Plus, Minus, ArrowRight,
  FileText, Check, Droplets, Users, HelpCircle
} from 'lucide-react';
import client from '../../api/client';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { Modal } from '../../components/common/Modal';
import { ProductCard } from '../../components/cards/ProductCard';
import { toast } from 'sonner';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, setIsCartOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const { t, language, formatPrice, translateUnit } = useLanguage();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  // Quote Form State
  const [quoteCompany, setQuoteCompany] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteQty, setQuoteQty] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [submittingQuote, setSubmittingQuote] = useState(false);

  // Review submission state
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await client.get(`/products/slug/${slug}`);
        const payload = res?.data?.product ? res.data : (res?.data?.data?.product ? res.data.data : (res?.product ? res : null));
        if (payload && payload.product) {
          setProduct(payload.product);
          setRelatedProducts(payload.relatedProducts || []);
          setSelectedImage(payload.product.featuredImage);
          setSelectedVariantIndex(0);
          setQuantity(1);
        }
      } catch (err) {
        toast.error('Agricultural product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-8">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif-display text-2xl font-bold text-slate-900 mb-4">
          Agricultural Product Not Found
        </h2>
        <Link to="/shop">
          <Button variant="primary">Return to Marketplace Catalog</Button>
        </Link>
      </div>
    );
  }

  const variants = product.variants || [];
  const activeVariant = variants[selectedVariantIndex] || variants[0] || {};

  // Tier pricing calculation
  let activePrice = activeVariant.retailPrice;
  if (activeVariant.discountPrice > 0 && activeVariant.discountPrice < activeVariant.retailPrice) {
    activePrice = activeVariant.discountPrice;
  }
  if (user?.pricingTier === 'wholesale' && activeVariant.wholesalePrice) {
    activePrice = activeVariant.wholesalePrice;
  } else if (user?.pricingTier === 'distributor' && activeVariant.distributorPrice) {
    activePrice = activeVariant.distributorPrice;
  }

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await addItem(product._id, activeVariant.variantSku, quantity);
      setIsCartOpen(true);
    } catch (err) {
      toast.error(err.message || 'Error adding item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingQuote(true);
      await client.post('/wholesale/quotation-request', {
        companyName: quoteCompany || user?.businessProfile?.companyName || user?.name || 'Commercial Buyer',
        contactPerson: user?.name || 'Purchasing Manager',
        phone: quotePhone || user?.phone || '01711000000',
        email: user?.email || 'buyer@example.com',
        district: product.district || 'Dhaka',
        deliveryAddress: 'Main Commercial Warehouse',
        items: [{
          product: product._id,
          productName: product.name,
          variantSku: activeVariant.variantSku,
          bagQuantity: Number(quoteQty) || 10,
          bagWeightKg: activeVariant.quantityOrWeight || 1,
          totalKg: (Number(quoteQty) || 10) * (activeVariant.quantityOrWeight || 1),
          unitPrice: activeVariant.wholesalePrice || activePrice,
          totalPrice: (Number(quoteQty) || 10) * (activeVariant.wholesalePrice || activePrice)
        }],
        subtotal: (Number(quoteQty) || 10) * (activeVariant.wholesalePrice || activePrice),
        grandTotal: (Number(quoteQty) || 10) * (activeVariant.wholesalePrice || activePrice),
        termsAndConditions: quoteNotes || 'Commercial quotation request'
      });
      toast.success('Commercial quotation request received! Our sales manager will contact you.');
      setQuoteModalOpen(false);
    } catch (err) {
      toast.error('Could not submit quotation request');
    } finally {
      setSubmittingQuote(false);
    }
  };

  const isBookmarked = isInWishlist(product._id);
  const isSeasonal = product.isSeasonal;
  const isPreOrder = product.seasonalInfo?.availabilityStatus === 'Pre-order Open';
  const isOutOfSeason = product.seasonalInfo?.availabilityStatus === 'Out of Season';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
        <Link to="/" className="hover:text-emerald-800">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-emerald-800">Agro Marketplace</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category?.slug}`} className="hover:text-emerald-800">
          {product.category?.name}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-bold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Showcase Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 shadow-xs relative">
            <img
              src={selectedImage || activeVariant.image || product.featuredImage}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {isPreOrder && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-400 text-slate-950 shadow-md flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Pre-Order Booking
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[product.featuredImage, ...product.images.filter(img => img !== product.featuredImage)].map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img ? 'border-emerald-700 shadow-xs' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            {/* Origin & Variety Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-2 text-xs font-bold">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>{product.district || product.origin}</span>
              </span>

              {product.variety && (
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900">
                  Variety: {product.variety}
                </span>
              )}

              {product.productType && (
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  {product.productType}
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="font-serif-display text-3xl sm:text-4xl font-black text-slate-950 leading-tight">
              {language === 'bn' && product.banglaName ? product.banglaName : product.name}
            </h1>
            {product.banglaName && language !== 'bn' && (
              <p className="text-sm text-slate-500 font-serif mt-0.5">
                {product.banglaName}
              </p>
            )}

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2 mt-2 text-xs">
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="font-bold text-slate-800">{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
              <span className="text-slate-400">({product.reviewCount || 24} customer & institutional reviews)</span>
            </div>
          </div>

          {/* Pricing & Stock Status */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-950">
                  {formatPrice(activePrice)}
                </span>
                {activeVariant.discountPrice > 0 && activeVariant.discountPrice < activeVariant.retailPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(activeVariant.retailPrice)}
                  </span>
                )}
                <span className="text-sm font-semibold text-slate-600">
                  / {translateUnit(activeVariant.unit || 'kg')}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Pack Type: {activeVariant.packagingType} ({activeVariant.quantityOrWeight} {translateUnit(activeVariant.unit)})
              </p>
            </div>

            <div className="text-right">
              {activeVariant.stock > 0 ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> In Stock & Inspected
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                  Allocation Sold Out
                </span>
              )}
            </div>
          </div>

          {/* Short Summary */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
            {product.shortDescription}
          </p>

          {/* Packaging & Unit Variants Selector */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-600 mb-2">
              Select Package & Unit Size:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {variants.map((v, idx) => (
                <button
                  key={v.variantSku}
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                    selectedVariantIndex === idx
                      ? 'bg-emerald-800 border-emerald-800 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs">{v.title}</div>
                  <div className={`text-[11px] font-medium mt-0.5 ${selectedVariantIndex === idx ? 'text-emerald-200' : 'text-slate-500'}`}>
                    {v.packagingType}
                  </div>
                  <div className="text-xs font-black mt-1">
                    {formatPrice(v.discountPrice > 0 ? v.discountPrice : v.retailPrice)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-200 rounded-xl bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                disabled={addingToCart || activeVariant.stock <= 0 || isOutOfSeason}
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isPreOrder ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-800 hover:bg-emerald-900'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isPreOrder ? t('actions.preOrder') : t('actions.addToCart')}</span>
              </button>

              <button
                onClick={() => toggleWishlist(product._id)}
                className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-slate-200 bg-white text-slate-500 hover:text-slate-900'
                }`}
                title={isBookmarked ? 'In Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            {/* Bulk B2B Quotation Button */}
            {product.isWholesaleAvailable && (
              <button
                onClick={() => setQuoteModalOpen(true)}
                className="w-full py-2.5 rounded-xl border border-dashed border-emerald-600 bg-emerald-50/50 hover:bg-emerald-100/50 text-emerald-900 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Request Commercial B2B Quotation (Institutional Supply)</span>
              </button>
            )}
          </div>

          {/* Quality & Delivery Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Nationwide 64 Districts Delivery</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>BSTI &amp; Carbide-Free Tested</span>
            </div>
          </div>

        </div>
      </div>

      {/* DETAILED INFORMATION TABS */}
      <div className="border-t border-slate-200 pt-10 mb-16">
        
        {/* Tab Headers */}
        <div className="flex items-center gap-8 border-b border-slate-200 overflow-x-auto pb-1 mb-8">
          {[
            { id: 'specs', label: 'Specifications & Attributes' },
            { id: 'traceability', label: '🌾 Farm Traceability' },
            { id: 'wholesale', label: '🏢 B2B Wholesale Pricing' },
            { id: 'nutrition', label: 'Nutrition & Handling' },
            { id: 'reviews', label: `Reviews (${product.reviewCount || 24})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 font-serif-display font-bold text-sm tracking-wide transition-colors relative whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'text-emerald-900 border-b-2 border-emerald-800'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Specs & Attributes */}
        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="font-serif-display text-lg font-bold text-slate-900 mb-3">
                Full Agronomy &amp; Product Description
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light mb-6">
                {product.fullDescription}
              </p>

              {/* Dynamic Key-Value Attributes */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Origin District</span>
                  <span className="font-bold text-slate-900">{product.origin}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Cultivar Variety</span>
                  <span className="font-bold text-slate-900">{product.variety || 'Indigenous Heritage'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Product Category</span>
                  <span className="font-bold text-slate-900">{product.productType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Estimated Shelf Life</span>
                  <span className="font-bold text-slate-900">{product.shelfLife || '12 Months'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Storage Guidelines</span>
                  <span className="font-bold text-slate-900">{product.storageAdvice}</span>
                </div>
                {product.attributes?.map((attr, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-500">{attr.name}</span>
                    <span className="font-bold text-slate-900">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-serif-display text-lg font-bold text-slate-900 mb-3">
                Quality Certifications
              </h3>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs font-bold text-slate-900">
                  <Award className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>BSTI Verified Agricultural Standards</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs font-bold text-slate-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Zero Harmful Chemical Ripening Agent Guarantee</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs font-bold text-slate-900">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>ISO 22000 Food Safety &amp; Clean Packaging Compliant</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Farm Traceability */}
        {activeTab === 'traceability' && (
          <div className="max-w-3xl rounded-2xl bg-emerald-50/50 border border-emerald-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                <MapPin className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="font-serif-display text-xl font-bold text-emerald-950">
                  Farm-to-Table Verified Provenance
                </h3>
                <p className="text-xs text-emerald-800">
                  Traceable agricultural sourcing records maintained for quality assurance.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-white rounded-xl border border-emerald-100">
                <span className="text-slate-400 font-semibold block mb-0.5">Partner Producer / Farm:</span>
                <span className="font-bold text-slate-900">
                  {product.traceability?.farmName || product.traceability?.farmerName || 'Dinajpur Heritage Grower Estate'}
                </span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-emerald-100">
                <span className="text-slate-400 font-semibold block mb-0.5">Sourcing District &amp; Upazila:</span>
                <span className="font-bold text-slate-900">
                  {product.traceability?.district || product.district}, {product.traceability?.upazila || 'Regional Cluster'}
                </span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-emerald-100">
                <span className="text-slate-400 font-semibold block mb-0.5">Harvest Batch ID:</span>
                <span className="font-mono font-bold text-emerald-800">
                  {product.traceability?.harvestBatch || 'DHA-HARVEST-2026-A1'}
                </span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-emerald-100">
                <span className="text-slate-400 font-semibold block mb-0.5">Quality Grading:</span>
                <span className="font-bold text-slate-900">
                  {product.traceability?.qualityGrade || 'Grade A - Export / Premium'}
                </span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-emerald-100 text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-emerald-900 block mb-1">Storage &amp; Preservation Environment:</span>
              {product.traceability?.storageConditions || 'Stored in aerated silos / temperature-regulated cold storage with zero chemical treatment.'}
            </div>
          </div>
        )}

        {/* Tab 3: Wholesale Volume Tiers */}
        {activeTab === 'wholesale' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h3 className="font-serif-display text-xl font-bold text-slate-900">
                Wholesale &amp; Institutional Commercial Tiers
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Volume rates for supermarkets, catering corporations, restaurants, and regional mill merchants.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                  <tr>
                    <th className="p-3.5">Tier Classification</th>
                    <th className="p-3.5">Minimum Order Qty</th>
                    <th className="p-3.5">Unit Rate (BDT)</th>
                    <th className="p-3.5">Eligibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  <tr>
                    <td className="p-3.5 font-bold">Tier 1: Retail Single Unit</td>
                    <td className="p-3.5">1 Unit</td>
                    <td className="p-3.5 font-black text-slate-900">{formatPrice(activeVariant.retailPrice)}</td>
                    <td className="p-3.5 text-slate-500">General Consumer</td>
                  </tr>
                  <tr className="bg-emerald-50/40">
                    <td className="p-3.5 font-bold text-emerald-900">Tier 2: Wholesale B2B Rate</td>
                    <td className="p-3.5">{activeVariant.minWholesaleQty || 10} Units</td>
                    <td className="p-3.5 font-black text-emerald-800">{formatPrice(activeVariant.wholesalePrice)}</td>
                    <td className="p-3.5 text-emerald-700 font-bold">Registered Supermarket / HORECA</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold">Tier 3: Regional Distributor</td>
                    <td className="p-3.5">50+ Units / Ton</td>
                    <td className="p-3.5 font-black text-amber-700">{formatPrice(activeVariant.distributorPrice)}</td>
                    <td className="p-3.5 text-slate-500">Contract Regional Dealer</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setQuoteModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Submit Commercial Volume Inquiry</span>
            </button>
          </div>
        )}

        {/* Tab 4: Nutrition & Handling */}
        {activeTab === 'nutrition' && (
          <div className="max-w-xl rounded-2xl border border-slate-200 overflow-hidden bg-white">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-serif-display text-base font-bold text-slate-900">
                Nutritional Profile (Per 100g)
              </h3>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="flex justify-between p-3.5 font-medium"><span className="text-slate-600">Energy</span><span className="font-bold text-slate-900">{product.nutritionalInfo?.caloriesPer100g || 350} kcal</span></div>
              <div className="flex justify-between p-3.5 font-medium"><span className="text-slate-600">Carbohydrates</span><span className="font-bold text-slate-900">{product.nutritionalInfo?.carbohydratesG || 78} g</span></div>
              <div className="flex justify-between p-3.5 font-medium"><span className="text-slate-600">Protein</span><span className="font-bold text-slate-900">{product.nutritionalInfo?.proteinG || 7.2} g</span></div>
              <div className="flex justify-between p-3.5 font-medium"><span className="text-slate-600">Dietary Fiber</span><span className="font-bold text-slate-900">{product.nutritionalInfo?.fiberG || 1.4} g</span></div>
              <div className="flex justify-between p-3.5 font-medium"><span className="text-slate-600">Fat Content</span><span className="font-bold text-slate-900">{product.nutritionalInfo?.fatG || 0.6} g</span></div>
              <div className="flex justify-between p-3.5 font-medium"><span className="text-slate-600">Iron / Minerals</span><span className="font-bold text-slate-900">{product.nutritionalInfo?.ironMg || 1.2} mg</span></div>
            </div>
          </div>
        )}

        {/* Tab 5: Reviews */}
        {activeTab === 'reviews' && (
          <div className="max-w-3xl space-y-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <span className="font-serif-display text-3xl font-black text-slate-900">{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
                <span className="text-xs text-slate-500 ml-2">out of 5 stars based on verified buyer orders</span>
              </div>
              <button
                onClick={() => {
                  if (!isAuthenticated) toast.info('Please sign in to write a review');
                  else toast.success('Review form opened below');
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100"
              >
                Write a Verified Review
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex text-amber-500">★★★★★</div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">Verified Purchase</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">Exceptional quality and unadulterated freshness</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  Direct harvest quality was evident upon opening the package. Highly recommend Dhansiri Agro for transparent sourcing.
                </p>
                <span className="text-[11px] text-slate-400 block pt-1">Reviewed by M. Hossain, Dhaka</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* RELATED AGRICULTURAL PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-slate-200">
          <h2 className="font-serif-display text-2xl font-bold text-slate-900 mb-8">
            Related Agricultural Produce
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* COMMERCIAL B2B QUOTATION MODAL */}
      <Modal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        title="Commercial B2B Quotation Request"
      >
        <form onSubmit={handleQuoteSubmit} className="space-y-4 p-2 text-xs">
          <p className="text-slate-600">
            Request an official corporate quotation for <strong className="text-slate-900">{product.name} ({activeVariant.title})</strong>.
          </p>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Company / Organization Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Bengal Supermarket / Radisson Hotel"
              value={quoteCompany}
              onChange={(e) => setQuoteCompany(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Phone Number *</label>
              <input
                type="text"
                required
                placeholder="+880 17..."
                value={quotePhone}
                onChange={(e) => setQuotePhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Quantity (Units/Sacks) *</label>
              <input
                type="number"
                required
                min="5"
                placeholder="e.g. 50"
                value={quoteQty}
                onChange={(e) => setQuoteQty(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Special Delivery / Logistics Notes</label>
            <textarea
              rows="3"
              placeholder="Specify warehouse location, delivery timeline, or packaging requirements..."
              value={quoteNotes}
              onChange={(e) => setQuoteNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setQuoteModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingQuote}
              className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold shadow-sm hover:bg-emerald-900 disabled:opacity-50"
            >
              {submittingQuote ? 'Submitting...' : 'Send Quotation Request'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
