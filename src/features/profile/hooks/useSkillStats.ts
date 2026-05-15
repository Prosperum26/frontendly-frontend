import { useState, useEffect } from 'react';
import { profileService } from '../services/profile.service';
import type { Badge } from '../types/profile.types';

export const useSkillStats = (userId: string) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBadges = async () => {
      try {
        const data = await profileService.fetchBadges(userId);
        setBadges(data);
      } catch (error) {
        console.error('Failed to load badges:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBadges();
  }, [userId]);

  return { badges, loading };
};

export default useSkillStats;
