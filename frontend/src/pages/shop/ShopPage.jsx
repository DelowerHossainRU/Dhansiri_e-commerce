import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Filter, X, ChevronDown, SlidersHorizontal, RefreshCw, LayoutGrid, List,
  MapPin, Star, Calendar, Sparkles, Check, CheckCircle2, ShoppingBag, Eye, Heart
} from 'lucide-react';
import client from '../../api/client';
import { ProductCard } from '../../components/cards/ProductCard';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, language, formatPrice, translateUnit } = useLanguage();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewVariantIdx, setQuickViewVariantIdx] = useState(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Filter params from URL
  const currentCategory = searchParams.get('category') || '';
  const currentUnit = searchParams.get('unit') || '';
  const currentSeasonal = searchParams.get('seasonal') || '';
  const currentDistrict = searchParams.get('district') || '';
  const currentSort = searchParams.get('sort') || 'featured';
  const currentSearch = searchParams.get('search') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentInStock = searchParams.get('inStock') === 'true';
  const currentWholesale = searchParams.get('wholesale') === 'true';
  const currentPage = Number(searchParams.get('page') || 1);

  // Load Categories for sidebar
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await client.get('/catalog/categories');
        const list = res?.data || res || [];
        setCategories(Array.isArray(list) ? list : (list.data || []));
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  // Fetch Products based on URL query
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const query = new URLSearchParams();
        if (currentCategory) query.set('category', currentCategory);
        if (currentUnit) query.set('unit', currentUnit);
        if (currentSeasonal) {
          if (currentSeasonal === 'in-season') query.set('isSeasonal', 'true');
          else if (currentSeasonal === 'pre-order') query.set('seasonalStatus', 'Pre-order Open');
          else if (currentSeasonal === 'available-now') query.set('seasonalStatus', 'Available Now');
        }
        if (currentDistrict) query.set('district', currentDistrict);
        if (currentMinPrice) query.set('minPrice', currentMinPrice);
        if (currentMaxPrice) query.set('maxPrice', currentMaxPrice);
        if (currentInStock) query.set('inStock', 'true');
        if (currentWholesale) query.set('isWholesaleAvailable', 'true');
        if (currentSearch) query.set('search', currentSearch);
        
        // Sort mapping
        if (currentSort === 'price_asc') query.set('sort', 'price_asc');
        else if (currentSort === 'price_desc') query.set('sort', 'price_desc');
        else if (currentSort === 'newest') query.set('sort', 'newest');
        else if (currentSort === 'recently_harvested') query.set('sort', 'recently_harvested');
        else if (currentSort === 'best_seller') query.set('sort', 'best_seller');
        else query.set('sort', 'featured');

        query.set('page', currentPage.toString());
        query.set('limit', '12');

        const res = await client.get(`/products?${query.toString()}`);
        const prodList = res?.data || (Array.isArray(res) ? res : []);
        setProducts(Array.isArray(prodList) ? prodList : (prodList.data || []));
        if (res?.pagination) setPagination(res.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = currentCategory || currentUnit || currentSeasonal || currentDistrict || currentMinPrice || currentMaxPrice || currentInStock || currentWholesale || currentSearch;

  // Filter option presets
  const unitsList = [
    { label: 'Kilogram (kg)', value: 'kg' },
    { label: 'Wooden / Ventilated Crate', value: 'crate' },
    { label: 'Master Sack (25/50kg)', value: 'sack' },
    { label: 'Family Box', value: 'box' },
    { label: 'Bulk Metric Ton', value: 'metric ton' },
    { label: 'Pieces (Pcs)', value: 'piece' },
    { label: 'Gram (g)', value: 'g' }
  ];

  const seasonalList = [
    { label: 'All Crops', value: '' },
    { label: 'In Season Now', value: 'in-season' },
    { label: 'Pre-Order Open', value: 'pre-order' },
    { label: 'Available Now', value: 'available-now' }
  ];

  const districtsList = [
    'Rajshahi', 'Dinajpur', 'Bogura', 'Kushtia', 'Pabna', 'Narsingdi', 'Rangpur', 'Barishal'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-200 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Direct From Growers & Silos</span>
            </div>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-black text-slate-900">
              {t('nav.shop')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
              Fresh fruits, vegetables, Sortex table & aromatic rice, grain corn, pulses, pure spices, and agricultural nursery stocks.
            </p>
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{t('filters.title')}</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT SIDEBAR FILTERS (Desktop Gsore Style) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-700" />
                <span>{t('filters.title')}</span>
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] font-bold text-rose-600 hover:underline"
                >
                  {t('filters.clearFilters')}
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5">
                {t('filters.categories')}
              </h4>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => updateFilter('category', '')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold transition-colors flex items-center justify-between ${
                    !currentCategory ? 'bg-emerald-800 text-white' : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <span>All Agricultural Sectors</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => updateFilter('category', cat.slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold transition-colors flex items-center justify-between ${
                      currentCategory === cat.slug
                        ? 'bg-emerald-800 text-white'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    <span>{language === 'bn' && cat.banglaName ? cat.banglaName : cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Seasonal Availability Filter */}
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5">
                {t('filters.seasonalStatus')}
              </h4>
              <div className="space-y-1.5 text-xs">
                {seasonalList.map((item) => (
                  <label key={item.value} className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="seasonal"
                      checked={currentSeasonal === item.value}
                      onChange={() => updateFilter('seasonal', item.value)}
                      className="text-emerald-700 focus:ring-emerald-600"
                    />
                    <span className="font-medium">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Packaging & Units Filter */}
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5">
                {t('filters.packagingUnits')}
              </h4>
              <div className="space-y-1.5 text-xs">
                {unitsList.map((u) => (
                  <button
                    key={u.value}
                    onClick={() => updateFilter('unit', currentUnit === u.value ? '' : u.value)}
                    className={`w-full text-left px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center justify-between ${
                      currentUnit === u.value
                        ? 'bg-emerald-100 text-emerald-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-200/50'
                    }`}
                  >
                    <span>{u.label}</span>
                    {currentUnit === u.value && <Check className="w-3 h-3 text-emerald-700" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Origin District Filter */}
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5">
                {t('filters.originDistrict')}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {districtsList.map((dst) => (
                  <button
                    key={dst}
                    onClick={() => updateFilter('district', currentDistrict === dst ? '' : dst)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      currentDistrict === dst
                        ? 'bg-emerald-800 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {dst}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter (BDT) */}
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5">
                {t('filters.priceRange')}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="number"
                  placeholder="Min ৳"
                  value={currentMinPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs"
                />
                <input
                  type="number"
                  placeholder="Max ৳"
                  value={currentMaxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs"
                />
              </div>
            </div>

            {/* Wholesale B2B Filter Toggle */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentWholesale}
                  onChange={(e) => updateFilter('wholesale', e.target.checked ? 'true' : '')}
                  className="rounded text-emerald-700 focus:ring-emerald-600"
                />
                <span>{t('filters.wholesaleAvailable')}</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentInStock}
                  onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : '')}
                  className="rounded text-emerald-700 focus:ring-emerald-600"
                />
                <span>{t('filters.inStockOnly')}</span>
              </label>
            </div>

          </div>
        </aside>

        {/* RIGHT MAIN CATALOG AREA */}
        <main className="lg:col-span-9">
          
          {/* Top Controls Bar: Active Filters Chips, View Mode & Sort */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Results count & Active chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 w-full sm:w-auto">
              <span className="font-bold text-slate-900">
                {pagination.total} {t('filters.resultsCount')}
              </span>

              {currentCategory && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px]">
                  Cat: {currentCategory}
                  <button onClick={() => updateFilter('category', '')}><X className="w-3 h-3" /></button>
                </span>
              )}

              {currentUnit && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px]">
                  Unit: {currentUnit}
                  <button onClick={() => updateFilter('unit', '')}><X className="w-3 h-3" /></button>
                </span>
              )}

              {currentDistrict && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px]">
                  District: {currentDistrict}
                  <button onClick={() => updateFilter('district', '')}><X className="w-3 h-3" /></button>
                </span>
              )}

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] font-bold text-rose-600 hover:underline ml-1"
                >
                  {t('filters.clearFilters')}
                </button>
              )}
            </div>

            {/* Sort & Grid/List Toggle */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-semibold">{t('filters.sortBy')}:</span>
                <select
                  value={currentSort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="featured">{t('sortOptions.featured')}</option>
                  <option value="price_asc">{t('sortOptions.priceAsc')}</option>
                  <option value="price_desc">{t('sortOptions.priceDesc')}</option>
                  <option value="newest">{t('sortOptions.newest')}</option>
                  <option value="recently_harvested">{t('sortOptions.recentlyHarvested')}</option>
                  <option value="best_seller">{t('sortOptions.bestSeller')}</option>
                </select>
              </div>

              {/* View toggle */}
              <div className="flex items-center border border-slate-200 bg-white rounded-xl p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-emerald-800 text-white' : 'text-slate-400 hover:text-slate-700'}`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-emerald-800 text-white' : 'text-slate-400 hover:text-slate-700'}`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Product Grid / List Display */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3 p-4 border border-slate-100 rounded-2xl">
                  <Skeleton className="aspect-4/3 w-full rounded-xl" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              title="No agricultural products match your filters"
              message="Try adjusting your category, unit, district, or price range filters."
              actionLabel="Reset All Filters"
              onAction={clearAllFilters}
            />
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
            }>
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={(p) => {
                    setQuickViewProduct(p);
                    setQuickViewVariantIdx(0);
                  }}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pt-10 flex items-center justify-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => updateFilter('page', (currentPage - 1).toString())}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                Previous
              </button>

              {[...Array(pagination.totalPages)].map((_, i) => {
                const pNum = i + 1;
                return (
                  <button
                    key={pNum}
                    onClick={() => updateFilter('page', pNum.toString())}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      currentPage === pNum
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pNum}
                  </button>
                );
              })}

              <button
                disabled={currentPage >= pagination.totalPages}
                onClick={() => updateFilter('page', (currentPage + 1).toString())}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}

        </main>
      </div>

      {/* QUICK VIEW MODAL */}
      {quickViewProduct && (
        <Modal
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          title={quickViewProduct.name}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
              <img
                src={quickViewProduct.variants?.[quickViewVariantIdx]?.image || quickViewProduct.featuredImage}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{quickViewProduct.district || quickViewProduct.origin}</span>
                  {quickViewProduct.variety && <span>• {quickViewProduct.variety}</span>}
                </div>

                <h3 className="font-serif-display text-xl font-bold text-slate-900 mb-1">
                  {language === 'bn' && quickViewProduct.banglaName ? quickViewProduct.banglaName : quickViewProduct.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {quickViewProduct.shortDescription}
                </p>

                {/* Packaging & Unit Variants */}
                <div className="space-y-1.5 mb-4">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Select Unit / Packaging:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {quickViewProduct.variants?.map((v, i) => (
                      <button
                        key={v.variantSku}
                        onClick={() => setQuickViewVariantIdx(i)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          quickViewVariantIdx === i
                            ? 'bg-emerald-800 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {v.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Display */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-2xl font-black text-emerald-950">
                    {formatPrice(quickViewProduct.variants?.[quickViewVariantIdx]?.retailPrice)}
                    <span className="text-xs font-semibold text-slate-500 ml-1">
                      / {translateUnit(quickViewProduct.variants?.[quickViewVariantIdx]?.unit || 'kg')}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    Stock: {quickViewProduct.variants?.[quickViewVariantIdx]?.stock || 0} units available
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    const v = quickViewProduct.variants?.[quickViewVariantIdx] || quickViewProduct.variants?.[0];
                    if (v) addItem(quickViewProduct._id, v.variantSku, 1);
                    setQuickViewProduct(null);
                  }}
                  className="flex-1 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t('actions.addToCart')}</span>
                </button>

                <Link
                  to={`/products/${quickViewProduct.slug}`}
                  onClick={() => setQuickViewProduct(null)}
                  className="px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Full Details →
                </Link>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* MOBILE FILTER ACCESSIBLE DRAWER */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white h-full overflow-y-auto p-5 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-700" />
                  <span>{t('filters.title')}</span>
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Categories */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {t('filters.categories')}
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => { updateFilter('category', ''); setMobileFilterOpen(false); }}
                    className={`w-full text-left p-2 rounded-lg text-xs font-bold ${!currentCategory ? 'bg-emerald-800 text-white' : 'text-slate-700'}`}
                  >
                    All Sectors
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => { updateFilter('category', c.slug); setMobileFilterOpen(false); }}
                      className={`w-full text-left p-2 rounded-lg text-xs font-semibold ${currentCategory === c.slug ? 'bg-emerald-800 text-white' : 'text-slate-700'}`}
                    >
                      {language === 'bn' && c.banglaName ? c.banglaName : c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Districts */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {t('filters.originDistrict')}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {districtsList.map((dst) => (
                    <button
                      key={dst}
                      onClick={() => { updateFilter('district', currentDistrict === dst ? '' : dst); setMobileFilterOpen(false); }}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold ${currentDistrict === dst ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700'}`}
                    >
                      {dst}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs"
              >
                Apply Filters
              </button>
              {hasActiveFilters && (
                <button
                  onClick={() => { clearAllFilters(); setMobileFilterOpen(false); }}
                  className="w-full py-2 rounded-xl text-rose-600 font-semibold text-xs"
                >
                  Reset All
                </button>
              )}
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileFilterOpen(false)} />
        </div>
      )}

    </div>
  );
};
