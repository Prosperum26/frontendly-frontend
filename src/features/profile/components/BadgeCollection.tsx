import React from 'react';
import type { Badge } from '../types/profile.types';

interface BadgeCollectionProps {
  badges: Badge[];
}

export const BadgeCollection: React.FC<BadgeCollectionProps> = ({ badges }) => {
  return (
    <div className="badge-collection">
      <h3>Badges</h3>
      <div className="badges-grid">
        {badges.map((badge, idx) => (
          <div key={typeof badge.id === 'string' ? badge.id : `badge-${idx}`} className="badge-item">
            <div className="badge-icon">{badge.icon}</div>
            <p>{badge.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgeCollection;
