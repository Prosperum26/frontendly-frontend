import { useState } from 'react';
import { useAuthStore } from '../../../store/auth.store';
import { authService } from '../services/auth.service';
import type { LoginCredentials, RegisterCredentials } from '../types/auth.types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { useToast } from '../../../components/Toast';

export const useAuth = () => {
  const { isAuthenticated, currentUser, setAuth, logout } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      setAuth(true, response.user ?? null);
      addToast('Login Successful', 'You have been successfully logged in.', 'success');
      setTimeout(() => {
        navigate(ROUTES.HOME);
      }, 1500);
    } catch (error: any) {
      if (error.response?.status === 429) {
        const retryAfter = error.response?.data?.retryAfter || 15;
        addToast('Too Many Attempts', `Too many login attempts. Please try again in ${retryAfter} minutes.`, 'alert');
      } else {
        addToast('Login Failed', 'Invalid login credentials. Please check your email or password and try again.', 'error');
      }
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
      addToast('Registration Successful', 'Your account has been created successfully.', 'success');
      setTimeout(() => {
        navigate(ROUTES.HOME);
      }, 1500);
    } catch {
      addToast('Registration Failed', 'Unable to create your account. Please try again.', 'error');
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
  };
};

export default useAuth;
