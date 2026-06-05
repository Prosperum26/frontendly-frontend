import { create } from 'zustand';
import api from '../services/api'; // Đã sửa lại thành { api }

interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  setAuth: (isAuthenticated: boolean, user: User | null) => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('accessToken'),
  currentUser: null,
  setAuth: (isAuthenticated, currentUser) => set({ isAuthenticated, currentUser }),
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ isAuthenticated: false, currentUser: null });
  },
  
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('accessToken', res.data.token);
      set({ isAuthenticated: true });
    }
  },

  register: async (email, name, password) => {
    await api.post('/auth/register', { email, name, password });
  }
}));