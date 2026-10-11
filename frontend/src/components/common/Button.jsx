import React from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  onClick,
  style = {},
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none shadow-xs';

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-xs gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-xs gap-2',
    lg: 'text-base px-6 py-3.5 rounded-xs gap-2.5 tracking-wide font-semibold',
    icon: 'p-2 rounded-xs'
  };

  // Dynamic theme-aware styles
  let variantStyles = '';
  let inlineStyles = { ...style };

  switch (variant) {
    case 'primary':
      variantStyles = 'text-white hover:opacity-90';
      inlineStyles.backgroundColor = inlineStyles.backgroundColor || 'var(--brand-primary)';
      break;
    case 'gold':
    case 'accent':
      variantStyles = 'text-white hover:opacity-90';
      inlineStyles.backgroundColor = inlineStyles.backgroundColor || 'var(--brand-accent)';
      break;
    case 'secondary':
      variantStyles = 'hover:opacity-90 border';
      inlineStyles.backgroundColor = inlineStyles.backgroundColor || 'var(--brand-subtle)';
      inlineStyles.color = inlineStyles.color || 'var(--brand-text)';
      inlineStyles.borderColor = inlineStyles.borderColor || 'var(--brand-border)';
      break;
    case 'outline':
      variantStyles = 'border bg-transparent hover:opacity-80';
      inlineStyles.borderColor = inlineStyles.borderColor || 'var(--brand-primary)';
      inlineStyles.color = inlineStyles.color || 'var(--brand-primary)';
      break;
    case 'ghost':
      variantStyles = 'bg-transparent hover:bg-black/5';
      inlineStyles.color = inlineStyles.color || 'var(--brand-text)';
      break;
    case 'danger':
      variantStyles = 'bg-rose-600 text-white hover:bg-rose-700';
      break;
    default:
      variantStyles = 'text-white hover:opacity-90';
      inlineStyles.backgroundColor = inlineStyles.backgroundColor || 'var(--brand-primary)';
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(baseStyles, sizes[size], variantStyles, className)}
      style={inlineStyles}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
};
