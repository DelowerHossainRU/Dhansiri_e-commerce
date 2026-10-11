import React from 'react';
import clsx from 'clsx';

export const Skeleton = ({ className = '', rounded = 'rounded-sm' }) => {
  return (
    <div
      className={clsx(
        'animate-pulse bg-[#EFE9DF] opacity-80',
        rounded,
        className
      )}
    />
  );
};
