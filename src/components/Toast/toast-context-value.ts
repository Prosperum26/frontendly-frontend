import { createContext } from 'react';

export type ToastType = 'success' | 'error' | 'alert' | 'warning' | 'xp' | 'badge';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: ToastType;
}

export interface ToastContextType {
  toasts: Toast[];
  addToast: (title: string, message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);
