import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import { formatDate } from '../../utils/formatDate';
import { Link } from 'react-router-dom';
import { Bell, Clock, CheckCheck, ExternalLink, Sparkles } from 'lucide-react';

export default function StudentNotifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const [filter, setFilter] = useState('all');

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-navy dark:text-white">
            Notifications Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Important announcements, menu specials, low balance, and scan confirmations.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={CheckCheck}
          onClick={markAllNotificationsRead}
        >
          Mark All As Read
        </Button>
      </div>

      <Tabs
        pill
        tabs={[
          { id: 'all', label: 'All Notifications', count: notifications.length },
          { id: 'unread', label: 'Unread Only', count: notifications.filter(n => !n.isRead).length }
        ]}
        activeTab={filter}
        onChange={setFilter}
      />

      <Card className="divide-y divide-slate-100 dark:divide-dark-border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No notifications matching this filter.
          </div>
        ) : (
          filtered.map(notif => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-5 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-dark-border/40 ${
                !notif.isRead ? 'bg-orange-soft/20 dark:bg-orange/5' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${!notif.isRead ? 'bg-orange text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${!notif.isRead ? 'text-navy dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {notif.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(notif.timestamp, 'datetime')}
                      </span>
                      {notif.link && (
                        <Link
                          to={notif.link}
                          className="font-semibold text-orange hover:underline flex items-center gap-0.5"
                        >
                          View Details <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {!notif.isRead && (
                  <span className="w-2.5 h-2.5 rounded-full bg-orange shrink-0 mt-2" />
                )}
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
