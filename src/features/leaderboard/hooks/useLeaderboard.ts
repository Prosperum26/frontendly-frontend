import { useState, useEffect } from 'react';
import { leaderboardService } from '../services/leaderboard.service';
import type { LeaderboardEntry } from '../types/leaderboard.types';

export const useLeaderboard = (page: number = 1) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await leaderboardService.fetchLeaderboard(page);
        setEntries(data);
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [page]);

  return { entries, loading };
};

export default useLeaderboard;
