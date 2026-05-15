import { useState, useEffect } from 'react';
import { learningService } from '../services/learning.service';
import type { Milestone } from '../types/learning-path.types';

export const useLoadMilestones = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMilestones = async () => {
      try {
        const data = await learningService.fetchRoadmap();
        setMilestones(data);
      } catch (error) {
        console.error('Failed to load milestones:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMilestones();
  }, []);

  return { milestones, loading };
};

export default useLoadMilestones;
