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
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden max-w-5xl mx-auto">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 w-20">Rank</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">User</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700 w-28">Level</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700 w-32">XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.map((entry) => {
              const isCurrentUser = entry.id === currentUser?.id;
              return (
                <tr
                  key={entry.id}
                  className={`hover:bg-slate-50 transition-colors ${isCurrentUser ? 'bg-indigo-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-bold text-lg ${isCurrentUser ? 'text-indigo-600' : 'text-slate-700'}`}>
                      #{entry.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar src={entry.avatar} alt={entry.username} size="md" />
                      <div>
                        <p className={`font-medium ${isCurrentUser ? 'text-indigo-800' : 'text-slate-900'}`}>
                          {entry.username}
                          {isCurrentUser && <span className="ml-2 text-xs font-medium text-indigo-600">(You)</span>}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-semibold">
                      Lv {entry.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="font-semibold text-slate-800">{entry.xp.toLocaleString()} XP</span>
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
