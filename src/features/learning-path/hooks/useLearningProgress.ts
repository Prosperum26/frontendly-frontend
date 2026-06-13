import { useState } from 'react';
import type { Progress } from '../types/learning-path.types';

export const useLearningProgress = () => {
  const [progress] = useState<Progress[]>([]);
  const loading = false;

  return { progress, loading };
};

export default useLearningProgress;
