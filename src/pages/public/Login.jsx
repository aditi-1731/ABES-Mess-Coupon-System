import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UtensilsCrossed, Eye, EyeOff, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      const roleRoutes = {
        student: '/student/dashboard',
        staff: '/staff/scanner',
        manager: '/manager/menu',
        admin: '/admin/dashboard'
      };
      navigate(from || roleRoutes[user.role] || '/');
    } catch {
      // Toast displayed by AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen flex bg-background dark:bg-dark-bg">
      {/* Left Form Panel */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-12 py-12">
        <div className="max-w-md w-full mx-auto space-y-8">
          {/* Brand */}
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange flex items-center justify-center text-white shadow-md shadow-orange/20">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="font-heading font-extrabold text-xl text-navy dark:text-white">
              ABES <span className="text-orange">MESS</span>
            </span>
          </Link>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-navy dark:text-white">
              Welcome back
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Enter your credentials to access your meal pass & bookings.
            </p>
          </div>

          {/* Quick Demo Autofill Chips */}
          {isDemoMode && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-orange" />
                Quick Demo Autofill:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleFillDemo('aditi.24b0101070@abes.ac.in', 'student123')}
                  className="p-2 text-left rounded-lg border border-slate-200 dark:border-dark-border hover:border-orange bg-white dark:bg-dark-bg font-medium transition-colors"
                >
                  <span className="font-bold block text-navy dark:text-white">Student</span>
                  <span className="text-[10px] text-slate-400">aditi.24b0101070@abes.ac.in</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('staff@abes.ac.in', 'staff123')}
                  className="p-2 text-left rounded-lg border border-slate-200 dark:border-dark-border hover:border-orange bg-white dark:bg-dark-bg font-medium transition-colors"
                >
                  <span className="font-bold block text-navy dark:text-white">Staff Counter</span>
                  <span className="text-[10px] text-slate-400">staff@abes.ac.in</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('manager@abes.ac.in', 'manager123')}
                  className="p-2 text-left rounded-lg border border-slate-200 dark:border-dark-border hover:border-orange bg-white dark:bg-dark-bg font-medium transition-colors"
                >
                  <span className="font-bold block text-navy dark:text-white">Mess Manager</span>
                  <span className="text-[10px] text-slate-400">manager@abes.ac.in</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('admin@abes.ac.in', 'admin123')}
                  className="p-2 text-left rounded-lg border border-slate-200 dark:border-dark-border hover:border-orange bg-white dark:bg-dark-bg font-medium transition-colors"
                >
                  <span className="font-bold block text-navy dark:text-white">Administrator</span>
                  <span className="text-[10px] text-slate-400">admin@abes.ac.in</span>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                Official Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. aditi.24b0101070@abes.ac.in"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm focus:outline-none focus:ring-2 focus:ring-orange/40"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-orange hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm focus:outline-none focus:ring-2 focus:ring-orange/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-orange focus:ring-orange"
                />
                <span>Remember me on this device</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full justify-center mt-2"
            >
              Sign In to Account
            </Button>
          </form>

          {/* Bottom link */}
          <p className="text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-orange hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Art Panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-tr from-navy to-navy-light items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="max-w-md space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-orange text-white flex items-center justify-center mx-auto shadow-xl">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-extrabold font-heading">
            Zero Queues. Fresh Food.
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            "The dynamic 60s QR code pass has transformed the lunch rush at ABES. Students get served in under 10 seconds!"
          </p>
          <div className="pt-4 border-t border-white/10 text-xs text-slate-400">
            ABES Mess Management Board • Ghaziabad, UP
          </div>
        </div>
      </div>
    </div>
  );
}
