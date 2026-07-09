
import { create } from 'zustand';
import type { User } from '../features/auth/types/auth.types';
import { normalizeUser } from '../features/auth/utils/normalizeUser';

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
  isAuthenticated: false, // Will be determined by API call
  currentUser: null,
  isAuthChecking: true,
  previousRoute: null,

  setAuth: (isAuthenticated, currentUser) => {
    const normalizedUser = currentUser ? normalizeUser(currentUser) : null;
    set({ isAuthenticated, currentUser: normalizedUser, isAuthChecking: false });
  },

  logout: () => {
    // Tokens are cleared via HttpOnly cookies by backend logout endpoint
    set({ isAuthenticated: false, currentUser: null, isAuthChecking: false, previousRoute: null });
  },

  setAuthChecking: (isChecking) => set({ isAuthChecking: isChecking }),
  setPreviousRoute: (route) => set({ previousRoute: route }),

  updateUser: (user) => {
    const normalizedUser = normalizeUser(user);
    set({ currentUser: normalizedUser });
  },
}));
