import api from '../../../services/api';
import type {
  EntranceTestQuestion,
  EntranceTestResult,
  LearningPathLesson,
} from '../types/entrance-test.types';

function unwrap<T>(payload: T | { success: boolean; data: T }): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export const entranceTestService = {
  async getQuestions(): Promise<EntranceTestQuestion[]> {
    const response = await api.get<
      EntranceTestQuestion[] | { success: boolean; data: EntranceTestQuestion[] }
    >('/entrance-test/questions');
    return unwrap(response.data);
  },

  async submitTest(answers: Record<string, unknown>): Promise<EntranceTestResult> {
    const response = await api.post<
      EntranceTestResult | { success: boolean; data: EntranceTestResult }
    >('/entrance-test/submit', { answers });
    return unwrap(response.data);
  },

  async syncPlacementTest(payload: {
    skipToMilestoneId: string;
    skillId?: string;
    learningPath?: LearningPathLesson[];
    studyPlan?: string[];
  }): Promise<{
    placementTestCompleted: boolean;
    skipToMilestoneId: string;
    studyPlan: string[];
    xpEarned?: number;
    autoPassedCount?: number;
  }> {
    const response = await api.post<
      | { placementTestCompleted: boolean; skipToMilestoneId: string; studyPlan: string[] }
      | {
          success: boolean;
          data: { placementTestCompleted: boolean; skipToMilestoneId: string; studyPlan: string[] };
        }
    >('/learning-content/sync-placement-test', payload);
    return unwrap(response.data);
  },
};

export default entranceTestService;
