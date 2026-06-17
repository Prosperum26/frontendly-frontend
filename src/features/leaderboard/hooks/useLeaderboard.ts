import { useState, useEffect } from 'react';
import { leaderboardService } from '../services/leaderboard.service';
import type { LeaderboardEntry } from '../types/leaderboard.types';
import axios from 'axios';

export const useLeaderboard = (page: number = 1) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await leaderboardService.fetchLeaderboard(page);
        setEntries(data);
        setError(null);
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          // Don't redirect on 401 for leaderboard - it should be public
          setError('Leaderboard data unavailable. Please try again later.');
        } else {
          setError('Failed to load leaderboard. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [page]);

  return { entries, loading, error };
};

export default useLeaderboard;
