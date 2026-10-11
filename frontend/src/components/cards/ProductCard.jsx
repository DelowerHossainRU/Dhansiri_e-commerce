import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star, MapPin, Sparkles, Calendar, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const ProductCard = ({ product, onQuickView }) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const { t, language, formatPrice, translateUnit } = useLanguage();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [adding, setAdding] = useState(false);

  const variants = product.variants || [];
  const activeVariant = variants[selectedVariantIndex] || variants[0] || {};

  // Tier-based price resolution
  let currentPrice = activeVariant.retailPrice || product.retailPrice || 0;
  if (activeVariant.discountPrice > 0 && activeVariant.discountPrice < currentPrice) {
    currentPrice = activeVariant.discountPrice;
  }
  if (user?.pricingTier === 'wholesale' && activeVariant.wholesalePrice) {
    currentPrice = activeVariant.wholesalePrice;
  } else if (user?.pricingTier === 'distributor' && activeVariant.distributorPrice) {
    currentPrice = activeVariant.distributorPrice;
  }

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setAdding(true);
      await addItem(product._id, activeVariant.variantSku, 1);
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  const hasDiscount = activeVariant.discountPrice > 0 && activeVariant.discountPrice < activeVariant.retailPrice;
  const discountPercent = hasDiscount
    ? Math.round(((activeVariant.retailPrice - activeVariant.discountPrice) / activeVariant.retailPrice) * 100)
    : 0;

  const isBookmarked = isInWishlist(product._id);

  // Seasonal Status & Badge
  const seasonalStatus = product.seasonalInfo?.availabilityStatus || (product.isSeasonal ? 'Seasonal' : null);
  const isPreOrder = seasonalStatus === 'Pre-order Open';
  const isComingSoon = seasonalStatus === 'Coming Soon';
  const isOutOfSeason = seasonalStatus === 'Out of Season';

  // Unit string
  const unitLabel = translateUnit(product.unit || activeVariant.unit || 'kg');

  return (
    <div className="group relative bg-white border border-slate-200/90 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-emerald-300 flex flex-col justify-between">
      {/* Top Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-50">
        <Link to={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={activeVariant.image || product.featuredImage || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
            loading="lazy"
          />
        </Link>

        {/* Badges Stack (Top Left) */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 pointer-events-none">
          {hasDiscount && (
            <span className="px-2.5 py-0.5 text-[10px] uppercase font-black tracking-wider text-white bg-amber-600 rounded-md shadow-xs">
              {discountPercent}% OFF
            </span>
          )}

          {isPreOrder && (
            <span className="px-2.5 py-0.5 text-[10px] uppercase font-black tracking-wider text-amber-950 bg-amber-300 rounded-md shadow-xs flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {t('status.preOrderOpen')}
            </span>
          )}

          {isComingSoon && (
            <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold text-sky-900 bg-sky-100 rounded-md shadow-xs">
              {t('status.comingSoon')}
            </span>
          )}

          {product.isSeasonal && !isPreOrder && !isComingSoon && (
            <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-900 bg-emerald-100 rounded-md shadow-xs">
              {t('status.inSeason')}
            </span>
          )}
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10 ${
            isBookmarked
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/90 text-slate-500 hover:text-slate-900 hover:bg-white shadow-xs'
          }`}
          title={isBookmarked ? 'In Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick View Button overlay on hover */}
        {onQuickView && (
          <div className="absolute inset-x-0 bottom-2.5 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              className="px-4 py-1.5 bg-white/95 backdrop-blur-xs text-slate-800 text-xs font-bold rounded-full shadow-md flex items-center gap-1.5 hover:bg-emerald-700 hover:text-white transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> {t('actions.quickView')}
            </button>
          </div>
        )}
      </div>

      {/* Card Details Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Origin & Variety Bar */}
          <div className="flex items-center justify-between text-[11px] mb-1.5 text-slate-500 font-medium">
            <span className="flex items-center gap-1 text-emerald-800 font-bold truncate max-w-[140px]">
              <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">{product.district || product.origin || 'Bangladesh'}</span>
            </span>
            <div className="flex items-center gap-1 text-amber-500 shrink-0">
              <Star className="w-3 h-3 fill-amber-500" />
              <span className="font-bold text-slate-800 text-xs">{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
              <span className="text-slate-400 text-[10px]">({product.reviewCount || 12})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link to={`/products/${product.slug}`} className="block group-hover:text-emerald-800 transition-colors">
            <h3 className="font-serif-display text-sm font-bold text-slate-900 line-clamp-1 mb-0.5">
              {language === 'bn' && product.banglaName ? product.banglaName : product.name}
            </h3>
            {language !== 'bn' && product.banglaName && (
              <p className="text-[11px] text-slate-500 line-clamp-1 font-serif">
                {product.banglaName}
              </p>
            )}
          </Link>

          {/* Packaging & Unit Variants Selector */}
          {variants.length > 1 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {variants.map((v, idx) => (
                <button
                  key={v.variantSku}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedVariantIndex(idx);
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                    selectedVariantIndex === idx
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {v.quantityOrWeight} {translateUnit(v.unit)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Unit-Aware Pricing & Add to Cart Action */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-emerald-950">
                {formatPrice(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through font-normal">
                  {formatPrice(activeVariant.retailPrice)}
                </span>
              )}
              <span className="text-xs text-slate-500 font-semibold">
                / {unitLabel}
              </span>
            </div>
            {user?.pricingTier === 'wholesale' && (
              <span className="text-[10px] font-bold text-emerald-700 block">
                Wholesale B2B Rate
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding || isOutOfSeason || activeVariant.stock <= 0}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs transition-all flex items-center gap-1.5 ${
              isOutOfSeason || activeVariant.stock <= 0
                ? 'bg-slate-300 cursor-not-allowed text-slate-600'
                : isPreOrder
                ? 'bg-amber-600 hover:bg-amber-700 active:scale-95'
                : 'bg-emerald-800 hover:bg-emerald-900 active:scale-95'
            }`}
            title={activeVariant.stock > 0 ? (isPreOrder ? t('actions.preOrder') : t('actions.addToCart')) : t('status.soldOut')}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isPreOrder ? t('actions.preOrder') : (activeVariant.stock <= 0 ? t('status.soldOut') : t('actions.addToCart'))}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
