import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { initialStats } from '../../data/stats';
import { formatDate, formatCurrency } from '../../utils/formatDate';
import {
  Users,
  UtensilsCrossed,
  CreditCard,
  DollarSign,
  TrendingDown,
  Activity,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { kpis, weeklyServed, peakHours } = initialStats;

  // Simulated live counter stream (new redemptions stream in)
  const [liveStream, setLiveStream] = useState([
    { id: 'ev-1', student: 'Aditi', roll: '24B0101070', meal: 'Lunch', counter: 'Counter 1', time: 'Just now' },
    { id: 'ev-2', student: 'Priya Patel', roll: '2300320100045', meal: 'Lunch', counter: 'Counter 2', time: '1 min ago' },
    { id: 'ev-3', student: 'Rohit Verma', roll: '2200320100088', meal: 'Lunch', counter: 'Counter 1', time: '3 mins ago' },
    { id: 'ev-4', student: 'Ananya Singh', roll: '2300320100012', meal: 'Lunch', counter: 'Counter 1', time: '4 mins ago' }
  ]);

  useEffect(() => {
    const studentNames = ['Sneha Gupta', 'Aditya Joshi', 'Vikram Malhotra', 'Rahul Mehra', 'Tanya Agarwal'];
    const interval = setInterval(() => {
      const randomName = studentNames[Math.floor(Math.random() * studentNames.length)];
      const randomRoll = `23003201000${Math.floor(10 + Math.random() * 89)}`;
      const newEvent = {
        id: `ev-${Date.now()}`,
        student: randomName,
        roll: randomRoll,
        meal: 'Lunch',
        counter: Math.random() > 0.5 ? 'Counter 1' : 'Counter 2',
        time: 'Just now'
      };
      setLiveStream(prev => [newEvent, ...prev.slice(0, 5)]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-navy dark:text-white">
            System Administration Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Institutional metrics for ABES Engineering College Hostels & Dining Board.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/users">
            <Button variant="outline" size="sm" icon={Users}>
              Manage Users
            </Button>
          </Link>
          <Link to="/admin/settings">
            <Button variant="primary" size="sm">
              System Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Students"
          value={kpis.totalStudents}
          suffix="hostellers"
          subtitle="94% dining adoption"
          icon={Users}
          iconColor="text-blue-500"
          iconBg="bg-blue-50 dark:bg-blue-950/40"
        />
        <StatCard
          title="Meals Served Today"
          value={kpis.mealsServedToday}
          suffix="thalis"
          subtitle="All counters combined"
          icon={UtensilsCrossed}
          iconColor="text-orange"
          iconBg="bg-orange-soft dark:bg-orange/20"
        />
        <StatCard
          title="Active Meal Plans"
          value={kpis.activePlans}
          subtitle="Monthly & Weekly active"
          icon={CreditCard}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-50 dark:bg-emerald-950/40"
        />
        <StatCard
          title="Mess Revenue (This Month)"
          value={kpis.revenueThisMonth}
          prefix="₹"
          subtitle="Direct UPI collection"
          icon={DollarSign}
          iconColor="text-amber-500"
          iconBg="bg-amber-50 dark:bg-amber-950/40"
        />
      </div>

      {/* Middle Row: Weekly Dining Volume Chart & Live Counter Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-7">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold font-heading text-navy dark:text-white">
                  Weekly Meals Consumption
                </h3>
                <p className="text-xs text-slate-500">Served vs Skipped meals across hostels</p>
              </div>
              <Badge variant="success" size="sm" dot>Live Sync</Badge>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyServed} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="served" name="Served Thalis" fill="#FF7A1A" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="skipped" name="Saved via Skips" fill="#16A34A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Live Activity Feed */}
        <div className="lg:col-span-5">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-base font-bold font-heading text-navy dark:text-white">
                  Live Counter Scan Feed
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Stream Active</span>
            </div>

            <div className="space-y-3">
              {liveStream.map(ev => (
                <div
                  key={ev.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-dark-border bg-slate-50/60 dark:bg-dark-bg/40 flex items-center justify-between text-xs animate-in fade-in"
                >
                  <div>
                    <p className="font-bold text-navy dark:text-white">
                      {ev.student}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {ev.roll} • {ev.counter}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="success" size="sm">Valid</Badge>
                    <span className="text-[10px] text-slate-400 block mt-1">{ev.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
