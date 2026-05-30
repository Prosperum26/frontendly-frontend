import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  stage_progress?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  isAuthChecking: boolean;
  previousRoute: string | null;
  setAuth: (isAuthenticated: boolean, user: User | null) => void;
  logout: () => void;
  setAuthChecking: (isChecking: boolean) => void;
  setPreviousRoute: (route: string | null) => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('accessToken'),
  currentUser: null,
  isAuthChecking: true,
  previousRoute: null,
  setAuth: (isAuthenticated, currentUser) => set({ isAuthenticated, currentUser, isAuthChecking: false }),
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ isAuthenticated: false, currentUser: null, isAuthChecking: false, previousRoute: null });
  },
  setAuthChecking: (isChecking) => set({ isAuthChecking: isChecking }),
  setPreviousRoute: (route) => set({ previousRoute: route }),
  updateUser: (user) => set({ currentUser: user }),
}));
