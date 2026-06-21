import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { ToastType } from './toast-context-value';

export interface ToastProps {
  title: string;
  message: string;
  type: ToastType;
  onClose?: () => void;
  className?: string;
}

const ICONS: Record<ToastType, React.ReactNode> = {
  success: '✅',
  error: '❌',
  alert: '⚠️',
  warning: '⚠️',
  xp: <span className="text-yellow-500 font-bold text-2xl">+XP</span>,
  badge: <span className="text-yellow-400 text-3xl">🏆</span>,
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
        'fixed right-4 z-50 flex items-start gap-3 rounded-xl border-2 p-5 shadow-2xl',
        'w-full max-w-[400px] md:max-w-[448px] backdrop-blur-sm',
        type === 'error' && 'bg-red-50 border-red-600 text-red-700',
        type === 'success' && 'bg-green-50 border-green-600 text-green-700',
        type === 'alert' && 'bg-yellow-50 border-yellow-600 text-yellow-700',
        type === 'warning' && 'bg-yellow-50 border-yellow-600 text-yellow-700',
        type === 'xp' && 'bg-gradient-to-r from-yellow-50 to-amber-50 border-amber-500 text-amber-900',
        type === 'badge' && 'bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-500 text-orange-900',
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
