import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';

interface UserProgressResponse {
  success: boolean;
  data: {
    xp: number;
    level: number;
    xpToNextLevel: number;
    streakDays: number;
    rank?: string;
  };
}

interface UserMeResponse {
  success: boolean;
  data: {
    xp?: number;
    level?: number;
    streakDays?: number;
  };
}

export function useGamificationProfile(enabled = true) {
  const progressQuery = useQuery({
    queryKey: ['gamification-progress'],
    enabled,
    queryFn: async () => {
      const response = await api.get<UserProgressResponse>('/users/progress');
      return response.data.data;
    },
  });

  const profileQuery = useQuery({
    queryKey: ['gamification-profile'],
    enabled,
    queryFn: async () => {
      const response = await api.get<UserMeResponse>('/users/me');
      return response.data.data;
    },
  });

  const xp = progressQuery.data?.xp ?? profileQuery.data?.xp ?? 0;
  const level = progressQuery.data?.level ?? profileQuery.data?.level ?? 1;
  const xpToNextLevel = progressQuery.data?.xpToNextLevel ?? 100;
  const streakDays =
    progressQuery.data?.streakDays ?? profileQuery.data?.streakDays ?? 0;

  return {
    xp,
    level,
    xpToNextLevel,
    streakDays,
    rank: progressQuery.data?.rank,
    isLoading: progressQuery.isLoading || profileQuery.isLoading,
    refetch: async () => {
      await Promise.all([progressQuery.refetch(), profileQuery.refetch()]);
    },
  };
}

export default useGamificationProfile;
