import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlistIds(new Set());
      setWishlistProducts([]);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/wishlist');
      if (res.success && res.data) {
        setWishlistProducts(res.data);
        const ids = new Set(res.data.map(p => (p._id ? p._id.toString() : p.toString())));
        setWishlistIds(ids);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.info('Please sign in to save items to your personal wishlist.');
      return false;
    }

    try {
      const res = await api.post('/wishlist/toggle', { productId });
      if (res.success) {
        const nextIds = new Set(wishlistIds);
        if (nextIds.has(productId)) {
          nextIds.delete(productId);
          toast.info('Removed from saved grains.');
        } else {
          nextIds.add(productId);
          toast.success('Saved to your grain wishlist.');
        }
        setWishlistIds(nextIds);
        fetchWishlist();
        return true;
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update wishlist');
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlistIds.has(productId);
  };

  const value = {
    wishlistProducts,
    wishlistCount: wishlistIds.size,
    loading,
    isInWishlist,
    toggleWishlist,
    refreshWishlist: fetchWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
