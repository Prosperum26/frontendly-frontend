import React from 'react';
import { cn } from '../../utils/cn';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

const ICON_LABEL: Record<ToastType, string> = {
  success: '✓',
  warning: '!',
  error: '!',
  info: 'i',
};

export interface ToastProps {
  title?: string;
  message: string;
  type?: ToastType;
  onClose?: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  title,
  message,
  type = 'info',
  onClose,
  className,
}) => {
  return (
    <div className={cn('toast', `toast--${type}`, className)} role="status">
      <div className="toast-icon" aria-hidden>
        {ICON_LABEL[type]}
      </div>
      <div className="toast-content">
        {title && <strong className="toast-title">{title}</strong>}
        <span className="toast-message">{message}</span>
      </div>
      {onClose && (
        <button type="button" className="toast-close" aria-label="Close notification" onClick={onClose}>
          x
        </button>
      )}
    </div>
  );
};

export default Toast;
