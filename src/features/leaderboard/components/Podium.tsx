import React from 'react';
import type { LeaderboardEntry } from '../types/leaderboard.types';

interface PodiumProps {
  topThree: LeaderboardEntry[];
}

export const Podium: React.FC<PodiumProps> = ({ topThree }) => {
  return (
    <div className="podium">
      {topThree.map((entry, index) => (
        <div key={entry.id} className={`podium-place podium-place--${index + 1}`}>
          <div className="podium-avatar">{entry.avatar ? <img src={entry.avatar} /> : entry.username[0]}</div>
          <div className="podium-name">{entry.username}</div>
          <div className="podium-rank">{entry.rank}</div>
        </div>
      ))}
    </div>
  );
};

export default Podium;
