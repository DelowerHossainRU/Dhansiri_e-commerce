import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, MapPin, CheckCircle2, ShieldCheck, Mail, Sprout, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../../context/LanguageContext';

export const Footer = ({ settings }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { t, language } = useLanguage();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    toast.success('Thank you for subscribing to Dhansiri Agro harvest reports & market updates.');
    setNewsletterEmail('');
  };

  const phone = settings?.phoneWholesale || settings?.phonePrimary || '+880 1711-000000';
  const email = settings?.email || 'trade@dhansiriagro.com';
  const headOffice = settings?.headOfficeAddress || 'Plot 45, Tejgaon Commercial Area, Dhaka-1208, Bangladesh';
  const mill = settings?.millAddress || 'Dhansiri Mill Complex, Pulhat Industrial Estate, Dinajpur-5200';

  return (
    <footer className="border-t pt-16 pb-10 bg-slate-50/80 text-slate-700 border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Editorial Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-200">
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                <Sprout className="w-5 h-5 text-amber-300" />
              </div>
              <span className="font-serif-display text-2xl font-bold tracking-tight text-emerald-950">
                DHANSIRI AGRO INDUSTRIES
              </span>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed max-w-lg text-slate-600">
              {language === 'bn' 
                ? 'বাংলাদেশের প্রধান কৃষি অঞ্চল থেকে সরাসরি কৃষক-যাচাইকৃত ফলমূল, শাকসবজি, সুবাসিত চাল, হলুদ ভুট্টা এবং খাঁটি মসলা সরবরাহকারী পূর্ণাঙ্গ কৃষি বাণিজ্য প্ল্যাটফর্ম।'
                : 'A full-stack agricultural products marketplace and grain merchant platform connecting verified growers with consumers, retailers, restaurants, and institutional procurement across Bangladesh.'}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold pt-1">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg border border-emerald-200 text-emerald-800 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> BSTI Standard
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg border border-emerald-200 text-emerald-800 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Zero Chemical Ripening
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg border border-amber-200 text-amber-800 shadow-2xs">
                Laser Sortex Optical Graded
              </span>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
              <h4 className="font-serif-display text-base font-bold text-emerald-950 mb-1">
                {t('home.newsletterHeading')}
              </h4>
              <p className="text-xs mb-4 text-slate-500">
                {t('home.newsletterSub')}
              </p>
              {subscribed ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Subscribed successfully! You will receive new harvest alerts.
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter email for harvest updates..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    {t('home.newsletterBtn')} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 4 Category & Business Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-b border-slate-200 text-xs">
          {/* Column 1: Agricultural Sectors */}
          <div>
            <h5 className="font-bold uppercase tracking-wider mb-3.5 text-[11px] text-emerald-900">
              {t('allCategories')}
            </h5>
            <ul className="space-y-2 text-slate-600 font-medium">
              <li><Link to="/shop?category=fresh-fruits" className="hover:text-emerald-700 hover:underline">Rajshahi & Dinajpur Fruits</Link></li>
              <li><Link to="/shop?category=rice-products" className="hover:text-emerald-700 hover:underline">Chinigura & Table Rice</Link></li>
              <li><Link to="/shop?category=grains-cereals" className="hover:text-emerald-700 hover:underline">Hybrid Maize & Corn Sacks</Link></li>
              <li><Link to="/shop?category=vegetables" className="hover:text-emerald-700 hover:underline">Farm-Fresh Vegetables</Link></li>
              <li><Link to="/shop?category=pulses-legumes" className="hover:text-emerald-700 hover:underline">Deshi Unpolished Pulses</Link></li>
              <li><Link to="/shop?category=pure-spices" className="hover:text-emerald-700 hover:underline">Pabna Stone-Ground Spices</Link></li>
              <li><Link to="/shop?category=seeds-saplings" className="hover:text-emerald-700 hover:underline">Grafted Fruit Saplings & Seeds</Link></li>
            </ul>
          </div>

          {/* Column 2: B2B Wholesale & Supply */}
          <div>
            <h5 className="font-bold uppercase tracking-wider mb-3.5 text-[11px] text-emerald-900">
              {t('nav.wholesale')}
            </h5>
            <ul className="space-y-2 text-slate-600 font-medium">
              <li><Link to="/wholesale" className="hover:text-emerald-700 hover:underline">B2B Portal & Tier Rates</Link></li>
              <li><Link to="/quotations/request" className="hover:text-emerald-700 hover:underline">Request Wholesale Quotation</Link></li>
              <li><Link to="/how-it-works" className="hover:text-emerald-700 hover:underline">How It Works (Farm-to-Door)</Link></li>
              <li><Link to="/delivery-info" className="hover:text-emerald-700 hover:underline">Shipping & Freight Logistics</Link></li>
              <li><Link to="/distributors" className="hover:text-emerald-700 hover:underline">Regional Dealer Network</Link></li>
              <li><Link to="/farmers" className="hover:text-emerald-700 hover:underline">Farmer Partnership Application</Link></li>
            </ul>
          </div>

          {/* Column 3: Transparency & Quality */}
          <div>
            <h5 className="font-bold uppercase tracking-wider mb-3.5 text-[11px] text-emerald-900">
              Traceability & Sourcing
            </h5>
            <ul className="space-y-2 text-slate-600 font-medium">
              <li><Link to="/sourcing" className="hover:text-emerald-700 hover:underline">Farm-to-Customer Pipeline</Link></li>
              <li><Link to="/quality" className="hover:text-emerald-700 hover:underline">Moisture & Lab Inspection</Link></li>
              <li><Link to="/farmers" className="hover:text-emerald-700 hover:underline">Verified Partner Farmers</Link></li>
              <li><Link to="/seasonal" className="hover:text-emerald-700 hover:underline">Seasonal Harvest Calendar</Link></li>
              <li><Link to="/about" className="hover:text-emerald-700 hover:underline">About Dhansiri Agro</Link></li>
              <li><Link to="/blog" className="hover:text-emerald-700 hover:underline">Agronomy Insights & Blog</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Helpdesk */}
          <div>
            <h5 className="font-bold uppercase tracking-wider mb-3.5 text-[11px] text-emerald-900">
              {t('nav.contact')}
            </h5>
            <div className="space-y-2.5 text-slate-600">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="truncate">{email}</span>
              </div>
              <div className="flex items-start gap-2 pt-1 text-[11px] leading-snug">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span>{headOffice}</span>
              </div>
              <div className="pt-2">
                <Link to="/track" className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:underline">
                  → {t('nav.trackOrder')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal, Payment Badges & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} Dhansiri Agro Industries Ltd. (ধানসিঁড়ি এগ্রো). Sourcing and distributing across Bangladesh.
          </p>

          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
            <span>Verified Payments:</span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Cash on Delivery</span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-pink-600 font-bold">bKash</span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-orange-600 font-bold">Nagad</span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-purple-600 font-bold">Rocket</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link to="/terms" className="hover:underline">Terms of Trade</Link>
            <Link to="/returns" className="hover:underline">Refund Policy</Link>
            <Link to="/shipping-policy" className="hover:underline">Delivery Coverage</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
