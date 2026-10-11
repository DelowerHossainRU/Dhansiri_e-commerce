import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { toast } from 'sonner';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    deliveryCharge: 0,
    discountAmount: 0,
    grandTotal: 0,
    totalWeightKg: 0,
    appliedCoupon: null
  });
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cart');
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addItem = async (productId, variantSku, quantity = 1) => {
    try {
      const res = await api.post('/cart/items', { productId, variantSku, quantity });
      if (res.success && res.data) {
        setCart(res.data);
        toast.success('Grain pack added to your cart.');
        setIsCartOpen(true);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add item to cart');
      throw err;
    }
  };

  const updateQty = async (itemId, quantity) => {
    try {
      const res = await api.put('/cart/items', { itemId, quantity });
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update item quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await api.delete(`/cart/items/${itemId}`);
      if (res.success && res.data) {
        setCart(res.data);
        toast.info('Item removed from cart.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.delete('/cart');
      if (res.success) {
        setCart({
          items: [],
          subtotal: 0,
          deliveryCharge: 0,
          discountAmount: 0,
          grandTotal: 0,
          totalWeightKg: 0,
          appliedCoupon: null
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const applyCoupon = async (code) => {
    try {
      const res = await api.post('/cart/coupon', { code });
      if (res.success && res.data) {
        setCart(res.data);
        toast.success(`Coupon "${code.toUpperCase()}" applied successfully!`);
      }
    } catch (err) {
      toast.error(err.message || 'Invalid coupon code');
      throw err;
    }
  };

  const removeCoupon = async () => {
    try {
      const res = await api.delete('/cart/coupon');
      if (res.success && res.data) {
        setCart(res.data);
        toast.info('Coupon removed.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to remove coupon');
    }
  };

  const totalItemsCount = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  const value = {
    cart,
    loading,
    totalItemsCount,
    isCartOpen,
    setIsCartOpen,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    refreshCart: fetchCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
