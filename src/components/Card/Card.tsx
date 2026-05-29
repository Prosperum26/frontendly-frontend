import React from 'react';
import { cn } from '../../utils/cn';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = false,
}) => {
  return (
    <div className={cn('card', hoverable && 'card--hoverable', 'bg-white p-12 rounded-3xl border border-gray-100 shadow-sm', className)}>
      {children}
    </div>
  );
};

export default Card;