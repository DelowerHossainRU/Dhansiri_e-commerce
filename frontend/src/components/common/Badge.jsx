import React from 'react';
import clsx from 'clsx';

export const Badge = ({ children, variant = 'neutral', className = '' }) => {
  const variants = {
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    gold: 'bg-[#FBF6EC] text-emerald-800 border border-[#ECD9B5]',
    forest: 'bg-[#EBF3EE] text-[#1E382B] border border-[#C5DDD0]',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-rose-50 text-rose-800 border border-rose-200',
    info: 'bg-blue-50 text-blue-800 border border-blue-200'
  };

  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium tracking-wide', variants[variant], className)}>
      {children}
    </span>
  );
};
