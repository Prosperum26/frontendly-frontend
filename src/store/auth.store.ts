import { create } from 'zustand';

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
}));
