import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { ENV } from '../config/env';
import { authService } from '../features/auth/services/auth.service';
import { useAuthStore } from '../store/auth.store';

const api = axios.create({
  baseURL: ENV.API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

interface ErrorResponseData {
  message?: string;
}

api.interceptors.request.use(
  (config) => {
    // Tokens are now sent via HttpOnly cookies, no need to manually add Authorization header
    // Cookies are automatically sent by the browser
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 403) {
      const data = error.response.data as ErrorResponseData;
      const isBanError = data.message?.toLowerCase().includes('banned');

      if (isBanError) {
        // Tokens are cleared via HttpOnly cookies by backend
        window.location.href = '/banned';
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push(() => {
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token is now handled by HttpOnly cookie, just call the endpoint
        await authService.refreshToken();
        // Tokens are automatically set in HttpOnly cookies by the backend

        refreshSubscribers.forEach((callback) => callback());
        refreshSubscribers = [];

        return api(originalRequest);
      } catch (refreshError) {
        const { logout } = useAuthStore.getState();
        logout();

        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
