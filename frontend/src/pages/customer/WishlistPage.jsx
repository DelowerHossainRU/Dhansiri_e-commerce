import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/format';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';

export const WishlistPage = () => {
  const { wishlistProducts, toggleWishlist, loading } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToCart = async (product) => {
    const firstVariant = product.variants?.[0];
    if (firstVariant) {
      await addItem(product._id, firstVariant.variantSku, 1);
      toggleWishlist(product._id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="pb-6 border-b border-slate-200 mb-8">
        <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold block mb-1">
          Saved Grains
        </span>
        <h1 className="font-serif-display text-3xl font-semibold text-slate-900">
          My Grain Wishlist ({wishlistProducts.length})
        </h1>
      </div>

      {wishlistProducts.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Save premium cultivars to inspect moisture specs or order when your pantry runs low."
          actionLabel="Browse Rice Varieties"
          onAction={() => window.location.href = '/shop'}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((p) => {
            const firstVariant = p.variants?.[0] || {};
            const price = firstVariant.discountPrice > 0 ? firstVariant.discountPrice : firstVariant.retailPrice;

            return (
              <div key={p._id} className="bg-white border border-slate-200 rounded-xs overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="aspect-4/3 overflow-hidden bg-slate-50 relative">
                    <img src={p.featuredImage} alt={p.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => toggleWishlist(p._id)}
                      className="absolute top-2.5 right-2.5 p-1.5 bg-white/80 hover:bg-white text-rose-600 rounded-full shadow-xs"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 space-y-1">
                    <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
                      {p.category?.name}
                    </span>
                    <h3 className="font-serif-display text-sm font-semibold text-slate-900 line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-xs font-bold text-slate-900 pt-1">
                      {formatPrice(price)}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => handleMoveToCart(p)}
                  >
                    Move to Cart <ShoppingBag className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
