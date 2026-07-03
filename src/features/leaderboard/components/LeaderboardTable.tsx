import React from 'react';
import type { LeaderboardEntry } from '../types/leaderboard.types';
import { Avatar } from '../../../components/Avatar';
import { useAuthStore } from '../../../store/auth.store';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries }) => {
  const currentUser = useAuthStore(state => state.currentUser);

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-800/50 ring-1 ring-indigo-500/20 overflow-hidden max-w-5xl mx-auto">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-b border-indigo-200 dark:border-indigo-800/50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider w-20">Rank</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider w-28">Level</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider w-32">XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-100 dark:divide-indigo-800/30">
            {entries.map((entry) => {
              const isCurrentUser = entry.id === currentUser?.id;
              return (
                <tr
                  key={entry.id}
                  className={`hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all duration-200 ${isCurrentUser ? 'bg-gradient-to-r from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/40 dark:to-purple-900/40' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-bold text-lg ${isCurrentUser ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      #{entry.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar src={entry.avatar} alt={entry.username} size="md" />
                      <div>
                        <p className={`font-medium ${isCurrentUser ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400' : 'text-slate-900 dark:text-slate-100'}`}>
                          {entry.username}
                          {isCurrentUser && <span className="ml-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full">You</span>}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-800 dark:text-indigo-300 text-sm font-semibold shadow-sm">
                      Lv {entry.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`font-semibold ${isCurrentUser ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {entry.xp.toLocaleString()} XP
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;
