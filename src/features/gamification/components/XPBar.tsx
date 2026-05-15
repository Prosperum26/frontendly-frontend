import React from 'react';
import { ProgressBar } from '../../../components/ProgressBar';

interface XPBarProps {
  currentXP: number;
  maxXP: number;
}

export const XPBar: React.FC<XPBarProps> = ({ currentXP, maxXP }) => {
  return (
    <div className="xp-bar">
      <span className="xp-label">XP: {currentXP}/{maxXP}</span>
      <ProgressBar value={currentXP} max={maxXP} showLabel={false} />
    </div>
  );
};

export default XPBar;
