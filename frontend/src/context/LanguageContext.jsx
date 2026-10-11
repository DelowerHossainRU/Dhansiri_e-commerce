import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../localization/translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('dhansiri_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('dhansiri_lang', lang);
    } catch (e) {
      console.warn('Could not persist language preference:', e);
    }
  };

  // Helper to translate dot-separated key, fallback to en, fallback to key
  const t = (path) => {
    if (!path) return '';
    const keys = path.split('.');
    let current = translations[language];
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English
        let fallback = translations['en'];
        for (const fbKey of keys) {
          if (fallback && fallback[fbKey] !== undefined) {
            fallback = fallback[fbKey];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return current;
  };

  // Format currency with BDT symbol and optional localized unit
  const formatPrice = (amount) => {
    if (amount === undefined || amount === null) return '৳ 0';
    const num = Number(amount).toLocaleString('en-IN');
    return `৳ ${num}`;
  };

  // Translate agricultural unit name
  const translateUnit = (unit) => {
    if (!unit) return '';
    const u = unit.toLowerCase();
    if (language === 'bn') {
      const map = {
        'kg': 'কেজি',
        'g': 'গ্রাম',
        'crate': 'ক্যারেট',
        'sack': 'বস্তা',
        'box': 'বক্স',
        'piece': 'পিস',
        'pcs': 'পিস',
        'metric ton': 'মেট্রিক টন',
        'ton': 'টন',
        'dozen': 'ডজন',
        'bundle': 'বান্ডিল',
        'bag': 'ব্যাগ'
      };
      return map[u] || unit;
    }
    return unit;
  };

  const contextValue = {
    language,
    setLanguage,
    t,
    formatPrice,
    formatPriceBDT: formatPrice,
    translateUnit
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback to avoid hard crashes if called before mount or outside provider
    const fallbackT = (path) => {
      if (!path) return '';
      const keys = path.split('.');
      let current = translations['en'];
      for (const key of keys) {
        if (current && current[key] !== undefined) {
          current = current[key];
        } else {
          return path;
        }
      }
      return current || path;
    };

    const fallbackFormatPrice = (amount) => {
      if (amount === undefined || amount === null) return '৳ 0';
      return `৳ ${Number(amount).toLocaleString('en-IN')}`;
    };

    return {
      language: 'en',
      setLanguage: () => {},
      t: fallbackT,
      formatPrice: fallbackFormatPrice,
      formatPriceBDT: fallbackFormatPrice,
      translateUnit: (unit) => unit || ''
    };
  }
  return context;
};
