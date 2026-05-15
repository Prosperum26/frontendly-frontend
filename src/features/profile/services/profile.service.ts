import api from '../../../services/api';
import type { UserProfile, Badge, ActivityLog } from '../types/profile.types';

export const profileService = {
  async fetchProfile(userId: string): Promise<UserProfile> {
    const response = await api.get<UserProfile>(`/profile/${userId}`);
    return response.data;
  },

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await api.put<UserProfile>('/profile', data);
    return response.data;
  },

  async fetchBadges(userId: string): Promise<Badge[]> {
    const response = await api.get<Badge[]>(`/profile/${userId}/badges`);
    return response.data;
  },

  async fetchActivity(userId: string): Promise<ActivityLog[]> {
    const response = await api.get<ActivityLog[]>(`/profile/${userId}/activity`);
    return response.data;
  },
};

export default profileService;
