import api from '../../../services/api';
import type { UserProfile, Badge, ActivityLog } from '../types/profile.types';

interface BadgesApiResponse {
  earned: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: string | Date;
  }>;
  unearned: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
}

interface ActivityApiLog {
  _id?: string;
  id?: string;
  type: ActivityLog['type'];
  description: string;
  timestamp: string | Date | number;
}

export interface LearningProgress {
  totalLessons: number;
  completedLessons: number;
  completionPercentage: number;
  currentMilestone: string;
  isUnlocked: boolean;
}

function mapBadges(data: BadgesApiResponse | Badge[] | { badges: Badge[] } | null | undefined): Badge[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;

  if ('earned' in data && 'unearned' in data) {
    const earned = data.earned.map((badge) => ({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      earnedAt: new Date(badge.earnedAt).getTime(),
    }));
    const unearned = data.unearned.map((badge) => ({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      earnedAt: 0,
    }));
    return [...earned, ...unearned];
  }

  return data.badges ?? [];
}

function mapActivityLogs(logs: ActivityApiLog[]): ActivityLog[] {
  return logs.map((log) => ({
    id: String(log._id ?? log.id ?? ''),
    type: log.type,
    description: log.description,
    timestamp: new Date(log.timestamp).getTime(),
  }));
}

export const profileService = {
  async fetchProfile(): Promise<UserProfile> {
    const response = await api.get<{ success: boolean; data: UserProfile }>('/users/me');
    return response.data.data;
  },

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await api.patch<{ success: boolean; data: UserProfile }>('/users/me', data);
    return response.data.data;
  },

  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{ success: boolean; avatarUrl: string }>(
      '/users/me/avatar',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return response.data.avatarUrl;
  },

  async fetchBadges(): Promise<Badge[]> {
    const response = await api.get<{ success: boolean; data: BadgesApiResponse | Badge[] | { badges: Badge[] } }>(
      '/users/badges',
    );
    return mapBadges(response.data.data).filter((badge) => badge.earnedAt > 0);
  },

  async fetchActivity(): Promise<ActivityLog[]> {
    const response = await api.get<{ success: boolean; data: ActivityApiLog[] }>('/users/activity');
    return mapActivityLogs(response.data.data);
  },

  async fetchActivityStats(): Promise<Array<{ date: string; count: number }>> {
    const response = await api.get<{ success: boolean; data: Array<{ date: string; count: number }> }>(
      '/users/activity/stats',
    );
    return response.data.data;
  },

  async fetchLearningProgress(): Promise<LearningProgress> {
    const response = await api.get<{ success: boolean; data: LearningProgress }>(
      '/users/learning-progress',
    );
    return response.data.data;
  },
};

export default profileService;
