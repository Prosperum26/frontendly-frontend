import api from '../../../services/api';
import type { LoginCredentials, RegisterCredentials, LoginResponse, User } from '../types/auth.types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/v1/auth/login', credentials);
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/v1/auth/register', credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/v1/auth/logout');
  },

  async refreshToken(): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/v1/auth/refresh');
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/v1/auth/me');
    return response.data;
  },
};

export default authService;
