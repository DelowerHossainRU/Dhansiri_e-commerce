import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, MapPin } from 'lucide-react';
import client from '../../api/client';
import { ProductCard } from '../../components/cards/ProductCard';
import { Skeleton } from '../../components/common/Skeleton';
import { useLanguage } from '../../context/LanguageContext';

export const FreshHarvestPage = () => {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFresh = async () => {
      try {
        setLoading(true);
        const res = await client.get('/products/fresh-harvest?limit=20');
        const list = res?.data || (Array.isArray(res) ? res : []);
        setProducts(Array.isArray(list) ? list : (list.data || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFresh();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="pb-8 border-b border-slate-200 mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Field-Intake Batch Sourcing</span>
        </div>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-black text-slate-900">
          {language === 'bn' ? 'ক্ষেত থেকে নতুন আসা তাজা ফসল' : 'Freshly Harvested Field Produce'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
          Fresh arrivals processed through sorting and quality inspection within the last 24 to 48 hours.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 border rounded-2xl space-y-3">
              <Skeleton className="aspect-4/3 w-full rounded-xl" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
