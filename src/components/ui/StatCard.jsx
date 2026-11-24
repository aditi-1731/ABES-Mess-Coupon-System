import React, { useEffect, useState } from 'react';
import Card from './Card';

export default function StatCard({
  title,
  value,
  prefix = '',
  suffix = '',
  subtitle,
  icon: Icon,
  iconColor = 'text-orange',
  iconBg = 'bg-orange-soft dark:bg-orange/20',
  trend,
  trendType = 'up',
  className = ''
}) {
  const [displayValue, setDisplayValue] = useState(0);

  // Animated counter effect if value is numeric
  useEffect(() => {
    if (typeof value === 'number') {
      let start = 0;
      const end = value;
      const duration = 600;
      const stepTime = 20;
      const steps = Math.ceil(duration / stepTime);
      const increment = (end - start) / steps;

      const timer = setInterval(() => {
        start += increment;
        if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
          setDisplayValue(end);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, stepTime);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  return (
    <Card hoverLift className={`p-5 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-1 mt-1">
            {prefix && <span className="text-lg font-bold text-slate-600 dark:text-slate-300">{prefix}</span>}
            <h3 className="text-2xl font-bold font-heading text-navy dark:text-white">
              {typeof value === 'number' ? displayValue.toLocaleString('en-IN') : value}
            </h3>
            {suffix && <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{suffix}</span>}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-xs font-semibold">
              <span className={trendType === 'up' ? 'text-success' : 'text-danger'}>
                {trendType === 'up' ? '↑' : '↓'} {trend}
              </span>
              <span className="text-slate-400 font-normal">vs last week</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
}
