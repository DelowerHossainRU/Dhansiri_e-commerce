import React from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

export const Select = React.forwardRef(({
  label,
  options = [],
  error,
  helperText,
  className = '',
  id,
  children,
  ...props
}, ref) => {
  const selectId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className="w-full text-left">
      {label && (
        <label htmlFor={selectId} className="block text-xs uppercase tracking-wider font-semibold text-[#4A4744] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            'w-full appearance-none px-3.5 py-2.5 bg-white border text-sm text-slate-900 rounded-sm transition-all duration-200 outline-none pr-9',
            'focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700',
            error ? 'border-red-500' : 'border-[#E2DDD3]',
            className
          )}
          {...props}
        >
          {children || options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-[#71717A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-[#71717A]">{helperText}</p>}
    </div>
  );
});

Select.displayName = 'Select';
