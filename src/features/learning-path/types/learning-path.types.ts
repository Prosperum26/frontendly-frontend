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
  type: "theory" | "practice";
  completed: boolean;
  xpReward: number;
}

export interface Progress {
  milestoneId: string;
  lessonId: string;
  completedAt: number;
}

export interface ApiStage {
  id: string;
  title: string;
  isCompleted: boolean;
  earnedStars: number;
}

export interface ApiMilestone {
  id: string;
  title: string;
  status: "completed" | "in_progress" | "locked";
  stages: ApiStage[];
}

export interface UserProgress {
  currentXp: number;
  streakDays: number;
}

export interface Pagination {
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface RoadmapResponse {
  success: boolean;
  message: string;
  data: {
    skillId: string;
    skillTitle: string;
    userProgress: UserProgress;
    milestones: ApiMilestone[];
    pagination: Pagination;
  };
}
