import React from 'react';
import type { LeaderboardEntry } from '../types/leaderboard.types';

interface RankRowProps {
  entry: LeaderboardEntry;
}

export const RankRow: React.FC<RankRowProps> = ({ entry }) => {
  return (
    <div className="rank-row">
      <span className="rank-number">{entry.rank}</span>
      <div className="rank-user">
        {entry.avatar && <img src={entry.avatar} alt={entry.username} />}
        <span>{entry.username}</span>
      </div>
      <span className="rank-level">{entry.level}</span>
      <span className="rank-xp">{entry.xp}</span>
      {entry.rankDelta !== undefined && (
        <span className={`rank-delta ${entry.rankDelta > 0 ? 'positive' : 'negative'}`}>
          {entry.rankDelta > 0 ? '+' : ''}{entry.rankDelta}
        </span>
      )}
    </div>
  );
};

export default RankRow;
