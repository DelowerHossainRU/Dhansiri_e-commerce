import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Award, Factory, Truck, 
  ChevronRight, Star, Calendar, MapPin, Sprout, Heart, ShoppingBag, Leaf, 
  Flame, Wheat, Apple, Carrot, Package, ArrowUpRight, Check, Droplets, Users,
  Scale, PhoneCall, FileText, Clock, RefreshCw
} from 'lucide-react';
import client from '../../api/client';
import { ProductCard } from '../../components/cards/ProductCard';
import { Skeleton } from '../../components/common/Skeleton';
import { useLanguage } from '../../context/LanguageContext';

export const HomePage = () => {
  const { t, language, formatPrice, translateUnit } = useLanguage();
  const isBn = language === 'bn';

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [seasonalProducts, setSeasonalProducts] = useState([]);
  const [freshHarvest, setFreshHarvest] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [activeCategoryTab, setActiveCategoryTab] = useState('all');
  const [loading, setLoading] = useState(true);

  // Helper to extract array safely
  const extractData = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray(res.data.data)) return res.data.data;
    return [];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featRes, seasonRes, freshRes, bestRes, catRes, farmRes] = await Promise.all([
          client.get('/products?isFeatured=true&limit=12').catch(() => null),
          client.get('/products/seasonal?limit=8').catch(() => null),
          client.get('/products/fresh-harvest?limit=8').catch(() => null),
          client.get('/products/best-sellers?limit=8').catch(() => null),
          client.get('/catalog/categories').catch(() => null),
          client.get('/farmers?limit=4').catch(() => null)
        ]);

        setFeaturedProducts(extractData(featRes));
        setSeasonalProducts(extractData(seasonRes));
        setFreshHarvest(extractData(freshRes));
        setBestSellers(extractData(bestRes));
        setCategories(extractData(catRes));
        setFarmers(extractData(farmRes));
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtered tab products
  const tabFilteredProducts = activeCategoryTab === 'all'
    ? featuredProducts
    : featuredProducts.filter(p => p.category?.slug === activeCategoryTab || p.category?._id === activeCategoryTab);

  // Featured Hero Item (first available product)
  const heroFeaturedItem = featuredProducts[0] || null;

  return (
    <div className="w-full max-w-full overflow-x-clip bg-[#FAF8F5]">
      
      {/* 1. CLEAN EDITORIAL HERO SECTION (Naturix / Foodano Style) */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80 pt-8 pb-12 sm:pt-12 sm:pb-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Sourcing Provenance Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-50 text-emerald-900 border border-emerald-200/80 shadow-2xs">
                <Sprout className="w-4 h-4 text-emerald-700" />
                <span>{isBn ? '১০০% পরীক্ষিত কৃষক ও খামার সোর্সিং' : '100% Traceable Direct Farm Sourcing'}</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                {isBn ? (
                  <>
                    বিশুদ্ধ কৃষিপণ্য সরাসরি <br />
                    <span className="text-emerald-800">বাংলার মাটি থেকে</span> আপনার ঘরে
                  </>
                ) : (
                  <>
                    Pure Agricultural Harvest <br />
                    <span className="text-emerald-800">Direct From Bangladesh Soils</span>
                  </>
                )}
              </h1>

              {/* Clean Subtitle */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                {isBn 
                  ? 'দিনাজপুরের সুগন্ধি চিনিগুঁড়া চাল, রাজশাহীর ক্ষীরশাপাত আম, বগুড়ার হাইব্রিড ভুট্টা ও দেশি ছোট দানার মসুর ডাল। সর্টেক্স অপটিক্যাল গ্রেডিং ও শূন্য রাসায়নিকের নিশ্চয়তা।'
                  : 'Artisan long-grain Chinigura rice, sweet Rajshahi mangoes, golden yellow maize, and organic unpolished lentils. Certified Sortex cleaned with direct grower traceability.'
                }
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/shop"
                  className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isBn ? 'কৃষিপণ্য ক্যাটালগ দেখুন' : 'Explore Farm Produce'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/quotations/request"
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs sm:text-sm font-bold rounded-xl shadow-2xs transition-all flex items-center gap-2"
                >
                  <Scale className="w-4 h-4 text-emerald-800" />
                  <span>{isBn ? 'পাইকারি কোটেশন (B2B)' : 'Wholesale Bulk RFQ'}</span>
                </Link>

                <Link
                  to="/seasonal"
                  className="px-4 py-3.5 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 hover:underline flex items-center gap-1"
                >
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>{isBn ? 'মৌসুমি প্রি-অর্ডার' : 'Seasonal Calendar'}</span>
                </Link>
              </div>

              {/* Trust Strip Mini */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block text-sm sm:text-base">১৫০+</span>
                  <span className="text-slate-500 text-[11px]">{isBn ? 'চুক্তিবদ্ধ কৃষক' : 'Partner Farmers'}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block text-sm sm:text-base">&lt; ১২.৫%</span>
                  <span className="text-slate-500 text-[11px]">{isBn ? 'নিয়ন্ত্রিত আর্দ্রতা' : 'Target Grain Moisture'}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block text-sm sm:text-base">২৪-৪৮ ঘণ্টা</span>
                  <span className="text-slate-500 text-[11px]">{isBn ? 'সারা দেশে ডেলিভারি' : 'Nationwide Dispatch'}</span>
                </div>
              </div>
            </div>

            {/* Hero Right: Featured Farm Produce Showcase */}
            <div className="lg:col-span-5">
              <div className="relative bg-gradient-to-b from-white to-[#FAF8F5] rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
                {/* Visual Label */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                    {isBn ? 'আজকের সেরা তাজা ফসল' : 'Today’s Harvest Spotlight'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    {heroFeaturedItem?.district || 'Rajshahi & Dinajpur'}
                  </span>
                </div>

                {/* Hero Showcase Image */}
                <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
                  <img
                    src={heroFeaturedItem?.featuredImage || "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80"}
                    alt={heroFeaturedItem?.name || "Agricultural Harvest"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-900 shadow-xs flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isBn ? 'জিরো কার্বাইড সার্টিফায়েড' : 'Zero Carbide Certified'}</span>
                  </div>
                </div>

                {/* Hero Product Info */}
                <div className="space-y-2">
                  <Link to={`/products/${heroFeaturedItem?.slug || 'shop'}`} className="hover:text-emerald-800 transition-colors">
                    <h3 className="font-serif-display text-lg sm:text-xl font-bold text-slate-900 line-clamp-1">
                      {isBn && heroFeaturedItem?.banglaName ? heroFeaturedItem.banglaName : (heroFeaturedItem?.name || 'Dinajpur Aromatic Chinigura Rice')}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {heroFeaturedItem?.shortDescription || 'Milled from natural indigenous grains grown along northern river basins. High natural aroma and unpolished nutritional vitality.'}
                  </p>
                </div>

                {/* Price and Action Row */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">{isBn ? 'খুচরা মূল্য' : 'Retail Price'}</span>
                    <span className="font-serif-display text-xl font-bold text-emerald-900">
                      {heroFeaturedItem ? formatPrice(heroFeaturedItem.variants?.[0]?.retailPrice || heroFeaturedItem.retailPrice || 140) : '৳ ১৪০'}
                      <span className="text-xs font-sans text-slate-500 font-normal"> / {heroFeaturedItem?.unit || 'kg'}</span>
                    </span>
                  </div>

                  <Link
                    to={heroFeaturedItem ? `/products/${heroFeaturedItem.slug}` : '/shop'}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5"
                  >
                    <span>{isBn ? 'বিস্তারিত দেখুন' : 'Order Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VALUE PILLARS & ASSURANCE STRIP */}
      <section className="bg-white border-b border-slate-200/80 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#FAF8F5] border border-slate-200/60">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-emerald-800 flex items-center justify-center shrink-0">
                <Sprout className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs sm:text-sm text-slate-900 block truncate">
                  {isBn ? 'সরাসরি কৃষক থেকে' : 'Direct Farmer Sourcing'}
                </span>
                <span className="text-[11px] text-slate-500 truncate block">
                  {isBn ? 'মধ্যস্বত্বভোগীমুক্ত ন্যায্যমূল্য' : 'No middleman markups'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#FAF8F5] border border-slate-200/60">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-emerald-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs sm:text-sm text-slate-900 block truncate">
                  {isBn ? 'সর্টেক্স ও ল্যাব পরীক্ষিত' : 'Sortex & Lab Verified'}
                </span>
                <span className="text-[11px] text-slate-500 truncate block">
                  {isBn ? 'আর্দ্রতা ও কার্বাইড মুক্ত' : '<= 12.5% moisture safe'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#FAF8F5] border border-slate-200/60">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-emerald-800 flex items-center justify-center shrink-0">
                <Factory className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs sm:text-sm text-slate-900 block truncate">
                  {isBn ? 'আবহাওয়া নিয়ন্ত্রিত সাইলো' : 'Climate-Monitored Silos'}
                </span>
                <span className="text-[11px] text-slate-500 truncate block">
                  {isBn ? 'সুবাস ও পুষ্টি সংরক্ষিত' : 'Dinajpur & Tejgaon hubs'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#FAF8F5] border border-slate-200/60">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-emerald-800 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs sm:text-sm text-slate-900 block truncate">
                  {isBn ? '২৪-৪৮ ঘণ্টায় ডেলিভারি' : 'Nationwide 24-48h'}
                </span>
                <span className="text-[11px] text-slate-500 truncate block">
                  {isBn ? 'দেশের ৬৪ জেলায় পৌঁছে যায়' : 'Doorstep & Truckloads'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC CATEGORY SHOWCASE (Foodano / Ekomart style) */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-800 block mb-1">
                {isBn ? 'কৃষিপণ্যের খাতসমূহ' : 'Commodity Sectors'}
              </span>
              <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-slate-900">
                {isBn ? 'প্রাকৃতিক কৃষিপণ্যের বৈচিত্র্য' : 'Explore Agricultural Categories'}
              </h2>
            </div>
            <Link to="/shop" className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1">
              <span>{isBn ? 'সব ক্যাটাগরি ঘুরে দেখুন' : 'View All Categories'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
            {[
              { titleEn: 'Fresh Fruits', titleBn: 'তাজা ফলমূল', slug: 'fresh-fruits', icon: Apple, desc: 'আম, লিচু, পেঁপে' },
              { titleEn: 'Rice Products', titleBn: 'চাল ও সুগন্ধি ধান', slug: 'rice-products', icon: Wheat, desc: 'চিনিগুঁড়া, বাসমতি' },
              { titleEn: 'Corn & Grains', titleBn: 'ভুট্টা ও দানাশস্য', slug: 'grains-cereals', icon: Flame, desc: 'হলুদ ভুট্টা, গম' },
              { titleEn: 'Farm Vegetables', titleBn: 'তাজা শাকসবজি', slug: 'vegetables', icon: Carrot, desc: 'বগুড়ার আলু, পেঁয়াজ' },
              { titleEn: 'Pulses & Lentils', titleBn: 'দেশি ডাল ও ছোলা', slug: 'pulses-legumes', icon: Leaf, desc: 'কুষ্টিয়ার মসুর ডাল' },
              { titleEn: 'Pure Spices', titleBn: 'খাঁটি মসলা', slug: 'pure-spices', icon: Sparkles, desc: 'পাবনার হলুদ, মরিচ' },
              { titleEn: 'Seeds & Saplings', titleBn: 'চারা ও বীজ', slug: 'seeds-saplings', icon: Sprout, desc: 'কলম চারা ও বীজ' }
            ].map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  to={`/shop?category=${cat.slug}`}
                  className="bg-white border border-slate-200/80 rounded-2xl p-4 text-center hover:shadow-sm hover:border-emerald-600/40 transition-all group flex flex-col items-center justify-between space-y-2.5"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] text-emerald-800 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block group-hover:text-emerald-800 transition-colors">
                      {isBn ? cat.titleBn : cat.titleEn}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {cat.desc}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. MAIN PRODUCT SHOWCASE WITH TABS (Gsore / Orfarm Grid) */}
      <section className="py-12 sm:py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header & Interactive Filter Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-800 block mb-1">
                {isBn ? 'সদ্য সংগৃহীত ফসল' : 'Fresh Harvest & Milled Grains'}
              </span>
              <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-slate-900">
                {isBn ? 'জনপ্রিয় কৃষিপণ্যের তালিকা' : 'Featured Agricultural Produce'}
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {[
                { id: 'all', labelEn: 'All Produce', labelBn: 'সকল কৃষিপণ্য' },
                { id: 'fresh-fruits', labelEn: 'Fresh Fruits', labelBn: 'মৌসুমি ফল' },
                { id: 'rice-products', labelEn: 'Table Rice', labelBn: 'টেবিল চাল' },
                { id: 'grains-cereals', labelEn: 'Corn & Grains', labelBn: 'ভুট্টা ও দানা' },
                { id: 'pulses-legumes', labelEn: 'Pulses & Dal', labelBn: 'দেশি ডাল' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategoryTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeCategoryTab === tab.id
                      ? 'bg-emerald-900 text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                  }`}
                >
                  {isBn ? tab.labelBn : tab.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-3/4 rounded-2xl w-full" />
              ))}
            </div>
          ) : tabFilteredProducts.length === 0 ? (
            <div className="bg-[#FAF8F5] rounded-3xl p-12 text-center border border-slate-200">
              <Sprout className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="font-serif-display text-lg font-bold text-slate-900 mb-1">
                {isBn ? 'এই ক্যাটাগরিতে পণ্য প্রস্তুত হচ্ছে' : 'Harvesting lots being packed'}
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                {isBn ? 'শীঘ্রই নতুন লট স্টকে যোগ করা হবে। সম্পূর্ণ শপ দেখুন।' : 'Fresh batches being unloaded at the silos. Explore our full catalog.'}
              </p>
              <Link
                to="/shop"
                className="inline-flex px-5 py-2.5 bg-emerald-800 text-white text-xs font-bold rounded-xl"
              >
                {isBn ? 'সম্পূর্ণ শপ ক্যাটালগ' : 'Browse Full Catalog'}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {tabFilteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Bottom Explore CTA */}
          <div className="text-center pt-10">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white border border-slate-300 hover:border-emerald-700 text-slate-900 hover:text-emerald-900 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-all"
            >
              <span>{isBn ? 'সকল কৃষিপণ্য দেখুন (সম্পূর্ণ ক্যাটালগ)' : 'Explore All Agricultural Produce'}</span>
              <ArrowRight className="w-4 h-4 text-emerald-800" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. THREE EDITORIAL PROMO BANNERS (Foodano & Ekomart Style) */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Banner 1: Seasonal Mangoes & Litchis */}
            <div className="rounded-3xl bg-gradient-to-br from-amber-700 to-amber-900 text-white p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden shadow-xs">
              <div 
                className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80')" }}
              />
              <div className="relative z-10 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200 bg-white/20 px-2.5 py-0.5 rounded">
                  {isBn ? 'রাজশাহী ও দিনাজপুর' : 'Rajshahi & Dinajpur'}
                </span>
                <h3 className="font-serif-display text-xl sm:text-2xl font-bold leading-tight">
                  {isBn ? 'হিমসাগর আম ও বেদানা লিচু প্রি-অর্ডার' : 'Himsagar Mango & Litchi Harvest Booking'}
                </h3>
                <p className="text-xs text-amber-100/90 leading-relaxed">
                  {isBn ? 'গাছের তাজা ফল সরাসরি বাগান থেকে। রাসায়নিকমুক্ত কুশনযুক্ত ক্যারেট ডেলিভারি।' : 'Direct from heritage orchards. Chemical-free cold-chain cushioned crate dispatch.'}
                </p>
              </div>
              <Link to="/seasonal" className="relative z-10">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl backdrop-blur-xs transition-colors">
                  {isBn ? 'প্রি-অর্ডার বুকিং' : 'Pre-order Booking'} →
                </span>
              </Link>
            </div>

            {/* Banner 2: Milling Rice & Aromatic Grain */}
            <div className="rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden shadow-xs">
              <div 
                className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80')" }}
              />
              <div className="relative z-10 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 bg-white/20 px-2.5 py-0.5 rounded">
                  {isBn ? 'সর্টেক্স অটো সাইলো' : 'Sortex Milling'}
                </span>
                <h3 className="font-serif-display text-xl sm:text-2xl font-bold leading-tight">
                  {isBn ? 'ঐতিহ্যবাহী সুগন্ধি চিনিগুঁড়া ও টেবিল চাল' : 'Artisan Chinigura & Premium Table Rice'}
                </h3>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  {isBn ? 'ডাবল পারবয়েল্ড ও অপটিক্যাল সর্টেক্স পরিষ্কার। পোকা ও কৃত্রিম মোমরহিত খাঁটি চাল।' : 'Unpolished traditional grains retaining natural bran, minerals, and rich aroma.'}
                </p>
              </div>
              <Link to="/shop?category=rice-products" className="relative z-10">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl backdrop-blur-xs transition-colors">
                  {isBn ? 'চালের জাত দেখুন' : 'Explore Rice Varieties'} →
                </span>
              </Link>
            </div>

            {/* Banner 3: Wholesale Maize & Bulk Sacks */}
            <div className="rounded-3xl bg-gradient-to-br from-slate-800 to-slate-950 text-white p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden shadow-xs">
              <div 
                className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80')" }}
              />
              <div className="relative z-10 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-white/20 px-2.5 py-0.5 rounded">
                  {isBn ? 'বাণিজ্যিক ও ফিড মিল' : 'Feed & Bulk Agro'}
                </span>
                <h3 className="font-serif-display text-xl sm:text-2xl font-bold leading-tight">
                  {isBn ? '৫০ কেজি বস্তা ও মেট্রিক টন বাল্ক সরবরাহ' : '50kg Commercial Sacks & Metric Ton Lots'}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isBn ? 'পোল্ট্রি ফিড ভুট্টা, ডাল ও পাইকারি চাল। সরকারি ভ্যাট চালান ও ওজন স্কেল স্লিপ সহ।' : 'Yellow feed maize and whole grains with weighbridge cert & VAT Mushak 6.3 invoices.'}
                </p>
              </div>
              <Link to="/quotations/request" className="relative z-10">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl backdrop-blur-xs transition-colors">
                  {isBn ? 'বাল্ক কোটেশন ফর্ম' : 'Submit Commercial RFQ'} →
                </span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 6. PARTNER FARMERS SPOTLIGHT (Human Agronomy Connection) */}
      <section className="py-12 sm:py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-800 block mb-1">
                {isBn ? 'আমাদের কৃষক পরিবার' : 'Our Verified Growers'}
              </span>
              <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-slate-900">
                {isBn ? 'যাঁদের পরিশ্রমে আপনার থালায় খাঁটি অন্ন' : 'Direct Partnerships with Bangladesh Farmers'}
              </h2>
            </div>
            <Link to="/farmers" className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1">
              <span>{isBn ? 'সব কৃষকের তালিকা' : 'View Farmer Network'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {farmers.length === 0 ? (
              [
                { name: 'Abdul Karim Mondol', banglaName: 'আব্দুল করিম মণ্ডল', farm: 'Gorai Silt Basin Agro', district: 'Kushtia', crop: 'Deshi Masoor Dal' },
                { name: 'Al-Amin Pramanik', banglaName: 'আল-আমিন প্রামাণিক', farm: 'Pramanik Agro Farms', district: 'Bogura', crop: 'Yellow Hybrid Maize' },
                { name: 'Md. Khalilur Rahman', banglaName: 'মো. খলিলুর রহমান', farm: 'Heritage Aromatic Orchards', district: 'Dinajpur', crop: 'Chinigura Rice' },
                { name: 'Sultan Mahmud', banglaName: 'সুলতান মাহমুদ', farm: 'Padma Basin Fruit Orchards', district: 'Rajshahi', crop: 'Himsagar Mango' }
              ].map((f, i) => (
                <div key={i} className="bg-[#FAF8F5] rounded-2xl p-5 border border-slate-200/80 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-serif font-bold text-lg flex items-center justify-center">
                    {f.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">{isBn ? f.banglaName : f.name}</span>
                    <span className="text-xs text-emerald-800 font-medium">{f.farm}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 space-y-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-700" /> {f.district}, Bangladesh
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Leaf className="w-3 h-3 text-emerald-700" /> {f.crop}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              farmers.map((farmer) => (
                <div key={farmer._id} className="bg-[#FAF8F5] rounded-2xl p-5 border border-slate-200/80 space-y-3">
                  <img
                    src={farmer.photoUrl || "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=300&q=80"}
                    alt={farmer.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-2xs"
                  />
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">
                      {isBn && farmer.banglaName ? farmer.banglaName : farmer.name}
                    </span>
                    <span className="text-xs text-emerald-800 font-medium truncate block">{farmer.farmName}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 space-y-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-700" /> {farmer.district}, Bangladesh
                    </span>
                    <span className="block text-slate-700 font-semibold truncate">
                      ফসল: {Array.isArray(farmer.primaryCrops) ? farmer.primaryCrops.join(', ') : farmer.primaryCrops}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 7. COMMERCIAL B2B & WHOLESALE CONTRACT CALLOUT */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#163020] text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3 text-center lg:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                {isBn ? 'প্রাতিষ্ঠানিক সংগ্রহ ও হোলসেল ডেক্স' : 'Enterprise Procurement & Trade Desk'}
              </span>
              <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold">
                {isBn ? 'সুপারমার্কেট, রেস্তোরাঁ ও ফিড মিলের বাল্ক সাপ্লাই' : 'Supplying Supermarkets, HORECA & Feed Mills'}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                {isBn
                  ? '১০ টন বা ২০ টন ট্রাকলোড সরবরাহ, ডিজিটাল ওজন স্কেল রসিদ, সরকারি মূসক-৬.৩ চালান এবং ১৫ দিনের করপোরেট ক্রেডিট সুবিধা।'
                  : 'Multi-tonnage covered van dispatches, moisture certificates, official NBR VAT invoices, and approved corporate credit accounts.'
                }
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3.5 shrink-0">
              <Link
                to="/quotations/request"
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>{isBn ? 'ডিজিটাল কোটেশন জমা দিন' : 'Submit Formal RFQ'}</span>
              </Link>

              <Link
                to="/wholesale"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-bold rounded-xl backdrop-blur-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>{isBn ? 'হোলসেল পোর্টাল' : 'B2B Trade Portal'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
