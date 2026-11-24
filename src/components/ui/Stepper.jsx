import React from 'react';
import { Check } from 'lucide-react';

export default function Stepper({ steps, currentStep, className = '' }) {
  return (
    <div className={`flex items-center justify-between w-full ${className}`}>
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;

        return (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-200 ${
                  isCompleted
                    ? 'bg-success text-white'
                    : isCurrent
                    ? 'bg-orange text-white ring-4 ring-orange/20 shadow-md'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  isCurrent
                    ? 'text-orange font-semibold'
                    : isCompleted
                    ? 'text-slate-800 dark:text-slate-200'
                    : 'text-slate-400'
                }`}
              >
                {step}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-3 transition-colors duration-200 ${
                  idx < currentStep ? 'bg-success' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
