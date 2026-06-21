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
          'bg-gradient-to-t from-yellow-700 to-yellow-500', // 2nd
          'bg-gradient-to-t from-yellow-600 to-yellow-400', // 1st
          'bg-gradient-to-t from-yellow-800 to-yellow-600' // 3rd
        ];

        return (
          <div key={entry.id} className="flex flex-col items-center gap-3 flex-1">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-slate-800">#{placeNumber}</span>
              <Avatar src={entry.avatar} alt={entry.username} size="xl" className="border-4 border-white shadow-md" />
              <span className="mt-2 font-semibold text-slate-800 text-center">{entry.username}</span>
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-indigo-600">Level {entry.level}</span> • {entry.xp} XP
              </div>
            </div>
            <div className={`w-full ${heights[index]} rounded-t-3xl ${colors[index]} shadow-lg flex items-end justify-center pb-4`}>
              {/* Podium step */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Podium;
