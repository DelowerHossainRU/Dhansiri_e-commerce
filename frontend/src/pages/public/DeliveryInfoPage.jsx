import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, Clock, ShieldCheck, MapPin, Package, AlertCircle, 
  ThermometerSnowflake, CheckCircle2, ArrowRight, PhoneCall 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/common/Button';

export const DeliveryInfoPage = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const deliveryZones = [
    {
      titleEn: 'Dhaka Metropolitan (Inside City)',
      titleBn: 'ঢাকা মেট্রোপলিটন (সিটির ভেতরে)',
      areasEn: 'Uttara, Gulshan, Banani, Dhanmondi, Mirpur, Motijheel, Old Dhaka, Mohammadpur',
      areasBn: 'উত্তরা, গুলশান, বনানী, ধানমন্ডি, মিরপুর, মতিঝিল, পুরান ঢাকা, মোহাম্মদপুর',
      timeEn: '24 Hours (Next Day Guaranteed)',
      timeBn: '২৪ ঘণ্টা (পরবর্তী কার্যদিবস নিশ্চিত)',
      costEn: '৳ 60 Base (Up to 3kg) + ৳ 15 / extra kg',
      costBn: '৳ ৬০ বেস (৩ কেজি পর্যন্ত) + ৳ ১৫ / অতিরিক্ত কেজি',
      featuresEn: ['Doorstep Delivery', 'Cash on Delivery (COD) Available', 'Cold-chain morning slot for fruits'],
      featuresBn: ['হোম ডেলিভারি', 'ক্যাশ অন ডেলিভারি (COD) প্রযোজ্য', 'সকালে তাজা ফলের বিশেষ কোল্ড স্লট']
    },
    {
      titleEn: 'Dhaka Suburbs & Greater Dhaka',
      titleBn: 'ঢাকা উপশহর ও বৃহত্তর ঢাকা',
      areasEn: 'Savar, Gazipur, Narayanganj, Keraniganj, Tongi, Ashulia',
      areasBn: 'সাভার, গাজীপুর, নারায়ণগঞ্জ, কেরানীগঞ্জ, টঙ্গী, আশুলিয়া',
      timeEn: '24 - 48 Hours',
      timeBn: '২৪ - ৪৮ ঘণ্টা',
      costEn: '৳ 100 Base (Up to 3kg) + ৳ 20 / extra kg',
      costBn: '৳ ১০০ বেস (৩ কেজি পর্যন্ত) + ৳ ২০ / অতিরিক্ত কেজি',
      featuresEn: ['Direct Van Delivery', 'Doorstep or Local Hub', 'bKash / Nagad / COD'],
      featuresBn: ['সরাসরি ভ্যান সার্ভিস', 'হোম অথবা লোকাল হাব ডেলিভারি', 'বিকাশ / নগদ / সিওডি']
    },
    {
      titleEn: 'Northern Terroir Origin Hubs',
      titleBn: 'উত্তরবঙ্গ ফার্ম সোর্সিং অঞ্চল',
      areasEn: 'Dinajpur, Rajshahi, Bogura, Rangpur, Natore, Pabna, Kushtia',
      areasBn: 'দিনাজপুর, রাজশাহী, বগুড়া, রংপুর, নাটোর, পাবনা, কুষ্টিয়া',
      timeEn: 'Same Day to 24 Hours',
      timeBn: 'একই দিন থেকে ২৪ ঘণ্টা',
      costEn: '৳ 70 Base (Direct Silo / Farm Dispatch)',
      costBn: '৳ ৭০ বেস (সরাসরি সাইলো ও বাগান থেকে)',
      featuresEn: ['Farm-gate Collection Available', 'Fresh Harvest Direct Load', 'Special Farm Rates'],
      featuresBn: ['বাগান বা ফার্ম থেকে সরাসরি সংগ্রহ', 'তাজা ফসল সরাসরি পরিবহন', 'বিশেষ কৃষিক্ষেত্র রেট']
    },
    {
      titleEn: 'Nationwide All 64 Districts',
      titleBn: 'সারাদেশে ৬৪টি জেলায় ডেলিভারি',
      areasEn: 'Chattogram, Sylhet, Khulna, Barishal, Mymensingh, Cox\'s Bazar & all districts',
      areasBn: 'চট্টগ্রাম, সিলেট, খুলনা, বরিশাল, ময়মনসিংহ, কক্সবাজার ও সকল জেলা',
      timeEn: '48 - 72 Hours',
      timeBn: '৪৮ - ৭২ ঘণ্টা',
      costEn: '৳ 120 Base (Up to 2kg) + ৳ 25 / extra kg',
      costBn: '৳ ১২০ বেস (২ কেজি পর্যন্ত) + ৳ ২৫ / অতিরিক্ত কেজি',
      featuresEn: ['Sundarban / Steadfast / SA Paribahan', 'SMS Tracking & Notification', 'Secure Tarp Pack'],
      featuresBn: ['সুন্দরবন / স্টিডফাস্ট / এসএ পরিবহন', 'এসএমএস ট্র্যাকিং ও আপডেট', 'জলরোধী সুরক্ষিত প্যাকিং']
    }
  ];

  const bulkFleet = [
    {
      typeEn: '3-5 Ton Medium Covered Van',
      typeBn: '৩-৫ টন মাঝারি কাভার্ড ভ্যান',
      useEn: 'Wholesale retail supermarkets, restaurants & monthly restaurant orders',
      useBn: 'সুপারমার্কেট, রেস্তোরাঁ ও মাসিক প্রাতিষ্ঠানিক সরবরাহ',
      specEn: 'Moisture-sealed interior, GPS tracked, accompanied by certified loading challan',
      specBn: 'আর্দ্রতারোধী কাভার্ড কাঠামো, জিপিএস ট্র্যাকিং, অনুমোদিত ওজন চালান সহ'
    },
    {
      typeEn: '10-20 Ton Heavy Agricultural Hauler',
      typeBn: '১০-২০ টন ভারী কৃষি পরিবহন ট্রাক',
      useEn: 'Direct silo grain transit, corn feed mill supply, export container transshipment',
      useBn: 'সাইলো খাদ্যশস্য পরিবহন, পোল্ট্রি ফিড ভুট্টা এবং রপ্তানি কনটেইনার পরিবহন',
      specEn: 'Multi-axle heavy capacity, weighing scale receipt, BSTI inspection certificate included',
      specBn: 'মাল্টি-এক্সেল ভারী ধারণক্ষমতা, ওজন স্কেল রসিদ এবং সরকারি সনদপত্র সহ'
    },
    {
      typeEn: 'Refrigerated Cold-Chain Van',
      typeBn: 'রেফ্রিজারেটেড কোল্ড-চেইন ভ্যান',
      useEn: 'Fresh Rajshahi Mangoes, Dinajpur Litchi, fresh green vegetables in summer',
      useBn: 'তাজা রাজশাহী আম, দিনাজপুর বেদানা লিচু ও গ্রীষ্মকালীন শাকসবজি সংরক্ষণ',
      specEn: 'Strict 10°C - 15°C temperature control, zero chemical freshness preservation',
      specBn: '১০°C - ১৫°C নিয়ন্ত্রিত তাপমাত্রা, রাসায়নিকমুক্ত স্বাভাবিক সতেজতা'
    }
  ];

  return (
    <div className="bg-[#FAF8F5] min-w-0 py-8 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <Link to="/" className="hover:text-emerald-800">{isBn ? 'হোম' : 'Home'}</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{isBn ? 'ডেলিভারি তথ্য ও শিপিং' : 'Delivery & Fulfillment'}</span>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {isBn ? 'কৃষি সরবরাহ ও লজিস্টিকস' : 'Agricultural Supply Chain & Logistics'}
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mt-4 mb-3">
            {isBn ? 'সরাসরি খামার থেকে আপনার ঠিকানায়' : 'Farm-to-Door Delivery & Freight Services'}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {isBn 
              ? 'আমরা প্রতিটি চালের বস্তা, ফলের ক্যারেট এবং কৃষিপণ্য আর্দ্রতামুক্ত ও খাঁটি অবস্থায় দ্রুততম সময়ে সারা বাংলাদেশে পৌঁছে দিই।'
              : 'From Dinajpur milling silos and Rajshahi orchards to urban retail kitchens and commercial processing plants across Bangladesh.'
            }
          </p>
        </div>

        {/* Delivery Zones Grid */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-emerald-800" />
            <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-slate-900">
              {isBn ? 'আঞ্চলিক ডেলিভারি জোন ও রেট' : 'Regional Delivery Zones & Rates'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deliveryZones.map((zone, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-2xs hover:shadow-sm transition-all hover:border-emerald-600/40 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif-display text-lg font-bold text-slate-900">
                      {isBn ? zone.titleBn : zone.titleEn}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {isBn ? zone.areasBn : zone.areasEn}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md shrink-0 border border-emerald-100">
                    {isBn ? zone.timeBn : zone.timeEn}
                  </span>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">{isBn ? 'স্ট্যান্ডার্ড শিপিং খরচ:' : 'Shipping Rate:'}</span>
                  <span className="font-bold text-emerald-900 font-mono">
                    {isBn ? zone.costBn : zone.costEn}
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {(isBn ? zone.featuresBn : zone.featuresEn).map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commercial Wholesale & Bulk Fleet Section */}
        <div className="mb-16 bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-2xs">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 block mb-1">
              {isBn ? 'প্রাতিষ্ঠানিক পাইকারি পরিবহন' : 'Commercial & Industrial Fleet'}
            </span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-slate-900">
              {isBn ? 'বাল্ক ও পাইকারি কাভার্ড ট্রাক সার্ভিস' : 'Bulk Agricultural Transport Solutions'}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2">
              {isBn
                ? 'সুপারমার্কেট চেইন, রেস্তোরাঁ ও ফিড মিলের জন্য ৫ টন থেকে ২০ টন পর্যন্ত নিজস্ব ও চুক্তিবদ্ধ কাভার্ড ভ্যান বহর।'
                : 'Dedicated multi-tonnage fleet for commercial buyers, institutions, and relief programs with certified weighbridge verification.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bulkFleet.map((fleet, fIdx) => (
              <div key={fIdx} className="bg-[#FAF8F5] p-5 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-emerald-800 flex items-center justify-center">
                  {fIdx === 2 ? <ThermometerSnowflake className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                </div>
                <h4 className="font-serif-display text-base font-bold text-slate-900">
                  {isBn ? fleet.typeBn : fleet.typeEn}
                </h4>
                <p className="text-xs text-slate-600">
                  {isBn ? fleet.useBn : fleet.useEn}
                </p>
                <div className="text-[11px] text-emerald-900 bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-100 font-medium">
                  {isBn ? fleet.specBn : fleet.specEn}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              <span className="font-bold text-slate-900 block">{isBn ? 'বড় অর্ডারে বিশেষ ডিসকাউন্ট প্রযোজ্য' : 'Volume-tiered shipping subsidies available'}</span>
              <span>{isBn ? '১০ টন বা তদূর্ধ্ব অর্ডারে ফ্রি সাইলো লোডিং ও স্পেশাল ফ্রেইট রেট' : 'Full truckload orders qualify for discounted gate rates'}</span>
            </div>
            <Link to="/quotations/request">
              <Button variant="primary" size="md">
                {isBn ? 'পাইকারি কোটেশন চান' : 'Request Truckload Quotation'}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Agricultural Packaging Standards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <Package className="w-6 h-6 text-emerald-800" />
            <h3 className="font-serif-display text-base font-bold text-slate-900">
              {isBn ? 'প্রিমিয়াম চট ও পাটের বস্তা' : 'Eco Food-Grade Jute Sacks'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isBn
                ? 'চিনিরগুঁড়া ও বাসমতি চালের জন্য ঐতিহ্যবাহী বাতাস চলাচলকারী পাটের বস্তা, যা সুগন্ধি ধরে রাখে।'
                : 'Natural biodegradable breathable jute sacks for aromatic and aged rice, maintaining optimal grain moisture balance.'
              }
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <ThermometerSnowflake className="w-6 h-6 text-emerald-800" />
            <h3 className="font-serif-display text-base font-bold text-slate-900">
              {isBn ? 'বাতাস চলাচলকারী ফলের ক্যারেট' : 'Ventilated Fruit Crates'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isBn
                ? 'হিমসাগর আম ও বেদানা লিচুর জন্য কুশনযুক্ত প্লাস্টিক ও কাঠের ক্যারেট যাতে কোনো ফল ক্ষতিগ্রস্ত না হয়।'
                : 'Heavy-duty food-safe vented crates with honeycomb foam separators protecting seasonal mangoes & litchis in transit.'
              }
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <ShieldCheck className="w-6 h-6 text-emerald-800" />
            <h3 className="font-serif-display text-base font-bold text-slate-900">
              {isBn ? 'সিলমোহরকৃত আর্দ্রতারোধী ব্যাগ' : 'Moisture-Barrier Poly Pouches'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isBn
                ? 'খুচরা গ্রাহকদের জন্য ১ ও ৫ কেজির তিন স্তর বিশিষ্ট ফুড-গ্রেড পাউচ, যা আর্দ্রতা ও পোকা থেকে রক্ষা করে।'
                : 'Multi-layer hermetic pouches protecting table rice, pulses, and ground spices from moisture and external odor.'
              }
            </p>
          </div>
        </div>

        {/* Live Order Tracking CTA Strip */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-[#1B3022] text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
              {isBn ? 'লাইভ পার্সেল ট্র্যাকিং' : 'Real-Time Order Tracking'}
            </span>
            <h3 className="font-serif-display text-2xl sm:text-3xl font-bold">
              {isBn ? 'আপনার অর্ডারের বর্তমান অবস্থা জানতে চান?' : 'Already placed an order? Track its journey.'}
            </h3>
            <p className="text-emerald-100/80 text-xs sm:text-sm">
              {isBn
                ? 'আপনার অর্ডার নম্বর দিয়ে চালানের বর্তমান অবস্থান, ওয়্যারহাউজ ডিসপ্যাচ ও আনুমানিক পৌঁছানোর সময় দেখুন।'
                : 'Enter your order tracking number to follow your farm harvest from the milling silo to your doorstep.'
              }
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link to="/track">
              <Button variant="outline" size="lg" className="bg-white text-emerald-950 hover:bg-emerald-50 border-white text-xs font-bold">
                {isBn ? 'অর্ডার ট্র্যাক করুন' : 'Track Order Online'}
              </Button>
            </Link>
            <a href="tel:+8801700000000">
              <Button variant="outline" size="lg" className="text-white border-white/40 hover:bg-white/10 text-xs font-bold">
                <PhoneCall className="w-4 h-4 mr-1.5" />
                {isBn ? 'লজিস্টিকস হেল্পলাইন' : 'Dispatch Hotline'}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
