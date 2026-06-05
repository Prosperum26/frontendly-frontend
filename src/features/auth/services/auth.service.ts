import api from '../../../services/api';
import type { LoginCredentials, RegisterCredentials, LoginResponse } from '../types/auth.types';

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
};

export default authService;
