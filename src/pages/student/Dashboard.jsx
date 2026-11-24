import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import CrowdMeter from '../../components/features/CrowdMeter';
import { getTodayDateString, formatDate } from '../../utils/formatDate';
import { initialMenu } from '../../data/menu';
import {
  UtensilsCrossed,
  QrCode,
  CalendarDays,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  History,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { activeBookings, skipMeal, bookMeal } = useData();
  const navigate = useNavigate();

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const today = getTodayDateString();
  const todayBookings = activeBookings.filter(b => b.date === today);

  // Find next meal for today
  const mealsOrder = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];
  const nextMealBooking = todayBookings.find(b => b.status === 'Active' || b.status === 'Booked') || todayBookings[0];

  // Weekly mini consumption chart data
  const consumptionData = [
    { day: 'Mon', count: 3 },
    { day: 'Tue', count: 3 },
    { day: 'Wed', count: 4 },
    { day: 'Thu', count: 2 },
    { day: 'Fri', count: 4 },
    { day: 'Sat', count: 2 },
    { day: 'Sun', count: 2 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-navy dark:text-white">
            {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Hostel Mess: Vivekananda Hall • Roll: <span className="font-mono font-semibold">{user?.rollNo}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/student/menu">
            <Button variant="outline" size="sm" icon={CalendarDays}>
              View Menu
            </Button>
          </Link>
          <Link to="/student/coupon">
            <Button variant="primary" size="sm" icon={QrCode}>
              Show My QR Pass
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero "Next Meal" Card with Countdown */}
      <Card className="relative overflow-hidden p-6 bg-gradient-to-tr from-navy to-navy-light text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange text-white">
                UPCOMING DINING
              </span>
              <span className="text-xs text-slate-300">
                Today, {formatDate(today, 'short')}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white">
              {nextMealBooking ? nextMealBooking.mealType : 'Lunch Service'}
            </h3>
            <p className="text-sm text-slate-200 font-medium">
              {nextMealBooking?.menuName || 'Dal Makhani & Jeera Rice Thali with Salad'}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange" />
                Slot: <strong className="text-white">{nextMealBooking?.slot || '12:30 - 13:00'}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Counter: <strong className="text-white">Counter 1 - Main Hall</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <Button
              variant="primary"
              size="lg"
              icon={QrCode}
              onClick={() => navigate('/student/coupon')}
              className="shadow-lg shadow-orange/30 justify-center"
            >
              Get My QR Pass
            </Button>
            {nextMealBooking && nextMealBooking.status === 'Active' && (
              <Button
                variant="outline"
                size="md"
                onClick={() => skipMeal(nextMealBooking.id)}
                className="text-white border-white/20 hover:bg-white/10 justify-center"
              >
                Skip This Meal
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Meals Remaining"
          value={user?.mealsLeft ?? 42}
          suffix="meals"
          subtitle="Monthly Standard Plan"
          icon={UtensilsCrossed}
          iconColor="text-orange"
          iconBg="bg-orange-soft dark:bg-orange/20"
        />
        <StatCard
          title="Plan Expiry"
          value={user?.planExpiry ? formatDate(user.planExpiry, 'short') : '21 Days'}
          subtitle="Auto-renewal active"
          icon={CalendarDays}
          iconColor="text-blue-500"
          iconBg="bg-blue-50 dark:bg-blue-950/40"
        />
        <StatCard
          title="Meals This Month"
          value={28}
          suffix="thalis"
          subtitle="3 meals skipped"
          icon={TrendingUp}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-50 dark:bg-emerald-950/40"
        />
        <StatCard
          title="Est. Money Saved"
          value={1420}
          prefix="₹"
          subtitle="vs Pay-per-meal"
          icon={CreditCard}
          iconColor="text-amber-500"
          iconBg="bg-amber-50 dark:bg-amber-950/40"
        />
      </div>

      {/* Middle Row: Today's 4 Meals Status & Live Crowd Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's 4 Meals Status */}
        <div className="lg:col-span-7">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold font-heading text-navy dark:text-white">
                  Today's Meals Schedule
                </h3>
                <p className="text-xs text-slate-500">
                  Quick status & slot management for {formatDate(today)}
                </p>
              </div>
              <Link to="/student/menu" className="text-xs font-semibold text-orange hover:underline">
                View Full Menu
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { type: 'Breakfast', time: '07:30 - 09:30', dish: 'Poha & Jalebi with Masala Chai' },
                { type: 'Lunch', time: '12:30 - 14:30', dish: 'Dal Makhani & Jeera Rice Thali' },
                { type: 'Snacks', time: '17:00 - 18:00', dish: 'Veg Pakora & Cardamom Tea' },
                { type: 'Dinner', time: '19:30 - 21:30', dish: 'Aloo Gobhi & Yellow Dal Tadka' }
              ].map((m) => {
                const booking = todayBookings.find(b => b.mealType === m.type);
                const isUsed = booking?.status === 'Used';
                const isSkipped = booking?.status === 'Skipped';
                const isBooked = booking && !isUsed && !isSkipped;

                return (
                  <div
                    key={m.type}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-dark-border bg-slate-50/60 dark:bg-dark-bg/40 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-navy dark:text-white">
                          {m.type}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {m.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-1">
                        {m.dish}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isUsed ? (
                        <Badge variant="default" size="sm">Served</Badge>
                      ) : isSkipped ? (
                        <Badge variant="warning" size="sm">Skipped</Badge>
                      ) : isBooked ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="success" size="sm" dot>Booked</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => skipMeal(booking.id)}
                            className="text-xs text-slate-500 hover:text-amber-600"
                          >
                            Skip
                          </Button>
                        </div>
                      ) : (
                        <Link to="/student/menu">
                          <Button variant="soft" size="sm">
                            Book Slot
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right: Crowd Meter */}
        <div className="lg:col-span-5">
          <CrowdMeter />
        </div>
      </div>

      {/* Bottom Row: Weekly Consumption Chart & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mini Chart */}
        <div className="lg:col-span-7">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold font-heading text-navy dark:text-white">
                  Weekly Meals Consumption
                </h3>
                <p className="text-xs text-slate-500">
                  Meals taken over the current week
                </p>
              </div>
              <Badge variant="navy" size="sm">This Week</Badge>
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={consumptionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F1B33',
                      borderColor: '#1F3A5F',
                      borderRadius: '12px',
                      color: '#FFF',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="count" fill="#FF7A1A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Quick Navigation Links */}
        <div className="lg:col-span-5">
          <Card className="p-6">
            <h3 className="text-base font-bold font-heading text-navy dark:text-white mb-3">
              Quick Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/student/menu"
                className="p-3.5 rounded-xl border border-slate-200 dark:border-dark-border hover:border-orange bg-slate-50/50 dark:bg-dark-bg/50 transition-colors group"
              >
                <UtensilsCrossed className="w-5 h-5 text-orange mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-navy dark:text-white block">Mess Menu</span>
                <span className="text-[10px] text-slate-400">7-Day Thalis</span>
              </Link>

              <Link
                to="/student/plans"
                className="p-3.5 rounded-xl border border-slate-200 dark:border-dark-border hover:border-orange bg-slate-50/50 dark:bg-dark-bg/50 transition-colors group"
              >
                <CreditCard className="w-5 h-5 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-navy dark:text-white block">Meal Plans</span>
                <span className="text-[10px] text-slate-400">Recharge / Buy</span>
              </Link>

              <Link
                to="/student/history"
                className="p-3.5 rounded-xl border border-slate-200 dark:border-dark-border hover:border-orange bg-slate-50/50 dark:bg-dark-bg/50 transition-colors group"
              >
                <History className="w-5 h-5 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-navy dark:text-white block">Meal History</span>
                <span className="text-[10px] text-slate-400">Export CSV</span>
              </Link>

              <Link
                to="/student/feedback"
                className="p-3.5 rounded-xl border border-slate-200 dark:border-dark-border hover:border-orange bg-slate-50/50 dark:bg-dark-bg/50 transition-colors group"
              >
                <MessageSquare className="w-5 h-5 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-navy dark:text-white block">Feedback</span>
                <span className="text-[10px] text-slate-400">Rate & Complaints</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
