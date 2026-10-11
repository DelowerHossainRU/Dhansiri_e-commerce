import React, { useState, useEffect } from 'react';
import { Sprout, MapPin, CheckCircle2, ShieldCheck, ArrowRight, Send, Users, Award } from 'lucide-react';
import client from '../../api/client';
import { toast } from 'sonner';
import { useLanguage } from '../../context/LanguageContext';

export const FarmerNetworkPage = () => {
  const { t, language } = useLanguage();
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Application Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Rajshahi');
  const [upazila, setUpazila] = useState('');
  const [farmName, setFarmName] = useState('');
  const [crops, setCrops] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setLoading(true);
        const res = await client.get('/farmers?limit=20');
        const list = res?.data || (Array.isArray(res) ? res : []);
        setFarmers(Array.isArray(list) ? list : (list.data || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmers();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await client.post('/farmers/apply', {
        name,
        phone,
        district,
        upazila,
        farmName,
        primaryCrops: crops.split(',').map(c => c.trim()).filter(Boolean),
        farmSizeAcres: Number(farmSize) || 5,
        notes
      });
      toast.success('Your partnership application was received! Our regional procurement officer will visit your farm.');
      setName('');
      setPhone('');
      setUpazila('');
      setFarmName('');
      setCrops('');
      setFarmSize('');
      setNotes('');
    } catch (err) {
      toast.error('Failed to submit application. Please check details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white p-8 sm:p-14 mb-16 shadow-xl relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80')" }}
        />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-white/10 text-amber-300 border border-white/15">
            <Users className="w-3.5 h-3.5" />
            <span>Grower Cooperative &amp; Producer Network</span>
          </div>
          <h1 className="font-serif-display text-3xl sm:text-5xl font-black leading-tight">
            {language === 'bn' ? 'আমাদের কৃষক ও কৃষি পার্টনার নেটওয়ার্ক' : 'Partner Farmers & Producer Network'}
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-light">
            We work directly with over 150 verified farming families across Bangladesh. Through guaranteed fair pricing, contract agronomy guidance, and immediate post-harvest payment, we build a resilient, sustainable agricultural supply chain.
          </p>
        </div>
      </div>

      {/* Verified Farmer Profiles Grid */}
      <div className="mb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
            Verified Sourcing Partners
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-black text-slate-900">
            Meet the Stewards of Our Land
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Growers behind our authentic Dinajpur litchis, Rajshahi mangoes, Bogura corn, and Kushtia pulses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {farmers.map((farmer) => (
            <div
              key={farmer._id}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-700 to-green-800 text-white font-serif font-black text-xl flex items-center justify-center shrink-0 shadow-sm">
                    {farmer.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 leading-tight">
                      {language === 'bn' && farmer.banglaName ? farmer.banglaName : farmer.name}
                    </h3>
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" /> {farmer.district}, {farmer.upazila}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">{farmer.farmName}</span>
                    <span className="text-slate-500 text-[11px]">{farmer.farmLocation || `${farmer.upazila}, ${farmer.district}`}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {farmer.primaryCrops?.map((crop, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold text-[10px]">
                        {crop}
                      </span>
                    ))}
                  </div>

                  <p className="text-slate-600 line-clamp-3 leading-relaxed pt-2 font-light">
                    {farmer.bio || 'Adhering to natural agricultural cultivation standards, moisture control, and chemical-free ripening.'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">{farmer.farmSizeAcres} Acres</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                  Verified Grower
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Farmer Application Form Section */}
      <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8 sm:p-12 max-w-4xl mx-auto shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mx-auto mb-3">
            <Sprout className="w-6 h-6 text-amber-300" />
          </div>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-black text-slate-900">
            Join the Dhansiri Grower Network
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Are you an orchardist, grain producer, or vegetable farmer in Bangladesh? Partner with Dhansiri Agro for guaranteed market access, fair pricing, and scheduled procurement.
          </p>
        </div>

        <form onSubmit={handleApply} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Md. Shahidul Islam"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mobile Phone Number *</label>
              <input
                type="text"
                required
                placeholder="+880 17..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">District *</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Rajshahi">Rajshahi</option>
                <option value="Dinajpur">Dinajpur</option>
                <option value="Bogura">Bogura</option>
                <option value="Kushtia">Kushtia</option>
                <option value="Pabna">Pabna</option>
                <option value="Narsingdi">Narsingdi</option>
                <option value="Rangpur">Rangpur</option>
                <option value="Barishal">Barishal</option>
                <option value="Other">Other District</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Upazila / Thana *</label>
              <input
                type="text"
                required
                placeholder="e.g. Charghat / Sadar"
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Farm / Orchard Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Padma Riverside Orchard"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Farm Size (Acres) *</label>
              <input
                type="number"
                required
                placeholder="e.g. 10"
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Primary Crops (comma separated) *</label>
            <input
              type="text"
              required
              placeholder="e.g. Himsagar Mango, Yellow Corn, Chinigura Paddy, Potatoes"
              value={crops}
              onChange={(e) => setCrops(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Additional Farm Details &amp; Harvest Schedule</label>
            <textarea
              rows="3"
              placeholder="Tell us about your expected harvest volume, cultivation methods, or irrigation..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Submitting Application...' : 'Submit Farmer Partnership Application'}</span>
          </button>
        </form>
      </div>

    </div>
  );
};
