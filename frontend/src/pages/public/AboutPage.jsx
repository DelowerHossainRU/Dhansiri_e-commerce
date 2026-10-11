import React from 'react';
import { Award, ShieldCheck, Factory, Users, HeartHandshake, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export const AboutPage = () => {
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
            Corporate Profile & Heritage
          </span>
          <h1
            className="font-serif-display text-4xl sm:text-5xl font-bold leading-tight"
            style={{ color: 'var(--brand-primary)' }}
          >
            Milling Heritage, Precision Agribusiness
          </h1>
          <p className="text-base text-[#52525B] font-light leading-relaxed">
            Dhansiri Agro Industries Ltd. is an integrated agricultural milling and grain merchant conglomerate founded on four decades of unyielding dedication to Bengali grain purity.
          </p>
        </div>
      </section>

      {/* Story & Philosophy */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold block">
              Our Journey Since 1984
            </span>
            <h2 className="font-serif-display text-3xl font-semibold text-slate-900">
              From a Humble Dinajpur Mill to a Nationwide Food Anchor
            </h2>
            <p className="text-sm text-[#52525B] leading-relaxed font-light">
              Founded in 1984 by Al-Haj Rafiqul Islam in Pulhat, Dinajpur, Dhansiri Agro began with a fundamental belief: that Bangladesh’s indigenous grain varieties—Chinigura, Kalijira, Nazirshail, and Miniket—deserve the finest modern processing technology in the world.
            </p>
            <p className="text-sm text-[#52525B] leading-relaxed font-light">
              Over the last forty years, our facilities have grown from single-cylinder stone huskers to multi-channel optical Sortex plants, computerized continuous-flow dryers, and stainless steel pressurized steaming vessels.
            </p>
            <p className="text-sm text-[#52525B] leading-relaxed font-light">
              Today, Dhansiri supplies both retail households seeking pristine daily table rice and the country's most discerning hotel banquets, supermarkets, and corporate buyers.
            </p>
          </div>

          <div className="lg:col-span-6 bg-slate-50 border border-slate-200 p-8 rounded-xs space-y-6">
            <h3 className="font-serif-display text-xl font-bold text-slate-900">Our Corporate Pillars</h3>
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-[#1E382B] uppercase tracking-wide">1. Purity Without Compromise</h4>
                <p className="text-[#52525B] mt-1 font-light">Zero chemical bleaching, zero artificial scenting, zero variety blending. What you cook is 100% genuine cultivar.</p>
              </div>
              <div className="pt-3 border-t border-slate-200">
                <h4 className="font-bold text-[#1E382B] uppercase tracking-wide">2. Farmer Cooperative Equity</h4>
                <p className="text-[#52525B] mt-1 font-light">Guaranteed purchase floor prices for our 1,200+ partner families in Dinajpur and Sherpur, ensuring multi-generational agrarian dignity.</p>
              </div>
              <div className="pt-3 border-t border-slate-200">
                <h4 className="font-bold text-[#1E382B] uppercase tracking-wide">3. Scientific Moisture Equilibrium</h4>
                <p className="text-[#52525B] mt-1 font-light">Maintaining 13.2% moisture prevents grain fracture and fungal aflatoxins, preserving long shelf life and perfect cooking elongation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities & Infrastructure */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold block mb-1">
              Industrial Capacity
            </span>
            <h2 className="font-serif-display text-3xl font-semibold text-slate-900">
              Modern Processing Infrastructure
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 border border-slate-200 rounded-xs space-y-3">
              <Factory className="w-8 h-8 text-emerald-800" />
              <h3 className="font-serif-display text-lg font-bold text-slate-900">Dinajpur Automatic Mill Complex</h3>
              <p className="text-xs text-[#71717A] leading-relaxed font-light">
                Spanning 14 acres in the Pulhat Industrial Area, Dinajpur. Houses our 5,000 MT climate-controlled grain silos, Satake optical sorting lines, pressurized parboiling boilers, and quality assurance testing lab.
              </p>
            </div>
            <div className="bg-white p-8 border border-slate-200 rounded-xs space-y-3">
              <Factory className="w-8 h-8 text-emerald-800" />
              <h3 className="font-serif-display text-lg font-bold text-slate-900">Greater Dhaka Logistics Center</h3>
              <p className="text-xs text-[#71717A] leading-relaxed font-light">
                Located in Tejgaon Industrial Area, Dhaka. Handles city-wide retail rapid dispatch, supermarket staging, and institutional bulk distribution for metropolitan five-star hospitality.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
