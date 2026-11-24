import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import NotificationBell from '../features/NotificationBell';
import {
  Moon,
  Sun,
  Menu as MenuIcon,
  X,
  QrCode,
  LayoutDashboard,
  UtensilsCrossed,
  ScanLine,
  History,
  User
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Mobile Bottom Tab Bar items (student quick actions)
  const mobileTabs = user?.role === 'student' ? [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Home' },
    { to: '/student/coupon', icon: QrCode, label: 'QR', highlight: true },
    { to: '/student/menu', icon: UtensilsCrossed, label: 'Menu' },
    { to: '/student/history', icon: History, label: 'History' },
    { to: '/student/profile', icon: User, label: 'Profile' }
  ] : user?.role === 'staff' ? [
    { to: '/staff/scanner', icon: ScanLine, label: 'Scanner', highlight: true },
    { to: '/staff/served', icon: History, label: 'Served' }
  ] : [];

  return (
    <div className="flex h-screen overflow-hidden bg-background dark:bg-dark-bg text-slate-800 dark:text-slate-100">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Mobile Sidebar Slider */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative h-full flex flex-col">
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
          <Sidebar className="h-full w-full" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 shrink-0 glass border-b border-slate-200/80 dark:border-dark-border px-4 sm:px-6 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-card rounded-xl lg:hidden"
            >
              <MenuIcon className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-bold font-heading text-navy dark:text-white capitalize">
                {user?.role} Portal
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                ABES Engineering College, Ghaziabad
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-card border border-transparent hover:border-slate-200 dark:hover:border-dark-border transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications Dropdown */}
            {user?.role === 'student' && <NotificationBell />}

            {/* User chip */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-dark-border">
              <div className="w-8 h-8 rounded-lg bg-orange text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                {user?.avatar || 'US'}
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden md:inline">
                {user?.name?.split(' ')[0]}
              </span>
            </div>
          </div>
        </header>

        {/* Page View Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation Bar (app-like experience) */}
        {mobileTabs.length > 0 && (
          <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-dark-card/95 backdrop-blur-md border-t border-slate-200 dark:border-dark-border px-2 py-1.5 flex items-center justify-around shadow-lg">
            {mobileTabs.map((tab) => {
              const isActive = location.pathname === tab.to;
              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all duration-200 ${
                    tab.highlight
                      ? 'bg-orange text-white -mt-5 p-2.5 rounded-full shadow-lg shadow-orange/30'
                      : isActive
                      ? 'text-orange font-semibold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                  }`}
                >
                  <tab.icon className={tab.highlight ? 'w-6 h-6' : 'w-5 h-5'} />
                  {!tab.highlight && (
                    <span className="text-[10px] mt-0.5">{tab.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}
