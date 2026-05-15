import api from '../../../services/api';
import type { LeaderboardEntry } from '../types/leaderboard.types';

export const leaderboardService = {
  async fetchLeaderboard(page: number = 1, limit: number = 50): Promise<LeaderboardEntry[]> {
    const response = await api.get<LeaderboardEntry[]>('/leaderboard', {
      params: { page, limit },
    });
    return response.data;
  },

  async fetchUserRank(userId: string): Promise<number> {
    const response = await api.get<{ rank: number }>(`/leaderboard/${userId}/rank`);
    return response.data.rank;
  },
};

export default leaderboardService;
