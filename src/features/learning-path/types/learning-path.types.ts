export interface Milestone {
  id: string;
  title: string;
  description: string;
  order: number;
  completed: boolean;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'theory' | 'practice';
  completed: boolean;
  xpReward: number;
}

export interface Progress {
  milestoneId: string;
  lessonId: string;
  completedAt: number;
}
