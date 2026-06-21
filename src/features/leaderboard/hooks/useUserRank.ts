import { useState, useEffect } from 'react';
import { leaderboardService } from '../services/leaderboard.service';

export const useUserRank = (userId?: string) => {
  const [data, setData] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      return;
    }

    let cancelled = false;

    const loadRank = async () => {
      try {
        setLoading(true);
        setError(null);
        const rankData = await leaderboardService.fetchUserRank(userId);
        if (!cancelled) {
          setData(rankData);
        }
      } catch (err) {
        console.error('Failed to load user rank:', err);
        if (!cancelled) {
          setError('Failed to load user rank');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadRank();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { data, loading, error };
};

export default useUserRank;
