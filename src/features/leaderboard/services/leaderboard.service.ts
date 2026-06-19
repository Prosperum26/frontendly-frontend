import api from '../../../services/api';
import axios from 'axios';
import type { LeaderboardEntry } from '../types/leaderboard.types';
import { ENV } from '../../../config/env';

export const leaderboardService = {
  async fetchLeaderboard(page: number = 1, limit: number = 50): Promise<LeaderboardEntry[]> {
    try {
      const response = await api.get<{ success: boolean; data: LeaderboardEntry[] }>('/leaderboard', {
        params: { page, limit },
      });
      return response.data.data;
    } catch (error) {
      // If authenticated request fails, try without authentication
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        const publicApi = axios.create({
          baseURL: ENV.API_URL,
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const response = await publicApi.get<{ success: boolean; data: LeaderboardEntry[] }>('/leaderboard', {
          params: { page, limit },
        });
        return response.data.data;
      }
      throw error;
    }
  },

  async fetchUserRank(userId: string): Promise<number> {
    const response = await api.get<{ success: boolean; data: { rank: number } }>(`/leaderboard/${userId}/rank`);
    return response.data.data.rank;
  },
};

export default leaderboardService;
