import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as mockApi from '../services/mockApi';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const DataContext = createContext();

export function DataProvider({ children }) {
  const { user, refreshUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeBookings, setActiveBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState(Date.now());

  const fetchAppData = useCallback(async () => {
    if (!user) return;
    try {
      if (user.role === 'student') {
        const notifs = await mockApi.getNotifications(user.id);
        setNotifications(notifs);
        setUnreadCount(notifs.filter(n => !n.isRead).length);

        const bookings = await mockApi.getBookings(user.id);
        setActiveBookings(bookings);
      }
      setLastSync(Date.now());
    } catch (err) {
      console.error('Data sync error:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchAppData();

    // Listen for storage changes across tabs
    const handleStorage = () => {
      fetchAppData();
      refreshUser();
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [fetchAppData, refreshUser]);

  const markNotificationRead = async (notifId) => {
    await mockApi.markNotificationRead(notifId);
    setNotifications(prev =>
      prev.map(n => (n.id === notifId ? { ...n, isRead: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllNotificationsRead = async () => {
    if (!user) return;
    await mockApi.markAllNotificationsRead(user.id);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
    toast.success('All notifications marked as read');
  };

  const bookMeal = async (bookingData) => {
    if (!user) throw new Error('Must be logged in');
    setLoading(true);
    try {
      const res = await mockApi.bookMeal(user.id, bookingData);
      await fetchAppData();
      await refreshUser();
      toast.success(`${bookingData.mealType} booked successfully!`);
      return res;
    } catch (err) {
      toast.error(err.message || 'Failed to book meal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const skipMeal = async (bookingId) => {
    if (!user) return;
    setLoading(true);
    try {
      await mockApi.skipMeal(user.id, bookingId);
      await fetchAppData();
      toast.success('Meal skipped. Thank you for helping reduce food waste!');
    } catch (err) {
      toast.error(err.message || 'Failed to skip meal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!user) return;
    setLoading(true);
    try {
      await mockApi.cancelBooking(user.id, bookingId);
      await fetchAppData();
      toast.success('Booking cancelled.');
    } catch (err) {
      toast.error(err.message || 'Failed to cancel booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        notifications,
        unreadCount,
        activeBookings,
        loading,
        lastSync,
        fetchAppData,
        markNotificationRead,
        markAllNotificationsRead,
        bookMeal,
        skipMeal,
        cancelBooking
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
}
