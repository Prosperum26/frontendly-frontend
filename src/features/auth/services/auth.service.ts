import api from '../../../services/api';
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
    await api.post('/auth/logout');
  },

  async refreshToken(): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/refresh');
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<{ message: string; user: User }>('/users/me');
    return response.data.user;
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
