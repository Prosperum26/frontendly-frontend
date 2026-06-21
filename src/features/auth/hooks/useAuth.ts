import { useState } from 'react';
import { AxiosError } from 'axios';
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
      
      const dailyCheckIn = response.dailyCheckIn;
      
      // Update user XP if daily check-in earned XP
      let updatedUser = response.user;
      if (dailyCheckIn?.checkedIn && updatedUser) {
        updatedUser = {
          ...updatedUser,
          xp: (updatedUser.xp || 0) + dailyCheckIn.xpEarned,
        };
      }
      
      setAuth(true, updatedUser ?? null);
      
      addToast('Login Successful', 'You have been successfully logged in.', 'success');
      
      // Show daily check-in toast if applicable
      if (dailyCheckIn?.checkedIn) {
        setTimeout(() => {
          addToast(
            'Điểm danh thành công', 
            `Bạn đã nhận được ${dailyCheckIn.xpEarned} XP! Streak hiện tại: ${dailyCheckIn.currentStreak} ngày.`, 
            'xp'
          );
        }, 1600);
      }
      
      setTimeout(() => {
        navigate(ROUTES.HOME);
      }, 1500);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 429) {
        const retryAfter =
          (error.response?.data as { retryAfter?: number } | undefined)?.retryAfter || 15;
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
      addToast('Registration Successful', response.message || 'Your account has been created successfully. Please log in.', 'success');
      navigate(ROUTES.LOGIN);
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
