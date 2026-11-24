import React from 'react';

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  className = '',
  pill = false
}) {
  return (
    <div
      className={`flex space-x-1 overflow-x-auto no-scrollbar ${
        pill
          ? 'bg-slate-100 dark:bg-dark-card p-1 rounded-xl border border-slate-200/80 dark:border-dark-border'
          : 'border-b border-slate-200 dark:border-dark-border'
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`
              whitespace-nowrap px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 select-none
              ${
                pill
                  ? isActive
                    ? 'bg-white dark:bg-navy-light text-navy dark:text-white shadow-sm rounded-lg font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 rounded-lg'
                  : isActive
                  ? 'border-b-2 border-orange text-orange font-semibold -mb-px'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }
            `}
          >
            {tab.icon && <tab.icon className="w-4 h-4" />}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`ml-1.5 px-2 py-0.5 text-xs rounded-full ${
                  isActive
                    ? 'bg-orange-soft text-orange dark:bg-orange/30'
                    : 'bg-slate-200 dark:bg-dark-border text-slate-600 dark:text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
