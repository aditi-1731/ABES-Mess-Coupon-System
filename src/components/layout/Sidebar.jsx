import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  QrCode,
  History,
  CreditCard,
  MessageSquare,
  User,
  Bell,
  ScanLine,
  CheckCircle2,
  CalendarDays,
  BarChart3,
  Users,
  Settings,
  Sliders,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function Sidebar({ className = '' }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useData();

  if (!user) return null;

  const role = user.role;

  const studentLinks = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/coupon', icon: QrCode, label: 'My QR Coupon', highlight: true },
    { to: '/student/menu', icon: UtensilsCrossed, label: 'Mess Menu' },
    { to: '/student/plans', icon: CreditCard, label: 'Meal Plans' },
    { to: '/student/history', icon: History, label: 'Meal History' },
    { to: '/student/feedback', icon: MessageSquare, label: 'Feedback & Help' },
    { to: '/student/notifications', icon: Bell, label: 'Notifications', count: unreadCount },
    { to: '/student/profile', icon: User, label: 'My Profile' }
  ];

  const staffLinks = [
    { to: '/staff/scanner', icon: ScanLine, label: 'Live QR Scanner', highlight: true },
    { to: '/staff/served', icon: CheckCircle2, label: 'Served Today' }
  ];

  const managerLinks = [
    { to: '/manager/menu', icon: UtensilsCrossed, label: 'Weekly Menu Editor', highlight: true },
    { to: '/manager/bookings', icon: CalendarDays, label: 'Bookings & Portions' },
    { to: '/manager/reports', icon: BarChart3, label: 'Reports & Wastage' },
    { to: '/manager/feedback', icon: MessageSquare, label: 'Feedback Review' }
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/admin/users', icon: Users, label: 'User Directory', highlight: true },
    { to: '/admin/plans', icon: CreditCard, label: 'Plan Pricing' },
    { to: '/admin/settings', icon: Settings, label: 'System Settings' }
  ];

  const linksByRole = {
    student: studentLinks,
    staff: staffLinks,
    manager: managerLinks,
    admin: adminLinks
  };

  const navLinks = linksByRole[role] || [];

  return (
    <aside
      className={`w-64 shrink-0 bg-white dark:bg-dark-card border-r border-slate-200/80 dark:border-dark-border flex flex-col justify-between transition-colors duration-200 ${className}`}
    >
      <div>
        {/* Brand header */}
        <div className="p-6 border-b border-slate-100 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange/20">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg text-navy dark:text-white leading-tight">
                ABES <span className="text-orange">MESS</span>
              </h2>
              <span className="text-[11px] font-semibold text-slate-400 capitalize">
                {role} Portal
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-4 space-y-1">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? item.highlight
                      ? 'bg-orange text-white shadow-md shadow-orange/25 font-semibold'
                      : 'bg-orange-soft dark:bg-orange/20 text-orange dark:text-orange font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-border'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-orange text-white">
                  {item.count}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User profile footer chip */}
      <div className="p-4 border-t border-slate-100 dark:border-dark-border">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200/60 dark:border-dark-border">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-navy text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
              {user.avatar || 'US'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize truncate">
                {role} {user.rollNo ? `• ${user.rollNo.slice(-5)}` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-danger hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
