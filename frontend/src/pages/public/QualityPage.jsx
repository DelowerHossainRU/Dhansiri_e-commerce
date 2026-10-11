import React from 'react';
import { ShieldCheck, Award, Factory, CheckCircle2, Scale, Microscope, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export const QualityPage = () => {
  const steps = [
    {
      num: '01',
      title: 'Aman & Boro Paddy Selection',
      desc: 'Our agronomists inspect harvested grain directly at the field threshing floor in Dinajpur and Sherpur. Only certified single-origin paddy with uniform moisture and mature golden husk is accepted.'
    },
    {
      num: '02',
      title: 'Multi-Stage De-Stoning & Pre-Cleaning',
      desc: 'Raw paddy passes through vibratory screeners, cyclonic air aspirators, and rare-earth magnetic drums to eliminate straw, dust, mud balls, and micro-stones with 100% precision.'
    },
    {
      num: '03',
      title: 'Controlled Steam Parboiling',
      desc: 'Using low-pressure steam injection in stainless steel pressure autoclaves, outer bran nutrients (thiamine and minerals) are naturally forced into the grain core before husking.'
    },
    {
      num: '04',
      title: 'Counter-Flow Air Curing (13.2% Equilibrium)',
      desc: 'Rapid sun drying creates grain cracking; we instead employ slow-drying automated air towers that stabilize moisture at exactly 13.2%, preventing fungal growth and keeping grains resilient.'
    },
    {
      num: '05',
      title: 'Buhler Abrasive De-Husking & Polishing',
      desc: 'State-of-the-art horizontal emery roller mills gently strip the fibrous husk without generating heat or breaking the delicate rice tips.'
    },
    {
      num: '06',
      title: 'Satake Trichromatic Optical Sortex Inspection',
      desc: 'Each individual kernel passes through high-speed digital sensor cameras shooting 10,000 frames per second. Micro air-jets reject discolored, yellow, or defective kernels instantly.'
    },
    {
      num: '07',
      title: 'Rotary Sifter & Broken Kernel Separation',
      desc: 'Precision rotary cylinders sort grains by length. Our table rice maintains a guaranteed broken grain ratio below 0.5%, giving you long, uniform grains that cook separately.'
    },
    {
      num: '08',
      title: 'Inert Hermetic Packaging & Traceability',
      desc: 'Sealed immediately into multi-layer moisture barrier foil and food-grade woven sacks. Every bag carries a batch number tracing back to the harvest silo date.'
    }
  ];

  return (
    <div className="w-full">
      {/* Editorial Header */}
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
            Quality Assurance Standard
          </span>
          <h1
            className="font-serif-display text-4xl sm:text-5xl font-bold leading-tight"
            style={{ color: 'var(--brand-primary)' }}
          >
            The Science of Pure Bengali Grain
          </h1>
          <p className="text-base text-[#52525B] font-light leading-relaxed">
            At Dhansiri Agro, quality is not a marketing promise—it is an engineered standard. From optical laser cameras to digital moisture balancing, learn how we mill grain without chemical adulteration.
          </p>
        </div>
      </section>

      {/* Lab Testing Standards Strip */}
      <section className="bg-slate-50 border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 border border-slate-200 rounded-xs">
            <Microscope className="w-8 h-8 text-emerald-800 mb-3" />
            <h3 className="font-serif-display text-base font-bold text-slate-900 mb-1">In-House QA Laboratory</h3>
            <p className="text-xs text-[#71717A] leading-relaxed font-light">
              Every 25 MT milling shift undergoes moisture titration, amylose gelatinization analysis, and broken kernel measurement in our Dinajpur QA lab.
            </p>
          </div>
          <div className="bg-white p-6 border border-slate-200 rounded-xs">
            <Award className="w-8 h-8 text-emerald-800 mb-3" />
            <h3 className="font-serif-display text-base font-bold text-slate-900 mb-1">BSTI & ISO 22000 Certified</h3>
            <p className="text-xs text-[#71717A] leading-relaxed font-light">
              Fully compliant with Bangladesh Standard BDS 1819:2009 for milled rice, and certified under ISO 22000:2018 food safety management standards.
            </p>
          </div>
          <div className="bg-white p-6 border border-slate-200 rounded-xs">
            <ShieldCheck className="w-8 h-8 text-emerald-800 mb-3" />
            <h3 className="font-serif-display text-base font-bold text-slate-900 mb-1">Zero Chemical Whiteners</h3>
            <p className="text-xs text-[#71717A] leading-relaxed font-light">
              We strictly reject urea, talcum powder, or artificial perfumes. The natural luster comes purely from water-mist friction polishing.
            </p>
          </div>
        </div>
      </section>

      {/* 8-Stage Process Workflow */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold block mb-1">
            Milling Architecture
          </span>
          <h2 className="font-serif-display text-3xl font-semibold text-slate-900">
            The 8-Stage Precision Workflow
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((st) => (
            <div key={st.num} className="p-8 bg-white border border-slate-200 rounded-xs flex gap-6 hover:border-[#9F7E3B] transition-colors">
              <span className="font-serif-display text-3xl font-bold text-[#C5A059] shrink-0">
                {st.num}
              </span>
              <div>
                <h3 className="font-serif-display text-lg font-semibold text-slate-900 mb-2">
                  {st.title}
                </h3>
                <p className="text-xs text-[#52525B] leading-relaxed font-light">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-[#1E382B] text-white p-8 sm:p-12 rounded-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-serif-display text-2xl font-semibold">Experience the Quality in Your Own Kitchen</h3>
            <p className="text-xs text-[#D1D5DB]">Taste the difference of true optical Sortex processing and 13.2% moisture equilibrium.</p>
          </div>
          <Link to="/shop">
            <Button variant="gold" size="lg">Explore Our Rice Catalog <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
