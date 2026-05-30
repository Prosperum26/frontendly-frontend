import { useState, useEffect } from 'react';
import { learningService } from '../services/learning.service';
import type { Progress } from '../types/learning-path.types';

export const useLearningProgress = () => {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const data = await learningService.fetchProgress();
        setProgress(data);
      } catch (error) {
        console.error('Failed to load progress:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  return { progress, loading };
};

export default useLearningProgress;
