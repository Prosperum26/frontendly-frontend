import React from 'react';
import { cn } from '../../utils/cn';
import './Avatar.css';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fallback?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  className,
  fallback,
}) => {
  return (
    <div className={cn('avatar', `avatar--${size}`, className)}>
      {src ? (
        <img src={src} alt={alt} className="avatar-image" />
      ) : (
        <span className="avatar-fallback">{fallback || '?'}</span>
      )}
    </div>
  );
};

export default Avatar;
