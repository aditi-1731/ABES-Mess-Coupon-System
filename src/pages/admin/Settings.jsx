import React, { useState } from 'react';
import * as mockApi from '../../services/mockApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Toggle from '../../components/ui/Toggle';
import { useTheme } from '../../context/ThemeContext';
import { Settings, RefreshCw, AlertTriangle, Moon, Sun, Clock, ShieldCheck, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const { isDark, toggleTheme } = useTheme();

  const [settings, setSettings] = useState({
    qrRefreshInterval: 60,
    maxSlotCapacity: 140,
    allowSkipBeforeHours: 1.5,
    autoResetScanTimeout: 3.5,
    requireHostelIdForBooking: true
  });

  const [isResetting, setIsResetting] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    toast.success('System parameters updated and synchronized!');
  };

  const handleResetDemoData = async () => {
    if (!window.confirm('⚠️ This will reset all bookings, scans, ratings, and return seed data to original state. Proceed?')) {
      return;
    }

    setIsResetting(true);
    try {
      await mockApi.resetDemoData();
      toast.success('Demo state reset successfully! Refreshing...');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch {
      toast.error('Failed to reset demo data');
      setIsResetting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-navy dark:text-white">
          System & Mess Operation Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure security policies, timing cut-offs, scanner rules, and reset demo data.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Anti-Fraud QR Parameters */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-orange" />
            <h3 className="text-base font-bold font-heading text-navy dark:text-white">
              Anti-Fraud Dynamic QR Policy
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Token Refresh Cadence (Seconds)
              </label>
              <input
                type="number"
                value={settings.qrRefreshInterval}
                onChange={(e) => setSettings({ ...settings, qrRefreshInterval: parseInt(e.target.value, 10) || 60 })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Default: 60s. Renders shared screenshots invalid at counters.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Max Dining Slot Capacity
              </label>
              <input
                type="number"
                value={settings.maxSlotCapacity}
                onChange={(e) => setSettings({ ...settings, maxSlotCapacity: parseInt(e.target.value, 10) || 140 })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Maximum students allocated per 30-min window.
              </p>
            </div>
          </div>
        </Card>

        {/* Meal Timings & Cut-off Thresholds */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-orange" />
            <h3 className="text-base font-bold font-heading text-navy dark:text-white">
              Timing Windows & Pre-Skip Deadlines
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-dark-border text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-navy dark:text-white">Breakfast Window</span>
                <span className="text-slate-400 block text-[11px]">7:30 AM - 9:30 AM (Cut-off: 6:30 AM)</span>
              </div>
              <Badge variant="default" size="sm">Standard</Badge>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-navy dark:text-white">Lunch Window</span>
                <span className="text-slate-400 block text-[11px]">12:30 PM - 2:30 PM (Cut-off: 11:00 AM)</span>
              </div>
              <Badge variant="default" size="sm">Standard</Badge>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-navy dark:text-white">Dinner Window</span>
                <span className="text-slate-400 block text-[11px]">7:30 PM - 9:30 PM (Cut-off: 6:30 PM)</span>
              </div>
              <Badge variant="default" size="sm">Standard</Badge>
            </div>
          </div>
        </Card>

        {/* Global Dark Mode & Toggles */}
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold font-heading text-navy dark:text-white mb-2">
            Display & Preferences
          </h3>

          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-dark-border">
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Institutional Theme
              </p>
              <p className="text-[11px] text-slate-400">
                Toggle between light and navy dark modes
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              {isDark ? <Sun className="w-4 h-4 text-amber-400 mr-1" /> : <Moon className="w-4 h-4 mr-1" />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary">
            Save System Configurations
          </Button>
        </div>
      </form>

      {/* Danger Zone: Reset Demo Data */}
      <Card className="p-6 border-2 border-red-200 dark:border-red-950/50 bg-red-50/20 dark:bg-red-950/10">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-950/50 text-danger shrink-0 mt-0.5">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold font-heading text-danger">
              Reset Demo State to Factory Defaults
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Resets all localStorage records (bookings, scans, ratings, menus) back to initial seed data so you can restart the presentation cleanly.
            </p>
            <div className="pt-2">
              <Button
                variant="danger"
                size="sm"
                loading={isResetting}
                icon={RefreshCw}
                onClick={handleResetDemoData}
              >
                Reset Demo Data
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
