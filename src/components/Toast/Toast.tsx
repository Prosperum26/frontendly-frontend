import React from 'react';
import { cn } from '../../utils/cn';
import './Toast.css';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onClose,
  className,
}) => {
  return (
    <div className={cn('toast', `toast--${type}`, className)}>
      <span className="toast-message">{message}</span>
      {onClose && (
        <button className="toast-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};

export default Toast;
