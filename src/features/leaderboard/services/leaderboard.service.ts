import api from '../../../services/api';
import type { LeaderboardEntry } from '../types/leaderboard.types';

export const leaderboardService = {
  async fetchLeaderboard(page: number = 1, limit: number = 50): Promise<LeaderboardEntry[]> {
    const response = await api.get<{ success: boolean; data: LeaderboardEntry[] }>('/leaderboard', {
      params: { page, limit },
    });
    return response.data.data;
  },

  async fetchUserRank(userId: string): Promise<number> {
    const response = await api.get<{ success: boolean; data: { rank: number } }>(`/leaderboard/${userId}/rank`);
    return response.data.data.rank;
  },
};

export default leaderboardService;
