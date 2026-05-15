import React from 'react';

interface LevelBadgeProps {
  level: number;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({ level }) => {
  return (
    <div className="level-badge">
      <span className="level-number">{level}</span>
      <span className="level-text">Lvl</span>
    </div>
  );
};

export default LevelBadge;
