import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Toggle from '../../components/ui/Toggle';
import { User, Mail, Phone, Building, Hash, Shield, Moon, Sun, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentProfile() {
  const { user, updateUserProfile } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    hostelName: user?.hostelName || '',
    department: user?.department || '',
    dietaryPreference: user?.dietaryPreference || 'veg'
  });

  const [notifSettings, setNotifSettings] = useState({
    menuAlerts: true,
    qrReminders: true,
    skipConfirmations: true
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile(formData);
    } catch {
      // toast shown in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-navy dark:text-white">
          My Profile & Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal dining details, dietary preference, and security options.
        </p>
      </div>

      {/* Profile Header Avatar Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-navy to-navy-light text-white font-heading font-black text-2xl flex items-center justify-center uppercase shadow-lg ring-4 ring-orange/20">
            {user?.avatar || 'ST'}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-xl font-bold font-heading text-navy dark:text-white">
              {user?.name}
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Roll No: {user?.rollNo} • Batch: {user?.batch || '2023 - 2027'}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-orange-soft text-orange">
                {user?.role?.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {user?.hostelType}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold font-heading text-navy dark:text-white mb-2">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs focus:ring-2 focus:ring-orange/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs focus:ring-2 focus:ring-orange/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs focus:ring-2 focus:ring-orange/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Hostel / Residence Room
              </label>
              <input
                type="text"
                value={formData.hostelName}
                onChange={(e) => setFormData({ ...formData, hostelName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs focus:ring-2 focus:ring-orange/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-2">
              Dietary Preference
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                <input
                  type="radio"
                  name="dietary"
                  value="veg"
                  checked={formData.dietaryPreference === 'veg'}
                  onChange={() => setFormData({ ...formData, dietaryPreference: 'veg' })}
                  className="text-orange focus:ring-orange"
                />
                <span>Vegetarian Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                <input
                  type="radio"
                  name="dietary"
                  value="non-veg"
                  checked={formData.dietaryPreference === 'non-veg'}
                  onChange={() => setFormData({ ...formData, dietaryPreference: 'non-veg' })}
                  className="text-orange focus:ring-orange"
                />
                <span>Non-Vegetarian / All</span>
              </label>
            </div>
          </div>
        </Card>

        {/* Preferences & Toggles */}
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold font-heading text-navy dark:text-white mb-2">
            App Preferences & Display
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-dark-border">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Dark Mode Theme
                </p>
                <p className="text-[11px] text-slate-400">
                  Switch between light and high-contrast dark palette
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={toggleTheme}>
                {isDark ? <Sun className="w-4 h-4 text-amber-400 mr-1" /> : <Moon className="w-4 h-4 mr-1" />}
                {isDark ? 'Light' : 'Dark'}
              </Button>
            </div>

            <div className="py-3">
              <Toggle
                label="Meal Booking Cut-off Alerts"
                description="Receive alerts 30 minutes before meal cut-off times"
                checked={notifSettings.menuAlerts}
                onChange={(checked) => setNotifSettings({ ...notifSettings, menuAlerts: checked })}
              />
            </div>

            <div className="py-3">
              <Toggle
                label="Anti-Fraud Dynamic Refresh Hints"
                description="Haptic or audio hint when QR refreshes automatically"
                checked={notifSettings.qrReminders}
                onChange={(checked) => setNotifSettings({ ...notifSettings, qrReminders: checked })}
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            icon={Save}
          >
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
