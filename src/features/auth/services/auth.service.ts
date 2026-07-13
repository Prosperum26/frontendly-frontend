
import axios from 'axios';
import api from '../../../services/api';
import { ENV } from '../../../config/env';
import { normalizeUser } from '../utils/normalizeUser';
import type { LoginCredentials, RegisterCredentials, LoginResponse, User, GoogleLoginCredentials, ResetPasswordData } from '../types/auth.types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/register', credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    // Refresh token is now in HttpOnly cookie, backend will handle it
    await api.post('/auth/logout');
  },

  async logoutAll(): Promise<void> {
    await api.post('/auth/logout-all');
  },

  async refreshToken(): Promise<{ message: string; accessToken: string; refreshToken: string }> {
    // Send refresh token from localStorage in request body
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post<{ message: string; accessToken: string; refreshToken: string }>(
      `${ENV.API_URL}/auth/refresh-token`,
      { refreshToken },
    );
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<{ success: boolean; data: Record<string, unknown> }>('/users/me');
    return normalizeUser(response.data.data);
  },

  async googleLogin(credentials: GoogleLoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/google', credentials);
    return response.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/reset-password', data);
    return response.data;
  },
};

export default authService;
