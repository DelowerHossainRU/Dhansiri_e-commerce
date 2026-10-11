import React from 'react';
import clsx from 'clsx';

export const Input = React.forwardRef(({
  label,
  error,
  helperText,
  className = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className="w-full text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs uppercase tracking-wider font-semibold text-[#4A4744] mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={clsx(
          'w-full px-3.5 py-2.5 bg-white border text-sm text-slate-900 placeholder-[#9CA3AF] rounded-sm transition-all duration-200 outline-none',
          'focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700',
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-[#E2DDD3]',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-[#71717A]">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';
