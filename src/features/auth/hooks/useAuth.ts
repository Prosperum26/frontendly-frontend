import { useState } from 'react';
import { useAuthStore } from '../../../store/auth.store';
import { authService } from '../services/auth.service';
import type { LoginCredentials, RegisterCredentials } from '../types/auth.types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

export const useAuth = () => {
  const { isAuthenticated, currentUser, setAuth, logout } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      setAuth(true, response.user ?? null);
      setNotification({ message: 'Login successful!', type: 'success' });
      setTimeout(() => {
        navigate(ROUTES.HOME);
      }, 1500);
    } catch {
      setNotification({ message: 'Login failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setLoading(true);
    try {
      const response = await authService.register(credentials);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      setAuth(true, response.user ?? null);
      setNotification({ message: 'Registration successful!', type: 'success' });
      setTimeout(() => {
        navigate(ROUTES.HOME);
      }, 1500);
    } catch {
      setNotification({ message: 'Registration failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return {
    isAuthenticated,
    currentUser,
    loading,
    login,
    register,
    logout,
    notification,
    setNotification,
  };
};

export default useAuth;
