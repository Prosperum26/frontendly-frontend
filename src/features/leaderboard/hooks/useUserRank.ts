import { useState, useEffect } from 'react';
import { leaderboardService } from '../services/leaderboard.service';

export const useUserRank = (userId: string) => {
  const [rank, setRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRank = async () => {
      try {
        const data = await leaderboardService.fetchUserRank(userId);
        setRank(data);
      } catch (error) {
        console.error('Failed to load user rank:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRank();
  }, [userId]);

  return { rank, loading };
};

export default useUserRank;
