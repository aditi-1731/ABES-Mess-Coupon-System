import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import QRCoupon from '../../components/features/QRCoupon';
import Tabs from '../../components/ui/Tabs';
import EmptyState from '../../components/ui/EmptyState';
import { getTodayDateString } from '../../utils/formatDate';
import { QrCode, UtensilsCrossed, ArrowRight } from 'lucide-react';

export default function StudentCoupon() {
  const { user } = useAuth();
  const { activeBookings, fetchAppData } = useData();

  const today = getTodayDateString();
  const todayBookings = activeBookings.filter(b => b.date === today);

  const [selectedBookingId, setSelectedBookingId] = useState(
    todayBookings[0]?.id || null
  );

  useEffect(() => {
    if (todayBookings.length > 0 && (!selectedBookingId || !todayBookings.some(b => b.id === selectedBookingId))) {
      setSelectedBookingId(todayBookings[0].id);
    }
  }, [todayBookings, selectedBookingId]);

  const selectedBooking = todayBookings.find(b => b.id === selectedBookingId) || todayBookings[0];

  const mealTabs = todayBookings.map(b => ({
    id: b.id,
    label: `${b.mealType} (${b.status})`
  }));

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-navy dark:text-white">
          My QR Dining Pass
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Present this live rotating code at the mess counter for instant verification.
        </p>
      </div>

      {todayBookings.length === 0 ? (
        <EmptyState
          icon={QrCode}
          title="No Active Bookings for Today"
          description="You haven't booked any meals for today yet. Reserve your slot now to generate your QR pass."
          actionLabel="Browse Today's Menu"
          onAction={() => window.location.href = '/student/menu'}
        />
      ) : (
        <>
          {/* If student has multiple meals booked today, render tabs */}
          {todayBookings.length > 1 && (
            <Tabs
              pill
              tabs={mealTabs}
              activeTab={selectedBookingId}
              onChange={setSelectedBookingId}
              className="justify-center"
            />
          )}

          {/* Core QRCoupon component */}
          {selectedBooking && (
            <QRCoupon
              booking={selectedBooking}
              student={user}
              onRefreshStatus={fetchAppData}
            />
          )}

          <div className="text-center pt-2">
            <Link
              to="/student/menu"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange hover:underline"
            >
              Book another meal for today <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
