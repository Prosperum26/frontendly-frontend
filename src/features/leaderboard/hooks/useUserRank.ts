import { useState, useEffect } from 'react';
import { leaderboardService } from '../services/leaderboard.service';

export const useUserRank = (userId?: string) => {
  const [data, setData] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadRank = async () => {
      try {
        setLoading(true);
        setError(null);
        const rankData = await leaderboardService.fetchUserRank(userId);
        setData(rankData);
      } catch (err) {
        console.error('Failed to load user rank:', err);
        setError('Failed to load user rank');
      } finally {
        setLoading(false);
      }
    };

    loadRank();
  }, [userId]);

  return { data, loading, error };
};

export default useUserRank;
