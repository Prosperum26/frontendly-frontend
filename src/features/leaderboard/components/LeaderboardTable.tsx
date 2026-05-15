import React from 'react';
import type { LeaderboardEntry } from '../types/leaderboard.types';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries }) => {
  return (
    <table className="leaderboard-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>User</th>
          <th>Level</th>
          <th>XP</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr key={entry.id}>
            <td>{entry.rank}</td>
            <td>
              <div className="user-info">
                {entry.avatar && <img src={entry.avatar} alt={entry.username} />}
                <span>{entry.username}</span>
              </div>
            </td>
            <td>{entry.level}</td>
            <td>{entry.xp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeaderboardTable;
