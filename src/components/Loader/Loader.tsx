import React from 'react';
import { cn } from '../../utils/cn';
import './Loader.css';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', className }) => {
  return (
    <div className={cn('loader', `loader--${size}`, className)}>
      <div className="loader-spinner" />
    </div>
  );
};

export default Loader;
