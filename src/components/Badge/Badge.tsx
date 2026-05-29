import React from 'react';
import { cn } from '../../utils/cn';
import './Badge.css';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
}) => {
  return (
    <span className={cn('badge', `badge--${variant}`, className)}>
      {children}
    </span>
  );
};

export default Badge;
