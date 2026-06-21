import api from '../../../services/api';
import type { EntranceTestQuestion, EntranceTestResult } from '../types/entrance-test.types';

const FALLBACK_QUESTIONS: EntranceTestQuestion[] = [
  {
    id: 'html-semantics',
    question: 'Which element should wrap the primary page navigation?',
    type: 'single-choice',
    options: ['nav', 'section', 'article', 'aside'],
  },
  {
    id: 'css-layout',
    question: 'Which CSS feature is best suited for a two-dimensional page layout?',
    type: 'single-choice',
    options: ['CSS Grid', 'line-height', 'z-index', 'text-transform'],
  },
  {
    id: 'react-props',
    question: 'In React, what is the usual way to pass data from a parent to a child component?',
    type: 'single-choice',
    options: ['Props', 'Cookies', 'LocalStorage', 'DOM attributes only'],
  },
];

function unwrap<T>(payload: T | { success: boolean; data: T }): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export const entranceTestService = {
  async getQuestions(): Promise<EntranceTestQuestion[]> {
    try {
      const response = await api.get<
        EntranceTestQuestion[] | { success: boolean; data: EntranceTestQuestion[] }
      >('/entrance-test/questions');
      return unwrap(response.data);
    } catch {
      return FALLBACK_QUESTIONS;
    }
  },

  async submitTest(answers: Record<string, unknown>): Promise<EntranceTestResult> {
    try {
      const response = await api.post<
        EntranceTestResult | { success: boolean; data: EntranceTestResult }
      >('/entrance-test/submit', { answers });
      return unwrap(response.data);
    } catch {
      return {
        skipToMilestoneId: Object.keys(answers).length >= FALLBACK_QUESTIONS.length ? 'm2' : 'm1',
        skillId: 'frontend',
      };
    }
  },
};

export default entranceTestService;
