import api from '../../../services/api';
import type { ChallengeExercise } from '../types/challenge.types';

const FALLBACK_CHALLENGES: ChallengeExercise[] = [
  {
    id: 'exercise_s1',
    title: 'Semantic HTML Starter',
    description: 'Build a clear page structure with headings, content sections, and useful labels.',
    difficulty: 'easy',
    tags: ['HTML', 'Semantics'],
    previewImage:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=520&fit=crop',
  },
  {
    id: 'exercise_s3',
    title: 'Responsive Card Layout',
    description: 'Create a responsive card grid using modern CSS layout primitives.',
    difficulty: 'medium',
    tags: ['CSS', 'Grid', 'Responsive'],
    previewImage:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=520&fit=crop',
  },
  {
    id: 'exercise_s7',
    title: 'Interactive React Component',
    description: 'Practice JSX, props, and state with a reusable interactive component.',
    difficulty: 'hard',
    tags: ['React', 'JSX', 'State'],
    previewImage:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=520&fit=crop',
  },
];

function unwrap<T>(payload: T | { success: boolean; data: T }): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export const challengeService = {
  async getChallenges(): Promise<ChallengeExercise[]> {
    try {
      const response = await api.get<
        ChallengeExercise[] | { success: boolean; data: ChallengeExercise[] }
      >('/challenge/exercises');
      return unwrap(response.data);
    } catch {
      return FALLBACK_CHALLENGES;
    }
  },
};

export default challengeService;
