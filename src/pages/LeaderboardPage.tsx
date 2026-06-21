import React from 'react';
import { LeaderboardTable } from '../features/leaderboard/components/LeaderboardTable';
import { useLeaderboard } from '../features/leaderboard/hooks/useLeaderboard';
import { Podium } from '../features/leaderboard/components/Podium';
import { Loader } from '../components/Loader';
import { useUserRank } from '../features/leaderboard/hooks/useUserRank';
import { useAuthStore } from '../store/auth.store';

export const LeaderboardPage: React.FC = () => {
  const { entries, loading, error } = useLeaderboard();
  const currentUser = useAuthStore(state => state.currentUser);
  const { data: userRank } = useUserRank(currentUser?.id);

  const topThree = entries.slice(0, 3);
  const remainingEntries = entries.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight sm:text-5xl">
            Leaderboard
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            See how you rank against other learners
          </p>
        </div>

        {userRank && currentUser && (
          <div className="mb-8 max-w-md mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Your Rank</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">#{userRank}</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader size="lg" />
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-2xl p-8 text-center max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">Failed to load leaderboard</h3>
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : (
          <div className="space-y-12">
            {topThree.length > 0 && <Podium topThree={topThree} />}
            {remainingEntries.length > 0 && (
              <LeaderboardTable entries={remainingEntries} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
