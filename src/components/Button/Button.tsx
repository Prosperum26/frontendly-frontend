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
  const tailwindBase = 'px-6 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center transition duration-150';

  return (
    <button
      className={cn('button', `button--${variant}`, `button--${size}`, tailwindBase, tailwindVariants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;