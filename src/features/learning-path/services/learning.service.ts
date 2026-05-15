import api from '../../../services/api';
import type { Milestone, Progress } from '../types/learning-path.types';

export const learningService = {
  async fetchRoadmap(): Promise<Milestone[]> {
    const response = await api.get<Milestone[]>('/learning/roadmap');
    return response.data;
  },

  async updateProgress(progress: Progress): Promise<void> {
    await api.post('/learning/progress', progress);
  },

  async fetchProgress(): Promise<Progress[]> {
    const response = await api.get<Progress[]>('/learning/progress');
    return response.data;
  },
};

export default learningService;
