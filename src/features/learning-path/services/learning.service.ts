import api from "../../../services/api";
import type {
  Milestone,
  Progress,
  RoadmapResponse,
} from "../types/learning-path.types";

export const learningService = {
  async fetchRoadmap(
    skillId: string,
    page: number = 1,
    limit: number = 5,
  ): Promise<RoadmapResponse> {
    const response = await api.get<RoadmapResponse>(`/roadmaps/${skillId}`, {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  },

  async updateProgress(progress: Progress): Promise<void> {
    await api.post("/learning/progress", progress);
  },

  async fetchProgress(): Promise<Progress[]> {
    const response = await api.get<Progress[]>("/learning/progress");
    return response.data;
  },
};

export default learningService;
