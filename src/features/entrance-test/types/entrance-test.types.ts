export interface EntranceTestQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'code' | 'single-choice';
  options?: string[];
  correctAnswer?: string | string[];
  starterCode?: {
    html?: string;
    css?: string;
    js?: string;
    jsx?: string;
  };
}

export interface EntranceTestState {
  currentQuestionIndex: number;
  answers: Record<string, any>;
  isCompleted: boolean;
  progress: number;
}

export interface EntranceTestResult {
  skipToMilestoneId: string;
  skillId?: string;
}
