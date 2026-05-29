export interface Milestone {
  id: string;
  title: string;
  description: string;
  order: number;
  completed: boolean;
  lessons: Lesson[];
  status?: "completed" | "in_progress" | "locked";
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: "theory" | "practice";
  completed: boolean;
  xpReward: number;
  isLocked: boolean;
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
  description?: string;
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
export interface DetailLesson {
  id: string;
  title: string;
  description: string;
  type: "theory" | "liveClass" | "finalProject";
  status: "completed" | "in_progress" | "locked";
  duration: string;
  tags: string[];
  codePreview?: string;
  order: number;
}
export interface MilestoneDetail {
  id: string;
  milestoneNumber: number;
  title: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  lessons: DetailLesson[];
  proTip: {
    text: string;
    imageUrl: string;
  };
}
