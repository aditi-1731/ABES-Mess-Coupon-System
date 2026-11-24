import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts & Guards
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Public Pages
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import ForgotPassword from './pages/public/ForgotPassword';
import NotFound from './pages/public/NotFound';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentMenu from './pages/student/Menu';
import StudentCoupon from './pages/student/Coupon';
import StudentHistory from './pages/student/History';
import StudentPlans from './pages/student/Plans';
import StudentFeedback from './pages/student/Feedback';
import StudentProfile from './pages/student/Profile';
import StudentNotifications from './pages/student/Notifications';

// Staff Pages
import StaffScanner from './pages/staff/Scanner';
import StaffServedToday from './pages/staff/ServedToday';

// Manager Pages
import ManagerMenuEditor from './pages/manager/MenuEditor';
import ManagerBookings from './pages/manager/Bookings';
import ManagerReports from './pages/manager/Reports';
import ManagerFeedbackReview from './pages/manager/FeedbackReview';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminPlans from './pages/admin/Plans';
import AdminSettings from './pages/admin/Settings';

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0F1B33',
            color: '#fff',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: '500',
            boxShadow: '0 10px 25px -5px rgba(15, 27, 51, 0.25)'
          },
          success: {
            iconTheme: {
              primary: '#16A34A',
              secondary: '#fff'
            }
          },
          error: {
            iconTheme: {
              primary: '#DC2626',
              secondary: '#fff'
            }
          }
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Student Protected Portal */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="menu" element={<StudentMenu />} />
          <Route path="coupon" element={<StudentCoupon />} />
          <Route path="history" element={<StudentHistory />} />
          <Route path="plans" element={<StudentPlans />} />
          <Route path="feedback" element={<StudentFeedback />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="notifications" element={<StudentNotifications />} />
        </Route>

        {/* Staff Protected Counter Portal */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={['staff']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/staff/scanner" replace />} />
          <Route path="scanner" element={<StaffScanner />} />
          <Route path="served" element={<StaffServedToday />} />
        </Route>

        {/* Manager Protected Portal */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={['manager']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/manager/menu" replace />} />
          <Route path="menu" element={<ManagerMenuEditor />} />
          <Route path="bookings" element={<ManagerBookings />} />
          <Route path="reports" element={<ManagerReports />} />
          <Route path="feedback" element={<ManagerFeedbackReview />} />
        </Route>

        {/* Admin Protected Portal */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="plans" element={<AdminPlans />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 Catch All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
