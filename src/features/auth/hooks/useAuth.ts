import { useState } from 'react';
import { useAuthStore } from '../../../store/auth.store';
import { authService } from '../services/auth.service';
import type { LoginCredentials, RegisterCredentials } from '../types/auth.types';

export const useAuth = () => {
  const { isAuthenticated, currentUser, setAuth, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      setAuth(true, response.user ?? null);
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
