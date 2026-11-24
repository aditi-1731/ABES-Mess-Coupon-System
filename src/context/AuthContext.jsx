import React, { createContext, useContext, useState, useEffect } from 'react';
import * as mockApi from '../services/mockApi';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const currentUser = await mockApi.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Failed to load session:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSession();

    // Listen for storage events across tabs
    const handleStorageChange = async () => {
      try {
        const currentUser = await mockApi.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email, password) => {
    try {
      const loggedUser = await mockApi.login(email, password);
      setUser(loggedUser);
      toast.success(`Welcome back, ${loggedUser.name}!`);
      return loggedUser;
    } catch (err) {
      toast.error(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const newUser = await mockApi.register(userData);
      toast.success('Registration successful! Please log in.');
      return newUser;
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('abes_session');
    } catch {
      // ignore
    }
    setUser(null);
    toast.success('Logged out successfully');
  };

  // Quick login helper for demo
  const quickLogin = async (role) => {
    const credentials = {
      student: { email: 'aditi.24b0101070@abes.ac.in', pass: 'student123' },
      staff: { email: 'staff@abes.ac.in', pass: 'staff123' },
      manager: { email: 'manager@abes.ac.in', pass: 'manager123' },
      admin: { email: 'admin@abes.ac.in', pass: 'admin123' }
    };

    const cred = credentials[role];
    if (cred) {
      return await login(cred.email, cred.pass);
    }
    throw new Error('Unknown role for demo login');
  };

  const updateUserProfile = async (updateData) => {
    if (!user) return;
    try {
      const updated = await mockApi.updateProfile(user.id, updateData);
      setUser(prev => ({ ...prev, ...updated }));
      toast.success('Profile updated successfully');
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
      throw err;
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const updated = await mockApi.getCurrentUser();
      setUser(updated);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        role: user?.role,
        login,
        register,
        logout,
        quickLogin,
        updateUserProfile,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
