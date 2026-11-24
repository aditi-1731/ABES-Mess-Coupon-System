import React from 'react';

export default function Skeleton({
  variant = 'text',
  width = 'w-full',
  height = 'h-4',
  className = ''
}) {
  const variants = {
    text: 'rounded-md',
    circle: 'rounded-full',
    card: 'rounded-2xl',
    button: 'rounded-xl'
  };

  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${variants[variant]} ${width} ${height} ${className}`}
    />
  );
}
