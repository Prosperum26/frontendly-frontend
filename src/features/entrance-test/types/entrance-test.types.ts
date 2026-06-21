export type EntranceQuestionType = 'multiple-choice' | 'single-choice' | 'code';

export interface EntranceTestQuestion {
  id: string;
  question: string;
  type: EntranceQuestionType;
  options?: string[];
  starterCode?: {
    html?: string;
    css?: string;
    js?: string;
    jsx?: string;
  };
}

export interface EntranceTestState {
  currentQuestionIndex: number;
  answers: Record<string, unknown>;
  isCompleted: boolean;
  progress: number;
}

export type LessonStatus = 'auto_passed' | 'required' | 'locked';

export interface LearningPathLesson {
  canonicalLessonId: string;
  stageId?: string;
  milestoneId: string;
  title: string;
  exerciseId: string;
  status: LessonStatus;
}

export interface PlacementResult {
  score: { earned: number; max: number; percentage: number };
  competencies: Record<string, number>;
  level: string;
  status: 'PASS' | 'FAIL';
  advancement: { canAdvance: boolean; nextMilestone?: string };
  weakAreas: Array<{ topic: string; questions: number[]; recommendedExerciseId?: string }>;
  recommendedLessons: string[];
  studyPlan: string[];
  autoPassedExercises: string[];
  unlockedMilestones: string[];
  failReason?: string;
  skipToMilestoneId?: string;
}

export interface PersonalizedPathResult {
  userId: string;
  placementSummary: {
    level: string;
    status: 'PASS' | 'FAIL';
    percentage: number;
  };
  learningPath: LearningPathLesson[];
  studyPlan: string[];
}

export interface EntranceTestResult {
  skipToMilestoneId: string;
  skillId: string;
  score: number;
  totalQuestions: number;
  placementResult?: PlacementResult;
  personalizedPath?: PersonalizedPathResult;
}

export interface StoredPersonalizedPath {
  skipToMilestoneId: string;
  skillId: string;
  score: number;
  totalQuestions: number;
  placementResult?: PlacementResult;
  personalizedPath?: PersonalizedPathResult;
  xpEarned?: number;
  autoPassedCount?: number;
  completedAt: number;
}

export const PLACEMENT_XP_PER_AUTO_PASSED_LESSON = 75;
