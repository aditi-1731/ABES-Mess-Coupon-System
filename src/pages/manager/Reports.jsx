import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { initialStats } from '../../data/stats';
import { formatCurrency } from '../../utils/formatDate';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Download, Printer, TrendingDown, DollarSign, Utensils, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManagerReports() {
  const [dateRange, setDateRange] = useState('30days');

  const { weeklyServed, peakHours, mealTypeBreakdown, wastageTrends, revenueByPlan } = initialStats;

  const handlePrint = () => {
    window.print();
  };

  const handleExportSummaryCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Week,Cooked,Served,Saved From Skips,Waste Kg\n' +
      wastageTrends.map(w => `${w.week},${w.cooked},${w.served},${w.savedFromSkips},${w.wasteKg}`).join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = 'ABES-Wastage-Analysis.csv';
    link.click();
    toast.success('Wastage analytics exported as CSV!');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-navy dark:text-white">
            Dining Analytics & Wastage Reports
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Recharts statistical visualizations on food waste reduction, rush hours, and dining demand.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={Printer} onClick={handlePrint}>
            Print Report
          </Button>
          <Button variant="primary" size="sm" icon={Download} onClick={handleExportSummaryCSV}>
            Export Summary CSV
          </Button>
        </div>
      </div>

      {/* Wastage Milestone Card */}
      <Card className="p-6 bg-gradient-to-tr from-emerald-600 to-teal-700 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white">
              WASTE REDUCTION IMPACT
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-heading">
              790 Meals Saved From Wastage This Month
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              By introducing meal opt-out buttons and 60-second anti-fraud coupons, kitchen food over-preparation dropped from 42 kg/week to only 19 kg/week!
            </p>
          </div>

          <div className="text-center bg-white/10 p-4 rounded-2xl border border-white/20 shrink-0">
            <span className="text-4xl font-extrabold font-heading text-white">
              -54.7%
            </span>
            <span className="block text-xs text-emerald-200 mt-0.5 uppercase tracking-wider font-semibold">
              Hostel Food Waste Drop
            </span>
          </div>
        </div>
      </Card>

      {/* Chart Row 1: Weekly Served vs Skipped (Bar) & Wastage Trend (Line) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-base font-bold font-heading text-navy dark:text-white mb-1">
            Weekly Served vs Booked vs Skipped
          </h3>
          <p className="text-xs text-slate-500 mb-4">Daily comparison of meal statuses</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyServed} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="served" name="Served" fill="#16A34A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="skipped" name="Skipped" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-base font-bold font-heading text-navy dark:text-white mb-1">
            Monthly Food Waste Drop Trend (kg)
          </h3>
          <p className="text-xs text-slate-500 mb-4">Weekly solid food waste measurements</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wastageTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="week" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="wasteKg" name="Waste (kg)" stroke="#DC2626" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="savedFromSkips" name="Meals Saved" stroke="#16A34A" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Chart Row 2: Peak Hours Distribution & Revenue by Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Card className="p-6">
            <h3 className="text-base font-bold font-heading text-navy dark:text-white mb-1">
              Counter Peak Rush Hours
            </h3>
            <p className="text-xs text-slate-500 mb-4">Scans volume per 30-minute interval</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakHours} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="count" name="Verified Scans" fill="#FF7A1A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5">
          <Card className="p-6">
            <h3 className="text-base font-bold font-heading text-navy dark:text-white mb-1">
              Meal Volume by Dining Category
            </h3>
            <p className="text-xs text-slate-500 mb-4">Thali proportion breakdown</p>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mealTypeBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {mealTypeBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
