import React from 'react';
import { MapPin, Users, HeartHandshake, ShieldCheck, Sprout, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export const SourcingPage = () => {
  const regions = [
    {
      district: 'Dinajpur',
      crop: 'Chinigura Aromatic & Kataribhog',
      terroir: 'Red alluvial silt from the Punarbhaba river basin. Cooler night temperatures during the grain-filling stage allow the natural floral terpenes (2-acetyl-1-pyrroline) to concentrate in the kernel without volatilizing.',
      farmers: '480 Partner Families'
    },
    {
      district: 'Sherpur',
      crop: 'Royal Kalijira Micro-Grain',
      terroir: 'Foothills of the Garo ranges along the Brahmaputra basin. Sandy-loam soils nourished by Himalayan mountain streams produce tiny, fragrant pearls prized for ceremonial polao.',
      farmers: '320 Partner Families'
    },
    {
      district: 'Barishal',
      crop: 'Aged Nazirshail Shonali',
      terroir: 'Southern riverine delta silt. Traditional single-parboiled long slender grains with natural golden hue and light digestibility.',
      farmers: '260 Partner Families'
    },
    {
      district: 'Bogura & Naogaon',
      crop: 'Organic Red Brown Rice & BRRI-Dhan 28',
      terroir: 'The fertile Barendra agro-ecological zone. Low GI, high-mineral soils harvested under strict organic IPM (Integrated Pest Management) protocols without synthetic sprays.',
      farmers: '190 Partner Families'
    }
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <section
        className="py-16 sm:py-20 border-b transition-colors duration-200"
        style={{
          backgroundColor: 'var(--brand-subtle)',
          borderColor: 'var(--brand-border)'
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span
            className="text-xs uppercase tracking-widest font-bold block"
            style={{ color: 'var(--brand-accent)' }}
          >
            Agricultural Provenance
          </span>
          <h1
            className="font-serif-display text-4xl sm:text-5xl font-bold leading-tight"
            style={{ color: 'var(--brand-primary)' }}
          >
            Honoring Bengal's Heritage Terroirs
          </h1>
          <p className="text-base text-[#52525B] font-light leading-relaxed">
            Great rice is not manufactured in a factory—it is born from fertile soil, pristine river silt, and the dedicated care of experienced farming families.
          </p>
        </div>
      </section>

      {/* Terroirs Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold block mb-1">
            Regional Provenance
          </span>
          <h2 className="font-serif-display text-3xl font-semibold text-slate-900">
            Where Our Grains Are Cultivated
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {regions.map((reg) => (
            <div key={reg.district} className="p-8 bg-white border border-slate-200 rounded-xs space-y-4 hover:border-[#9F7E3B] transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-800" />
                  <h3 className="font-serif-display text-xl font-bold text-slate-900">{reg.district}</h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-50 text-emerald-800 border border-slate-200 rounded-xs">
                  {reg.farmers}
                </span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-[#1E382B] block mb-1">
                  Primary Cultivar: {reg.crop}
                </span>
                <p className="text-xs text-[#52525B] leading-relaxed font-light">
                  {reg.terroir}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Direct Farmer Partnerships Pillars */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-8 bg-white border border-slate-200 rounded-xs space-y-3">
              <HeartHandshake className="w-8 h-8 text-emerald-800" />
              <h3 className="font-serif-display text-lg font-bold text-slate-900">Fair Farm-Gate Floor Pricing</h3>
              <p className="text-xs text-[#71717A] leading-relaxed font-light">
                We contract with farmers before planting season, guaranteeing minimum floor prices 12-15% above volatile spot markets. This insulates farming families from seasonal predatory broker margins.
              </p>
            </div>
            <div className="p-8 bg-white border border-slate-200 rounded-xs space-y-3">
              <Sprout className="w-8 h-8 text-emerald-800" />
              <h3 className="font-serif-display text-lg font-bold text-slate-900">Foundation Seed Purity</h3>
              <p className="text-xs text-[#71717A] leading-relaxed font-light">
                We distribute certified pure foundation seeds from the Bangladesh Rice Research Institute (BRRI) directly to our growers, safeguarding true cultivar genetics against cross-pollination.
              </p>
            </div>
            <div className="p-8 bg-white border border-slate-200 rounded-xs space-y-3">
              <ShieldCheck className="w-8 h-8 text-emerald-800" />
              <h3 className="font-serif-display text-lg font-bold text-slate-900">Organic Bio-Fertilizer Subsidies</h3>
              <p className="text-xs text-[#71717A] leading-relaxed font-light">
                Partner cooperatives receive organic compost subsidies and biological pest deterrent training, keeping heavy metals, pesticides, and chemical residues out of your dining bowl.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
