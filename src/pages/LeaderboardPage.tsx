import React from 'react';
import { LeaderboardTable } from '../features/leaderboard/components/LeaderboardTable';
import { useLeaderboard } from '../features/leaderboard/hooks/useLeaderboard';

export const LeaderboardPage: React.FC = () => {
  const { entries, loading, error } = useLeaderboard();

  return (
    <div className="leaderboard-page" style={{ padding: '24px' }}>
      <h1>Leaderboard</h1>
      <p>See how you rank against others</p>
      {loading ? (
        <p>Loading leaderboard...</p>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      ) : (
        <LeaderboardTable entries={entries} />
      )}
    </div>
  );
};

export default LeaderboardPage;
