import api from '../../../services/api';
import type { ChallengeExercise } from '../types/challenge.types';

function unwrap<T>(payload: T | { success: boolean; data: T }): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export const challengeService = {
  async getChallenges(): Promise<ChallengeExercise[]> {
    const response = await api.get<
      ChallengeExercise[] | { success: boolean; data: ChallengeExercise[] }
    >('/challenge/exercises');
    return unwrap(response.data);
  },
};

export default challengeService;
