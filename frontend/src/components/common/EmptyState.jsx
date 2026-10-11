import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'There are currently no records available in this section.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-12 bg-white/70 border border-dashed border-slate-200 rounded-sm my-6 ${className}`}>
      <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h3 className="font-serif-display text-lg font-semibold text-slate-900 mb-1">
        {title}
      </h3>
      <p className="text-sm text-[#71717A] max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
