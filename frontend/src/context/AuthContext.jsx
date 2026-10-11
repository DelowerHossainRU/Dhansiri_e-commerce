import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('dhansiri_token') || null);
  const [loading, setLoading] = useState(true);

  // Fetch current user if token exists
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.success && res.data) {
          setUser(res.data);
        } else {
          logout();
        }
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.data) {
      localStorage.setItem('dhansiri_token', res.data.accessToken);
      setToken(res.data.accessToken);
      setUser(res.data.user);
      return res.data.user;
    }
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.success && res.data) {
      localStorage.setItem('dhansiri_token', res.data.accessToken);
      setToken(res.data.accessToken);
      setUser(res.data.user);
      return res.data.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('dhansiri_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await api.put('/auth/profile', data);
    if (res.success && res.data) {
      setUser(res.data);
      return res.data;
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user && ['Admin', 'Super Admin'].includes(user.role),
    isStaff: user && ['Staff', 'Manager', 'Admin', 'Super Admin'].includes(user.role),
    isWholesaleCustomer: user && user.role === 'Wholesale Customer',
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
