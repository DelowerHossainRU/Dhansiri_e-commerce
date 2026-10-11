import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import client from '../../api/client';
import { ProductCard } from '../../components/cards/ProductCard';
import { Skeleton } from '../../components/common/Skeleton';
import { useLanguage } from '../../context/LanguageContext';

export const SeasonalPage = () => {
  const { t, language } = useLanguage();
  const [seasonalProducts, setSeasonalProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeasonal = async () => {
      try {
        setLoading(true);
        const res = await client.get('/products/seasonal?limit=20');
        const list = res?.data || (Array.isArray(res) ? res : []);
        setSeasonalProducts(Array.isArray(list) ? list : (list.data || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeasonal();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 text-white p-8 sm:p-12 mb-12 shadow-xl relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1400&q=80')" }}
        />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-white/20 text-amber-200 border border-white/20">
            <Calendar className="w-3.5 h-3.5" />
            <span>Seasonal Harvest Calendar 2026</span>
          </div>
          <h1 className="font-serif-display text-3xl sm:text-5xl font-black leading-tight">
            {language === 'bn' ? 'মৌসুমি ফল ও ফসলের সমাহার' : 'Seasonal Harvest & Orchard Pre-Orders'}
          </h1>
          <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed font-light">
            Harvested exclusively at peak physiological maturity. Reserve early for guaranteed tree-ripened fruit crates and freshly harvested grains without chemical ripening.
          </p>
        </div>
      </div>

      {/* Harvest Timeline Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-xs">
        <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
          <span className="font-bold text-amber-900 text-sm block mb-1">May – June (Baishakh/Jaistha)</span>
          <p className="text-slate-600 leading-relaxed">
            Rajshahi Himsagar Mango, Dinajpur Bedana Litchi, China-3 Litchi, and Summer Field Corn.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
          <span className="font-bold text-emerald-900 text-sm block mb-1">June – July (Ashar)</span>
          <p className="text-slate-600 leading-relaxed">
            Rangpur Haribhanga Mango, Amrupali Orchard Crates, Fazli Mango, and Monsoon Vegetable Seeds.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="font-bold text-slate-900 text-sm block mb-1">November – January (Agrahayan/Poush)</span>
          <p className="text-slate-600 leading-relaxed">
            Aman Aromatic Chinigura Paddy Harvest, Bogura Winter Diamond Potatoes, and Fresh Pulses.
          </p>
        </div>
      </div>

      {/* Product Grid */}
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
      ) : seasonalProducts.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl">
          <p className="text-slate-500 text-sm">No seasonal products currently open for booking.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {seasonalProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

    </div>
  );
};
