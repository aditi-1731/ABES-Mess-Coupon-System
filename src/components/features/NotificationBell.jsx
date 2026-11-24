import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Clock, ExternalLink } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../utils/formatDate';
import { Link } from 'react-router-dom';

export default function NotificationBell() {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-card border border-transparent hover:border-slate-200 dark:hover:border-dark-border transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-orange text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-slate-200 dark:border-dark-border z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-dark-border">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold font-heading text-navy dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-orange-soft text-orange">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-orange hover:text-orange-hover font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-dark-border">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No notifications right now.
              </div>
            ) : (
              notifications.slice(0, 6).map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-3.5 hover:bg-slate-50 dark:hover:bg-dark-border/50 transition-colors cursor-pointer ${
                    !notif.isRead ? 'bg-orange-soft/20 dark:bg-orange/5' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-xs font-semibold ${!notif.isRead ? 'text-navy dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {notif.title}
                    </p>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-orange shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {notif.message}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(notif.timestamp, 'time')}
                    </span>
                    {notif.link && (
                      <Link
                        to={notif.link}
                        onClick={() => setIsOpen(false)}
                        className="text-[11px] font-medium text-orange hover:underline flex items-center gap-0.5"
                      >
                        View <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 border-t border-slate-100 dark:border-dark-border text-center bg-slate-50/50 dark:bg-dark-bg/50">
            <Link
              to="/student/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-orange hover:text-orange-hover"
            >
              See all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
