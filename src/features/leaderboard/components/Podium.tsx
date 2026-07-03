import React from 'react';
import type { LeaderboardEntry } from '../types/leaderboard.types';
import { Avatar } from '../../../components/Avatar';

interface PodiumProps {
  topThree: LeaderboardEntry[];
}

export const Podium: React.FC<PodiumProps> = ({ topThree }) => {
  // Reorder to 2nd, 1st, 3rd for podium
  const ordered = [topThree[1], topThree[0], topThree[2]].filter(Boolean);

  return (
    <div className="flex justify-center items-end gap-4 max-w-4xl mx-auto py-8">
      {ordered.map((entry, index) => {
        const heights = ['h-40', 'h-56', 'h-36'];
        const placeNumber = index === 0 ? 2 : index === 1 ? 1 : 3;
        const colors = [
          'bg-gradient-to-t from-slate-400 via-slate-300 to-slate-200 dark:from-slate-600 dark:via-slate-500 dark:to-slate-400', // 2nd
          'bg-gradient-to-t from-amber-400 via-yellow-300 to-amber-200 dark:from-amber-500 dark:via-yellow-400 dark:to-amber-300', // 1st
          'bg-gradient-to-t from-orange-400 via-orange-300 to-orange-200 dark:from-orange-600 dark:via-orange-500 dark:to-orange-400' // 3rd
        ];
        const shadows = [
          'shadow-xl shadow-slate-500/30 dark:shadow-slate-600/30',
          'shadow-2xl shadow-amber-500/40 dark:shadow-amber-600/40',
          'shadow-xl shadow-orange-500/30 dark:shadow-orange-600/30'
        ];

        return (
          <div key={entry.id} className="flex flex-col items-center gap-3 flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 font-bold text-lg ${
                placeNumber === 1 
                  ? 'bg-gradient-to-br from-amber-400 to-yellow-300 text-amber-900 dark:from-amber-500 dark:to-yellow-400 dark:text-amber-100 shadow-lg shadow-amber-500/30' 
                  : placeNumber === 2 
                  ? 'bg-gradient-to-br from-slate-400 to-slate-300 text-slate-900 dark:from-slate-500 dark:to-slate-400 dark:text-slate-100 shadow-md shadow-slate-500/30'
                  : 'bg-gradient-to-br from-orange-400 to-orange-300 text-orange-900 dark:from-orange-500 dark:to-orange-400 dark:text-orange-100 shadow-md shadow-orange-500/30'
              }`}>
                #{placeNumber}
              </div>
              <Avatar src={entry.avatar} alt={entry.username} size="xl" className="border-4 border-white dark:border-slate-700 shadow-xl" />
              <span className="mt-2 font-semibold text-slate-900 dark:text-slate-100 text-center text-lg">{entry.username}</span>
              <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <span className={`font-semibold px-2 py-0.5 rounded-full ${
                  placeNumber === 1 
                    ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300' 
                    : placeNumber === 2 
                    ? 'bg-slate-100 dark:bg-slate-700/50 text-slate-800 dark:text-slate-300'
                    : 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300'
                }`}>
                  Level {entry.level}
                </span>
                <span className="text-slate-500 dark:text-slate-500">•</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{entry.xp.toLocaleString()} XP</span>
              </div>
            </div>
            <div className={`w-full ${heights[index]} rounded-t-3xl ${colors[index]} ${shadows[index]} flex items-end justify-center pb-4 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent dark:from-black/20 dark:to-transparent" />
              <span className="relative text-2xl font-bold text-white/90 dark:text-white/80 drop-shadow-sm">
                {placeNumber === 1 ? '🥇' : placeNumber === 2 ? '🥈' : '🥉'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Podium;
