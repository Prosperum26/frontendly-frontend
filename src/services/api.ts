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

let refreshSubscribers: ((token: string) => void)[] = [];



// Request interceptor to attach JWT

api.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem('accessToken');

    if (token) {

      config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

  },

  (error) => Promise.reject(error)

);



// Response interceptor for 401 handling with silent refresh

api.interceptors.response.use(

  (response) => response,

  async (error: AxiosError) => {

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };



    // Handle 403 Forbidden - Only redirect to /banned if it's an actual ban
    if (error.response?.status === 403) {
      // Check if it's a ban error
      const data = error.response.data as { message?: string };
      const isBanError = data.message?.toLowerCase().includes('banned');
      
      if (isBanError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/banned';
      }
      return Promise.reject(error);
    }



    // Handle 401 Unauthorized - Try silent refresh

    if (error.response?.status === 401 && !originalRequest._retry) {

      if (isRefreshing) {

        // Wait for the refresh to complete

        return new Promise((resolve) => {

          refreshSubscribers.push((token: string) => {

            originalRequest.headers.Authorization = `Bearer ${token}`;

            resolve(api(originalRequest));

          });

        });

      }



      originalRequest._retry = true;

      isRefreshing = true;



      try {

        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {

          throw new Error('No refresh token available');

        }



        const response = await authService.refreshToken();

        const { accessToken, refreshToken: newRefreshToken, user } = response;



        localStorage.setItem('accessToken', accessToken);

        localStorage.setItem('refreshToken', newRefreshToken);



        // Update auth store with new user data

        const { setAuth } = useAuthStore.getState();

        setAuth(true, user ?? null);



        // Retry all pending requests with new token

        refreshSubscribers.forEach((callback) => callback(accessToken));

        refreshSubscribers = [];



        // Retry the original request

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);

      } catch (refreshError) {

        // Refresh failed - clear tokens and redirect to login

        localStorage.removeItem('accessToken');

        localStorage.removeItem('refreshToken');



        const { logout } = useAuthStore.getState();

        logout();



        window.location.href = '/login';

        return Promise.reject(refreshError);

      } finally {

        isRefreshing = false;

      }

    }



    return Promise.reject(error);

  }

);



export default api;

