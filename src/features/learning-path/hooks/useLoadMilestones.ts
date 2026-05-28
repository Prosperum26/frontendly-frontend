import { useState, useEffect } from 'react';
import { learningService } from '../services/learning.service';
import type { Milestone } from '../types/learning-path.types';
import dummyRoadmap from '../../data/dummy/roadmap.json';

export const useLoadMilestones = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMilestones = async () => {
      try {
        const data = await learningService.fetchRoadmap();
        setMilestones(data);
      } catch (error) {
        console.warn('Backend fetch failed, using dummy data');
        setMilestones(dummyRoadmap as Milestone[]);
      } finally {
        setLoading(false);
      }
    };

    loadMilestones();
  }, []);

  return { milestones, loading };
};

export default useLoadMilestones;
