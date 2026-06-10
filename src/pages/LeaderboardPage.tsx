import React from 'react';
import { LeaderboardTable } from '../features/leaderboard/components/LeaderboardTable';
import { useLeaderboard } from '../features/leaderboard/hooks/useLeaderboard';

export const LeaderboardPage: React.FC = () => {
  const { entries, loading } = useLeaderboard();

  return (
    <div className="leaderboard-page" style={{ padding: '24px' }}>
      <h1>Leaderboard</h1>
      <p>See how you rank against others</p>
      {loading ? (
        <p>Loading leaderboard...</p>
      ) : (
        <LeaderboardTable entries={entries} />
      )}
    </div>
  );
};

export default LeaderboardPage;
