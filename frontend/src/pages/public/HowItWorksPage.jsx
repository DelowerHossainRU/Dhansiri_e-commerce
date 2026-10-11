import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, Microscope, Warehouse, ShoppingCart, Truck, ShieldCheck, 
  ArrowRight, Users, CheckCircle2, ChevronRight, Scale, Leaf, HeartHandshake
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/common/Button';

export const HowItWorksPage = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const coreWorkflowSteps = [
    {
      step: '01',
      icon: Sprout,
      titleEn: 'Farmer Partnership & Sustainable Cultivation',
      titleBn: 'কৃষক অংশীদারিত্ব ও টেকসই ফসল উৎপাদন',
      descEn: 'We partner directly with over 150 verified farming families across Dinajpur, Rajshahi, and Bogura. No exploitative intermediaries; fair prices paid directly to growers.',
      descBn: 'আমরা দিনাজপুর, রাজশাহী ও বগুড়ার ১৫০+ পরীক্ষিত কৃষক পরিবারের সাথে সরাসরি কাজ করি। কোনো মধ্যস্বত্বভোগী নেই; কৃষকদের সর্বোচ্চ ন্যায্যমূল্য সরাসরি পরিশোধ।'
    },
    {
      step: '02',
      icon: Microscope,
      titleEn: 'Batch Testing & Sortex Optical Grading',
      titleBn: 'ল্যাব আর্দ্রতা পরীক্ষা ও সর্টেক্স গ্রেডিং',
      descEn: 'Every harvest lot undergoes stringent moisture checking (<=12.5% for grains), Brix sugar testing for fruits, and zero-carbide residue screening.',
      descBn: 'প্রতিটি লট ল্যাবে আর্দ্রতা পরিমাপ (সর্বোচ্চ ১২.৫%), ফলের ব্রিক্স মিষ্টতা পরীক্ষা এবং শতভাগ কার্বাইড ও রাসায়নিকমুক্ত মান নিশ্চিত করা হয়।'
    },
    {
      step: '03',
      icon: Warehouse,
      titleEn: 'Aerated Silo & Cold Hub Storage',
      titleBn: 'আধুনিক অ্যারিয়েটেড সাইলো ও কোল্ড হাব',
      descEn: 'Processed commodities are stored in climate-monitored facilities in Dinajpur and Tejgaon with nitrogen flushing to maintain peak botanical freshness.',
      descBn: 'দিনাজপুর অটো সাইলো এবং তেজগাঁও কোল্ড হাবে তাপমাত্রা ও আর্দ্রতা নিয়ন্ত্রিত পরিবেশে শস্যের প্রাকৃতিক সুবাস ও পুষ্টিমান সংরক্ষিত থাকে।'
    },
    {
      step: '04',
      icon: ShoppingCart,
      titleEn: 'Smart Omnichannel Dispatch & Booking',
      titleBn: 'সহজ অনলাইন অর্ডার ও প্রি-অর্ডার বুকিং',
      descEn: 'Retail shoppers order convenient 1kg-5kg consumer packs, seasonal fruit lovers reserve limited tree harvests, and B2B buyers submit volume RFQs.',
      descBn: 'সাধারণ ক্রেতারা ১-৫ কেজির পারিবারিক প্যাক অর্ডার করেন, মৌসুমি ফলের গ্রাহকরা অগ্রিম বুকিং দেন এবং কর্পোরেট ক্রেতারা বাল্ক চালান সংগ্রহ করেন।'
    },
    {
      step: '05',
      icon: Truck,
      titleEn: 'Sealed Transport & Doorstep Fulfillment',
      titleBn: 'সিলমোহরকৃত ডেলিভারি ও দ্রুত হোম ডেলিভারি',
      descEn: 'Packed in eco-friendly food-grade jute sacks and cushioned ventilated fruit crates, delivered straight to your door with live tracking.',
      descBn: 'ফুড-গ্রেড পাটের বস্তা ও কুশনযুক্ত ফলের ক্যারেটে সুরক্ষিতভাবে প্যাক করে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে পৌঁছে দেওয়া হয় আপনার দরজায়।'
    }
  ];

  const consumerSteps = [
    {
      num: '১',
      titleEn: 'Browse Pure Agricultural Produce',
      titleBn: 'পণ্য ও জাত নির্বাচন করুন',
      descEn: 'Explore authentic Miniket, Chinigura rice, Rajshahi mangoes, organic lentils, and whole spices with full origin traceability.'
    },
    {
      num: '২',
      titleEn: 'Select Pack Size & Unit Weight',
      titleBn: 'প্যাকেট বা পরিমাণের সাইজ পছন্দ করুন',
      descEn: 'Choose from 1kg sample, 5kg standard household pack, 25kg monthly sack, or 20kg seasonal fruit crate.'
    },
    {
      num: '৩',
      titleEn: 'Checkout with Cash or Digital Wallet',
      titleBn: 'ক্যাশ অন ডেলিভারি বা অনলাইনে পরিশোধ করুন',
      descEn: 'Pay effortlessly with Cash on Delivery (COD), bKash, Nagad, Rocket, or Visa/MasterCard.'
    },
    {
      num: '৪',
      titleEn: 'Fresh Arrival & Satisfaction Guarantee',
      titleBn: 'বাসায় ডেলিভারি ও শতভাগ খাঁটি স্বাদ',
      descEn: 'Enjoy pure, unadulterated food on your dining table. If not 100% satisfied, our no-questions-asked refund policy protects you.'
    }
  ];

  const wholesaleSteps = [
    {
      num: '1',
      titleEn: 'Submit Digital RFQ or Open Account',
      titleBn: 'কোটেশন প্রস্তাব পাঠান বা অ্যাকাউন্ট খুলুন',
      descEn: 'Specify target tons, delivery depot, and preferred payment schedule (LC, Net 15, CAD) via our B2B trade portal.'
    },
    {
      num: '2',
      titleEn: 'Receive Formal Price Dossier in 2 Hours',
      titleBn: '২ ঘণ্টার মধ্যে আনুষ্ঠানিক দরপত্র গ্রহণ',
      descEn: 'Our commercial agribusiness desk prepares a binding quotation including freight, bag branding, and Sortex laboratory parameters.'
    },
    {
      num: '3',
      titleEn: 'Dedicated Truckload Dispatch',
      titleBn: 'কাভার্ড ট্রাকে সরাসরি গোডাউনে ডেলিভারি',
      descEn: '5-20 metric ton trucks loaded at our automated silos with official weighbridge slips and government VAT (Mushak 6.3) invoices.'
    }
  ];

  return (
    <div className="bg-[#FAF8F5] min-w-0 py-8 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <Link to="/" className="hover:text-emerald-800">{isBn ? 'হোম' : 'Home'}</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{isBn ? 'কীভাবে কাজ করে' : 'How It Works'}</span>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {isBn ? 'স্বচ্ছ কৃষি সাপ্লাই চেইন' : 'Transparent Agribusiness Ecosystem'}
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mt-4 mb-3">
            {isBn ? 'মাঠ থেকে খাবারের থালা: ধানসিঁড়ির যাত্রা' : 'From Bangladesh Soil to Your Dining Table'}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {isBn
              ? 'আমরা কীভাবে সরাসরি কৃষক থেকে সেরা ফসল সংগ্রহ করি, আধুনিক প্রযুক্তিতে গুণগত মান যাচাই করি এবং সর্বোচ্চ সতেজতায় আপনার কাছে পৌঁছে দিই।'
              : 'Discover how Dhansiri Agro bridges genuine rural growers with modern automated processing, rigorous quality testing, and ethical distribution.'
            }
          </p>
        </div>

        {/* 5-Step Visual Timeline */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-slate-900">
              {isBn ? 'ধানসিঁড়ির ৫-ধাপের গুণমান ও বিতরণ পদ্ধতি' : 'The 5-Stage Farm-to-Fork Process'}
            </h2>
          </div>

          <div className="space-y-6">
            {coreWorkflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs hover:shadow-sm transition-all flex flex-col md:flex-row items-start md:items-center gap-6"
                >
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-serif-display text-3xl font-bold text-emerald-800/40 w-12 text-center">
                      {step.step}
                    </span>
                    <div className="w-14 h-14 rounded-2xl bg-[#F0F7F2] text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                      <Icon className="w-7 h-7" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif-display text-lg sm:text-xl font-bold text-slate-900 mb-1">
                      {isBn ? step.titleBn : step.titleEn}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {isBn ? step.descBn : step.descEn}
                    </p>
                  </div>

                  <div className="hidden lg:flex items-center text-emerald-700 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dual Paths: Retail vs Wholesale */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Retail Path */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-7 sm:p-9 shadow-2xs flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                  {isBn ? 'খুচরা গ্রাহকদের জন্য' : 'For Retail Consumers & Families'}
                </span>
              </div>
              <h3 className="font-serif-display text-2xl font-bold text-slate-900 mb-2">
                {isBn ? 'দৈনন্দিন পারিবারিক বাজার' : 'Everyday Pure Food Shopping'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6">
                {isBn
                  ? 'আপনার পরিবারের স্বাস্থ্য সুরক্ষায় শতভাগ খাঁটি চাল, ডাল, মৌসুমি ফল ও মসলা সহজে অর্ডার করুন।'
                  : 'Order unpolished wholesome rice, organic lentils, and fresh fruits directly to your home with transparent origins.'
                }
              </p>

              <div className="space-y-4">
                {consumerSteps.map((s, i) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center shrink-0 border border-emerald-200">
                      {i + 1}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 block">{isBn ? s.titleBn : s.titleEn}</span>
                      <span className="text-slate-600 text-[11px]">{isBn ? s.descBn : s.descEn}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link to="/shop" className="pt-4">
              <Button variant="primary" size="md" className="w-full">
                {isBn ? 'শপ থেকে কেনাকাটা শুরু করুন' : 'Explore Agricultural Store'}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>

          {/* Wholesale Path */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-7 sm:p-9 shadow-2xs flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                  {isBn ? 'বাণিজ্যিক ও পাইকারি ক্রেতাদের জন্য' : 'For Commercial & Wholesale Buyers'}
                </span>
              </div>
              <h3 className="font-serif-display text-2xl font-bold text-slate-900 mb-2">
                {isBn ? 'বাল্ক প্রাতিষ্ঠানিক সংগ্রহ' : 'Industrial & B2B Grain Supply'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6">
                {isBn
                  ? 'সুপারমার্কেট চেইন, রেস্তোরাঁ ও ফিড মিলের জন্য ট্রাকলোড সরবরাহ ও কাস্টম প্যাকেজিং সুবিধা।'
                  : 'Procure 5-100 metric ton grain lots with contract farming options, VAT invoices, and dedicated dispatch.'
                }
              </p>

              <div className="space-y-4">
                {wholesaleSteps.map((s, i) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-900 font-bold flex items-center justify-center shrink-0 border border-amber-200">
                      {i + 1}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 block">{isBn ? s.titleBn : s.titleEn}</span>
                      <span className="text-slate-600 text-[11px]">{isBn ? s.descBn : s.descEn}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link to="/quotations/request" className="pt-4">
              <Button variant="outline" size="md" className="w-full border-slate-300 hover:bg-slate-50 font-bold text-slate-900">
                {isBn ? 'বাল্ক কোটেশন ফর্ম পূরণ করুন' : 'Submit Commercial RFQ Proposal'}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Farmer Partnership Invitation Banner */}
        <div className="bg-[#163020] text-white rounded-3xl p-8 sm:p-12 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              {isBn ? 'কৃষক অংশীদারিত্ব' : 'Join as a Partner Farmer'}
            </span>
            <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold">
              {isBn ? 'আপনি কি মানসম্পন্ন ফসল উৎপাদন করেন?' : 'Are you a progressive grower in Bangladesh?'}
            </h2>
            <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed">
              {isBn
                ? 'ধানসিঁড়ি অ্যাগ্রোর সাথে যুক্ত হয়ে পান সরাসরি ন্যায্যমূল্য, ডিজিটাল ওজন সুবিধা এবং দ্রুত পেমেন্ট পরিশোধ। কোনো মধ্যস্বত্বভোগী নেই।'
                : 'Partner with Dhansiri Agro for guaranteed off-take contracts, transparent weighbridge measurements, and timely bKash/bank settlements.'
              }
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <Link to="/farmers">
                <Button variant="primary" size="md" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs">
                  {isBn ? 'কৃষক নেটওয়ার্কে যুক্ত হোন' : 'Apply to Join Farmer Network'}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link to="/quality">
                <Button variant="outline" size="md" className="border-white/30 text-white hover:bg-white/10 text-xs font-semibold">
                  {isBn ? 'আমাদের গুণমান মানদণ্ড দেখুন' : 'View Quality Inspection Standards'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
