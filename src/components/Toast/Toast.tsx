import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { ToastType } from './ToastContext';

export interface ToastProps {
  title: string;
  message: string;
  type: ToastType;
  onClose?: () => void;
  className?: string;
}

const ICONS: Record<ToastType, string> = {
  success: '✅',
  error: '❌',
  alert: '⚠️',
};

export const Toast: React.FC<ToastProps> = ({
  title,
  message,
  type,
  onClose,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'fixed right-4 z-50 flex items-start gap-3 rounded-lg border-2 p-4 shadow-lg',
        'w-full max-w-[400px] md:max-w-[448px]',
        type === 'error' && 'bg-red-50 border-red-600 text-red-700',
        type === 'success' && 'bg-green-50 border-green-600 text-green-700',
        type === 'alert' && 'bg-yellow-50 border-yellow-600 text-yellow-700',
        className
      )}
      role="alert"
    >
      <span className="flex-shrink-0 text-2xl" aria-hidden>
        {ICONS[type]}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h4 className="font-semibold text-base leading-tight">{title}</h4>
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="flex-shrink-0 rounded p-1 hover:bg-black/5 transition-colors"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      )}
    </motion.div>
  );
};

export default Toast;
