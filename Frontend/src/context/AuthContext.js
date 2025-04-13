import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AuthContext mount');
    const token = sessionStorage.getItem('token');
    if (token) {
      // Validate token with backend
      api.get('/auth/profile')
        .then(res => {
          console.log('Restoring user from token:', res.data);
          setUser({ token, role: res.data.role });
        })
        .catch(err => {
          console.error('Token validation failed:', err.response);
          setUser(null);
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('mfaToken');
          navigate('/login');
        });
    } else {
      console.log('No token found, clearing user');
      setUser(null);
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('mfaToken');
    }
  }, [navigate]);

  const login = async (emailOrUsername, password) => {
    try {
      const res = await api.post('/auth/login', { emailOrUsername, password });
      if (res.data.mfaRequired) {
        sessionStorage.setItem('mfaToken', res.data.mfaToken);
        navigate('/mfa/verify');
      } else {
        setUser({ token: res.data.token, role: res.data.role });
        sessionStorage.setItem('token', res.data.token);
        console.log('Login success:', { token: res.data.token, role: res.data.role });
        toast.success('Logged in successfully!');
        navigate('/feed');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    }
  };

  const adminLogin = async (emailOrUsername, password) => {
    try {
      const res = await api.post('/auth/admin-login', { emailOrUsername, password });
      if (res.data.mfaRequired) {
        sessionStorage.setItem('mfaToken', res.data.mfaToken);
        navigate('/mfa/verify');
      } else {
        setUser({ token: res.data.token, role: res.data.role });
        sessionStorage.setItem('token', res.data.token);
        console.log('Admin login success:', { token: res.data.token, role: res.data.role });
        toast.success('Admin logged in!');
        navigate('/admin');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Admin login failed');
    }
  };

  const register = async (username, email, password, isPrivate) => {
    try {
      await api.post('/auth/register', { username, email, password, isPrivate });
      toast.success('Registered! Check your email to verify.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err.response);
      toast.error(err.response?.data?.error || 'Registration failed');
    }
  };

  const verifyEmail = async (token) => {
    try {
      await api.get(`/auth/verify-email?token=${token}`);
      toast.success('Email verified!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Verification failed');
    }
  };

  const logout = async () => {
    try {
      const token = sessionStorage.getItem('token');
      await api.post('/auth/logout', { token, refreshToken: '' });
      setUser(null);
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('mfaToken');
      toast.success('Logged out!');
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const refreshToken = async (token, refreshToken) => {
    try {
      const res = await api.post('/auth/refresh-token', { token, refreshToken });
      setUser({ token: res.data.token, role: user?.role });
      sessionStorage.setItem('token', res.data.token);
      return res.data.token;
    } catch (err) {
      toast.error('Token refresh failed');
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, adminLogin, register, verifyEmail, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};