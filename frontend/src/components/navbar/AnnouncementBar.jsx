import React from 'react';
import { ArrowRight, Phone, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export const AnnouncementBar = ({ settings }) => {
  const { language, setLanguage } = useLanguage();
  const { activeThemeId, setTheme, themes } = useTheme();

  if (settings && settings.isAnnouncementBarActive === false) return null;

  const isBn = language === 'bn';

  return (
    <div className="bg-[#14261C] text-white/90 text-[11px] font-medium border-b border-white/10 select-none transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between gap-4">
        
        {/* Left: Gentle announcement */}
        <div className="flex items-center gap-2 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          <span className="truncate">
            {isBn 
              ? 'সরাসরি কৃষক ও বাগান থেকে তাজা ফসল সারা দেশে পৌঁছে যাচ্ছে'
              : 'Direct farm harvest dispatching nationwide across 64 districts'
            }
          </span>
          <Link
            to="/seasonal"
            className="text-emerald-300 hover:text-white font-semibold inline-flex items-center gap-0.5 ml-1 transition-colors shrink-0"
          >
            <span>{isBn ? 'মৌসুমি প্রি-অর্ডার' : 'Harvest Calendar'}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Right: Hotline, Track Order, Theme & Language */}
        <div className="flex items-center gap-3.5 shrink-0 text-white/80">
          <a
            href="tel:+8801700000000"
            className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3 text-emerald-400" />
            <span>+880 1700-000000</span>
          </a>

          <span className="hidden md:inline text-white/20">•</span>

          <Link
            to="/track"
            className="hidden sm:inline hover:text-white transition-colors"
          >
            {isBn ? 'অর্ডার ট্র্যাক' : 'Track Order'}
          </Link>

          <span className="hidden sm:inline text-white/20">•</span>

          <Link
            to="/wholesale"
            className="hidden sm:inline hover:text-emerald-300 transition-colors font-semibold"
          >
            {isBn ? 'পাইকারি B2B' : 'B2B Trade'}
          </Link>

          <span className="hidden sm:inline text-white/20">•</span>

          {/* Quick Theme Switcher */}
          <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-md border border-white/10 text-[10px]">
            <Palette className="w-3 h-3 text-emerald-300" />
            <select
              value={activeThemeId}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-transparent text-white text-[10px] font-semibold outline-none cursor-pointer border-none"
              title="Switch Visual Theme"
            >
              {themes.map((t) => (
                <option key={t.id} value={t.id} className="text-slate-900 bg-white">
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <span className="text-white/20">•</span>

          {/* Minimalist Language Switcher */}
          <div className="flex items-center gap-1 font-semibold text-[10px]">
            <button
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                language === 'en'
                  ? 'text-white bg-white/15'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              EN
            </button>
            <span className="text-white/30">/</span>
            <button
              onClick={() => setLanguage('bn')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                language === 'bn'
                  ? 'text-white bg-white/15'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              বাংলা
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
