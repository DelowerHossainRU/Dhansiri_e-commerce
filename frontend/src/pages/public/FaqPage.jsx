import React, { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import api from '../../api/client';
import { Skeleton } from '../../components/common/Skeleton';

export const FaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/cms/faqs');
        if (res.success && res.data) {
          setFaqs(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const categories = ['All', 'Grain Quality & Moisture', 'Wholesale & B2B', 'Delivery & Coverage'];

  const filteredFaqs = selectedCategory === 'All'
    ? faqs
    : faqs.filter(f => f.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold block mb-1">
          Knowledge Base
        </span>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-slate-900 mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-[#71717A] font-light">
          Everything you need to know about our grain moisture standards, optical sortex sorting, and wholesale delivery coverage.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-xs transition-colors ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-[#71717A] hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq._id || idx}
                className="bg-white border border-slate-200 rounded-xs overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-serif-display text-sm sm:text-base font-semibold text-slate-900">
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-emerald-800 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#52525B] leading-relaxed font-light border-t border-[#F0ECE1] bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
