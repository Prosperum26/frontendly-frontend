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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-lg shadow-indigo-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 tracking-tight sm:text-5xl mb-4">
            Leaderboard
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            See how you rank against other learners
          </p>
        </div>

        {userRank && currentUser && (
          <div className="mb-8 max-w-md mx-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-indigo-200 dark:border-indigo-800/50 ring-1 ring-indigo-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Your Rank</h3>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  #{userRank}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader size="lg" />
          </div>
        ) : error ? (
          <div className="bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-800/50 rounded-2xl p-8 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
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
