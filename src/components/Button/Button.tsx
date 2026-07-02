import React from 'react';
import { cn } from '../../utils/cn';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const tailwindVariants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: '', 
    outline: 'bg-main-bg text-heading border border-border hover:bg-surface',
    ghost: 'text-blue-600 hover:bg-surface'
  };
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[40px] md:min-h-[36px] sm:min-h-[32px]',
    md: 'px-6 py-3 text-sm min-h-[48px] md:min-h-[40px] sm:min-h-[36px]',
    lg: 'px-8 py-4 text-base min-h-[56px] md:min-h-[48px] sm:min-h-[42px]'
  };
  const tailwindBase = 'rounded-lg font-medium flex items-center justify-center transition duration-150';

  return (
    <button
      className={cn('button', `button--${variant}`, `button--${size}`, tailwindBase, tailwindVariants[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;