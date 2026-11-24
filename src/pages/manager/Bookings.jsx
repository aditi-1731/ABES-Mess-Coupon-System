import React, { useState, useEffect } from 'react';
import * as mockApi from '../../services/mockApi';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { getTodayDateString, formatDate } from '../../utils/formatDate';
import { ChefHat, AlertCircle, TrendingDown, Users, Clock } from 'lucide-react';

export default function ManagerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = getTodayDateString();

  useEffect(() => {
    async function load() {
      try {
        const data = await mockApi.getBookings(null, today);
        setBookings(data);
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [today]);

  const mealsData = [
    {
      type: 'Breakfast',
      time: '07:30 - 09:30',
      booked: 320,
      skipped: 24,
      served: 296,
      slots: [
        { slot: '07:30 - 08:00', count: 75, max: 90 },
        { slot: '08:00 - 08:30', count: 88, max: 90 },
        { slot: '08:30 - 09:00', count: 90, max: 90 },
        { slot: '09:00 - 09:30', count: 67, max: 90 }
      ]
    },
    {
      type: 'Lunch',
      time: '12:30 - 14:30',
      booked: 540,
      skipped: 48,
      served: 410,
      slots: [
        { slot: '12:30 - 13:00', count: 130, max: 140 },
        { slot: '13:00 - 13:30', count: 140, max: 140 },
        { slot: '13:30 - 14:00', count: 138, max: 140 },
        { slot: '14:00 - 14:30', count: 84, max: 140 }
      ]
    },
    {
      type: 'Snacks',
      time: '17:00 - 18:00',
      booked: 210,
      skipped: 15,
      served: 180,
      slots: [
        { slot: '17:00 - 17:20', count: 65, max: 80 },
        { slot: '17:20 - 17:40', count: 78, max: 80 },
        { slot: '17:40 - 18:00', count: 52, max: 80 }
      ]
    },
    {
      type: 'Dinner',
      time: '19:30 - 21:30',
      booked: 490,
      skipped: 38,
      served: 0,
      slots: [
        { slot: '19:30 - 20:00', count: 110, max: 130 },
        { slot: '20:00 - 20:30', count: 130, max: 130 },
        { slot: '20:30 - 21:00', count: 125, max: 130 },
        { slot: '21:00 - 21:30', count: 87, max: 130 }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-navy dark:text-white">
          Bookings & Kitchen Portion Guidance
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Smart portion forecasting based on pre-bookings and student skips to prevent food waste.
        </p>
      </div>

      {/* Meals Forecast Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mealsData.map((meal) => {
          // Suggested cooking quantity: Booked count * 1.05 safety buffer
          const netDemand = meal.booked - meal.skipped;
          const suggestedCook = Math.round(netDemand * 1.05);

          return (
            <Card key={meal.type} className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-dark-border pb-3">
                <div>
                  <h3 className="font-heading font-bold text-lg text-navy dark:text-white">
                    {meal.type} Service
                  </h3>
                  <p className="text-xs text-slate-500">{meal.time}</p>
                </div>
                <Badge variant="navy" size="md">
                  {meal.served > 0 ? `${meal.served} Served` : 'Upcoming'}
                </Badge>
              </div>

              {/* Portion calculation callout */}
              <div className="p-4 rounded-2xl bg-orange-soft/40 dark:bg-orange/10 border border-orange/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange block">
                    Kitchen Preparation Target
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-black font-heading text-navy dark:text-white">
                      {suggestedCook}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Thali Portions (booked × 1.05 buffer)
                    </span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-orange text-white">
                  <ChefHat className="w-5 h-5" />
                </div>
              </div>

              {/* Stats pills */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-dark-border">
                  <span className="text-slate-400 block text-[10px]">Total Booked</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{meal.booked}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-dark-border">
                  <span className="text-amber-500 block text-[10px]">Pre-Skipped</span>
                  <span className="font-bold text-amber-600">{meal.skipped}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-dark-border">
                  <span className="text-emerald-500 block text-[10px]">Net Demand</span>
                  <span className="font-bold text-emerald-600">{netDemand}</span>
                </div>
              </div>

              {/* Slot occupancy bars */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Time-Slot Rush Distribution:
                </p>
                <div className="space-y-2">
                  {meal.slots.map(s => {
                    const pct = Math.round((s.count / s.max) * 100);
                    return (
                      <div key={s.slot} className="text-xs">
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">{s.slot}</span>
                          <span className="font-bold text-slate-700 dark:text-slate-200">{s.count} / {s.max} ({pct}%)</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${pct > 90 ? 'bg-danger' : pct > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
