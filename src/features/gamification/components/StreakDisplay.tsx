import React from 'react';

interface StreakDisplayProps {
  streak: number;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ streak }) => {
  return (
    <div className="streak-display">
      <span className="streak-icon">🔥</span>
      <span className="streak-count">{streak}</span>
      <span className="streak-text">day streak</span>
    </div>
  );
};

export default StreakDisplay;
