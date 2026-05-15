import React from 'react';
import { cn } from '../../utils/cn';
import './ProgressBar.css';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className,
  showLabel = false,
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn('progress-bar-wrapper', className)}>
      {showLabel && <span className="progress-bar-label">{value}/{max}</span>}
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
