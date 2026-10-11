import React, { useState, useEffect } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, ShoppingBag, Plus, Minus, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/format';
import { Button } from '../common/Button';
import { Link, useNavigate } from 'react-router-dom';

export const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQty, removeItem, applyCoupon, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try {
      setApplying(true);
      await applyCoupon(couponCode);
      setCouponCode('');
    } catch (err) {
      // toast shown in context
    } finally {
      setApplying(false);
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const freeDeliveryThreshold = 2500;
  const progressPercent = Math.min(100, Math.round((cart.subtotal / freeDeliveryThreshold) * 100));
  const remainingForFree = Math.max(0, freeDeliveryThreshold - cart.subtotal);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-slate-200 z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-600" />
                <h2 className="font-serif-display text-lg font-semibold text-slate-900">
                  Your Grain Cart ({cart.items?.reduce((s, i) => s + i.quantity, 0) || 0})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-[#71717A] hover:text-slate-900 rounded-sm hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Meter */}
            <div className="px-6 py-3 bg-emerald-50/50 border-b border-slate-200 text-xs">
              {remainingForFree > 0 ? (
                <p className="text-[#4A4744] mb-1.5 font-medium">
                  Add <span className="font-bold text-slate-900">{formatPrice(remainingForFree)}</span> more for <span className="text-[#1E382B] font-bold">Free Retail Delivery</span> across Dhaka.
                </p>
              ) : (
                <p className="text-[#1E382B] mb-1.5 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> You qualify for Complimentary Fast Delivery!
                </p>
              )}
              <div className="w-full bg-[#E5DDCF] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#1E382B] h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-[#EFE9DF]">
              {!cart.items || cart.items.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-12 h-12 text-[#B0A695] mx-auto mb-3 stroke-1" />
                  <p className="font-serif-display text-base font-semibold text-slate-900 mb-1">Your cart is empty</p>
                  <p className="text-xs text-[#71717A] mb-5">Explore our heritage grain millings and select freshly processed packs.</p>
                  <Button variant="outline" size="sm" onClick={() => { setIsCartOpen(false); navigate('/shop'); }}>
                    Browse Rice Catalog
                  </Button>
                </div>
              ) : (
                cart.items.map((item) => (
                  <div key={item._id} className="pt-4 first:pt-0 flex gap-3.5">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=200&q=80'}
                      alt={item.variantTitle}
                      className="w-18 h-18 object-cover rounded-xs border border-slate-200 shrink-0 bg-white"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-semibold text-slate-900 leading-snug line-clamp-2">
                            {item.variantTitle}
                          </h4>
                          <button
                            onClick={() => removeItem(item._id)}
                            className="text-[#9CA3AF] hover:text-rose-600 p-0.5 ml-1 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[11px] text-[#71717A]">
                          Pack weight: {item.weightKg} kg
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-slate-200 rounded-xs bg-white">
                          <button
                            onClick={() => updateQty(item._id, item.quantity - 1)}
                            className="p-1 text-[#71717A] hover:text-slate-900"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item._id, item.quantity + 1)}
                            className="p-1 text-[#71717A] hover:text-slate-900"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-bold text-slate-900">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Summary */}
            {cart.items && cart.items.length > 0 && (
              <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-3">
                {/* Coupon Input */}
                {cart.appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-sm text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800">
                      <Tag className="w-3.5 h-3.5" />
                      <span className="font-semibold">{cart.appliedCoupon.code}</span>
                      <span>(-{formatPrice(cart.discountAmount)})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-emerald-700 hover:text-emerald-900 font-semibold underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code (e.g. DHANSIRI100)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-200 text-xs uppercase tracking-wider rounded-sm outline-none focus:border-emerald-700"
                    />
                    <Button type="submit" variant="secondary" size="sm" loading={applying}>
                      Apply
                    </Button>
                  </form>
                )}

                {/* Pricing Breakdown */}
                <div className="space-y-1.5 text-xs text-[#52525B] pt-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">{formatPrice(cart.subtotal)}</span>
                  </div>
                  {cart.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount</span>
                      <span>-{formatPrice(cart.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Estimated Delivery</span>
                    <span>{cart.deliveryCharge === 0 ? 'Free' : formatPrice(cart.deliveryCharge)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total Due</span>
                    <span>{formatPrice(cart.grandTotal)}</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full mt-2"
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
