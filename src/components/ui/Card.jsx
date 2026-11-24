import React from 'react';

export default function Card({
  children,
  className = '',
  hoverLift = false,
  glass = false,
  ...props
}) {
  return (
    <div
      className={`
        rounded-2xl border transition-all duration-200
        ${glass ? 'glass' : 'bg-white dark:bg-dark-card border-slate-200/80 dark:border-dark-border'}
        ${hoverLift ? 'hover:-translate-y-1 hover:shadow-soft-lg' : 'shadow-soft'}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
