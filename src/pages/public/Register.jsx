import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Eye, EyeOff, ShieldCheck, Check } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    email: '',
    department: 'Computer Science & Engineering',
    batch: '2023 - 2027',
    hostelType: 'Hosteller',
    hostelName: 'ABES Hostel',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  // Password strength meter calculation
  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const strength = calculateStrength(formData.password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.rollNo.trim()) errs.rollNo = 'College Roll Number is required';
    if (!formData.email.trim()) errs.email = 'Email address is required';
    else if (!formData.email.includes('@')) errs.email = 'Enter a valid email';
    if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register(formData);
      navigate('/login');
    } catch {
      // Toast displayed by context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background dark:bg-dark-bg py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full mx-auto space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange flex items-center justify-center text-white shadow-md">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="font-heading font-extrabold text-xl text-navy dark:text-white">
              ABES <span className="text-orange">MESS</span>
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold font-heading text-navy dark:text-white">
            Create Student Account
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Register your official roll number to book meals and view dynamic QR coupons.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-dark-border shadow-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40"
              />
              {errors.name && <p className="text-[11px] text-danger mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                College Roll Number *
              </label>
              <input
                type="text"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                placeholder="e.g. 2300320100001"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40 font-mono"
              />
              {errors.rollNo && <p className="text-[11px] text-danger mt-1">{errors.rollNo}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="mail@abes.ac.in"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40"
              />
              {errors.email && <p className="text-[11px] text-danger mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 00000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Artificial Intelligence & DS">Artificial Intelligence & DS</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Hosteller or Day Scholar
              </label>
              <select
                name="hostelType"
                value={formData.hostelType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40"
              >
                <option value="Hosteller">Hosteller (Vivekananda / Kalpana Chawla)</option>
                <option value="Day Scholar">Day Scholar (Ghaziabad / Noida / Delhi)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-danger mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Confirm Password *
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40"
              />
              {errors.confirmPassword && <p className="text-[11px] text-danger mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Password strength meter */}
          {formData.password && (
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Password Strength:</span>
                <span className={`font-bold ${strength >= 75 ? 'text-success' : strength >= 50 ? 'text-amber-500' : 'text-danger'}`}>
                  {strength >= 75 ? 'Strong' : strength >= 50 ? 'Medium' : 'Weak'}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    strength >= 75 ? 'bg-success' : strength >= 50 ? 'bg-amber-500' : 'bg-danger'
                  }`}
                  style={{ width: `${strength}%` }}
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full justify-center mt-4"
          >
            Complete Registration
          </Button>

          <p className="text-center text-xs text-slate-500 pt-2">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-orange hover:underline">
              Sign In here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
