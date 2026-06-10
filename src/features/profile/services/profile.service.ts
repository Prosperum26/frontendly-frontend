import api from '../../../services/api';
import type { UserProfile, Badge, ActivityLog } from '../types/profile.types';

export const profileService = {
  async fetchProfile(): Promise<UserProfile> {
    const response = await api.get<{ success: boolean; data: UserProfile }>('/users/me');
    return response.data.data;
  },

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await api.patch<{ success: boolean; data: UserProfile }>('/users/me', data);
    return response.data.data;
  },

  async fetchBadges(): Promise<Badge[]> {
    const response = await api.get<{ success: boolean; data: { badges: Badge[] } | Badge[] }>('/users/badges');
    const data = response.data.data;
    return Array.isArray(data) ? data : (data?.badges || []);
  },

  async fetchActivity(): Promise<ActivityLog[]> {
    const response = await api.get<{ success: boolean; data: ActivityLog[] }>('/users/activity');
    return response.data.data;
  },

  async fetchActivityStats(): Promise<Array<{ date: string; count: number }>> {
    const response = await api.get<{ success: boolean; data: Array<{ date: string; count: number }> }>('/users/activity/stats');
    return response.data.data;
  },
};

export default profileService;
