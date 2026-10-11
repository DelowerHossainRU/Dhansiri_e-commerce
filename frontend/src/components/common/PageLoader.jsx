import React from 'react';
import { Loader2 } from 'lucide-react';

export const PageLoader = ({ message = 'Loading Dhansiri Agro...' }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-100 border-t-emerald-700 animate-spin" />
        <span className="absolute text-xs font-serif font-bold text-emerald-800">ধান</span>
      </div>
      <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">
        {message}
      </p>
    </div>
  );
};

export default PageLoader;
