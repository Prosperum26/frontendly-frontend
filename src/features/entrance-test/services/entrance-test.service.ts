import api from '../../../services/api';
import type { EntranceTestQuestion, EntranceTestResult } from '../types/entrance-test.types';

export const entranceTestService = {
  async getQuestions(): Promise<EntranceTestQuestion[]> {
    const response = await api.get<EntranceTestQuestion[]>('/entrance-test/questions');
    return response.data;
  },

  async submitTest(answers: Record<string, unknown>): Promise<EntranceTestResult> {
    const response = await api.post<EntranceTestResult>('/entrance-test/submit', { answers });
    return response.data;
  },
};

export default entranceTestService;
