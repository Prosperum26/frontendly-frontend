import { useState, useEffect } from 'react';
import { learningService } from '../services/learning.service';
import { DEFAULT_SKILL_ID } from '../utils/roadmapMappers';
import type { Milestone } from '../types/learning-path.types';

export const useLoadMilestones = (skillId: string = DEFAULT_SKILL_ID) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMilestones = async () => {
      try {
        const response = await learningService.fetchFullRoadmap(skillId);
        const mapped = learningService.mapRoadmapResponse(response);
        setMilestones(mapped?.milestones ?? []);
      } catch (error) {
        console.error('Failed to load milestones:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMilestones();
  }, [skillId]);

  return { milestones, loading };
};

export default useLoadMilestones;
