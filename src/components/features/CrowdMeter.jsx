import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Users, Clock, Sparkles } from 'lucide-react';

export default function CrowdMeter({ className = '' }) {
  // Real-time simulated crowd calculation based on time of day
  const [crowdData, setCrowdData] = useState({
    level: 'Medium',
    percentage: 54,
    waitTimeMinutes: 4,
    bestSlot: '13:30 - 14:00',
    activeDiners: 142
  });

  useEffect(() => {
    const updateCrowd = () => {
      const now = new Date();
      const hour = now.getHours();
      const min = now.getMinutes();

      // Peak lunch: 12:45 to 13:45
      if ((hour === 13 && min <= 45) || (hour === 12 && min >= 45)) {
        setCrowdData({
          level: 'High',
          percentage: 84,
          waitTimeMinutes: 9,
          bestSlot: '14:00 - 14:30',
          activeDiners: 285
        });
      } else if ((hour >= 12 && hour <= 14) || (hour >= 19 && hour <= 21)) {
        setCrowdData({
          level: 'Medium',
          percentage: 48,
          waitTimeMinutes: 3,
          bestSlot: '13:45 - 14:15',
          activeDiners: 130
        });
      } else {
        setCrowdData({
          level: 'Low',
          percentage: 18,
          waitTimeMinutes: 1,
          bestSlot: 'Right Now',
          activeDiners: 35
        });
      }
    };

    updateCrowd();
    const interval = setInterval(updateCrowd, 30000);
    return () => clearInterval(interval);
  }, []);

  const levelStyles = {
    Low: {
      badge: 'success',
      bar: 'bg-emerald-500',
      text: 'text-emerald-600 dark:text-emerald-400'
    },
    Medium: {
      badge: 'warning',
      bar: 'bg-amber-500',
      text: 'text-amber-600 dark:text-amber-400'
    },
    High: {
      badge: 'danger',
      bar: 'bg-red-500',
      text: 'text-red-600 dark:text-red-400'
    }
  };

  const style = levelStyles[crowdData.level] || levelStyles.Medium;

  return (
    <Card className={`p-5 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-soft/80 dark:bg-orange/20 text-orange">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold font-heading text-navy dark:text-white">
              Mess Crowd Meter
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Live counter occupancy
            </p>
          </div>
        </div>

        <Badge variant={style.badge} dot size="md">
          {crowdData.level} Rush
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1 mb-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Capacity Filled</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{crowdData.percentage}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
            style={{ width: `${crowdData.percentage}%` }}
          />
        </div>
      </div>

      {/* Insight Stats Grid */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-dark-border text-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <div>
            <span className="text-[10px] text-slate-400 block">Estimated Wait</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              ~{crowdData.waitTimeMinutes} mins
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange" />
          <div>
            <span className="text-[10px] text-slate-400 block">Best Time to Go</span>
            <span className="font-semibold text-orange">
              {crowdData.bestSlot}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
