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
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden max-w-5xl mx-auto">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 w-20">Rank</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">User</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700 dark:text-slate-300 w-28">Level</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700 dark:text-slate-300 w-32">XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {entries.map((entry) => {
              const isCurrentUser = entry.id === currentUser?.id;
              return (
                <tr
                  key={entry.id}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${isCurrentUser ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-bold text-lg ${isCurrentUser ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      #{entry.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar src={entry.avatar} alt={entry.username} size="md" />
                      <div>
                        <p className={`font-medium ${isCurrentUser ? 'text-indigo-800 dark:text-indigo-300' : 'text-slate-900 dark:text-slate-100'}`}>
                          {entry.username}
                          {isCurrentUser && <span className="ml-2 text-xs font-medium text-indigo-600 dark:text-indigo-400">(You)</span>}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-sm font-semibold">
                      Lv {entry.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{entry.xp.toLocaleString()} XP</span>
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
