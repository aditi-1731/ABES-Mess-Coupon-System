import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 select-none';

  const variants = {
    primary: 'bg-orange hover:bg-orange-hover text-white shadow-md shadow-orange/20 focus:ring-orange/50',
    secondary: 'bg-navy dark:bg-navy-light text-white hover:bg-navy-light dark:hover:bg-navy shadow-md shadow-navy/20 focus:ring-navy/50',
    outline: 'border border-slate-300 dark:border-dark-border text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-card focus:ring-slate-300',
    ghost: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-card focus:ring-slate-200',
    danger: 'bg-danger text-white hover:bg-red-700 shadow-md shadow-danger/20 focus:ring-danger/50',
    success: 'bg-success text-white hover:bg-green-700 shadow-md shadow-success/20 focus:ring-success/50',
    soft: 'bg-orange-soft dark:bg-orange/20 text-orange dark:text-orange-soft hover:bg-orange-soft/80 focus:ring-orange/30'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon && iconPosition === 'left' ? (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      ) : null}

      {children}

      {!loading && Icon && iconPosition === 'right' ? (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      ) : null}
    </button>
  );
}
