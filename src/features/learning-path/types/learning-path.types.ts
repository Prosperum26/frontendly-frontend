export interface Milestone {
  id: string;
  title: string;
  description: string;
  order: number;
  completed: boolean;
  lessons: Lesson[];
  status?: "completed" | "in_progress" | "locked";
  icon: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: "theory" | "practice";
  completed: boolean;
  xpReward: number;
  isLocked: boolean;
  placementStatus?: "auto_passed" | "required" | "locked" | null;
}

export interface Progress {
  milestoneId: string;
  lessonId: string;
  completedAt: number;
}

export interface ApiStage {
  id: string;
  title: string;
  icon: string;
  isCompleted: boolean;
  earnedStars: number;
  placementStatus?: "auto_passed" | "required" | "locked" | null;
}

export interface ApiMilestone {
  id: string;
  title: string;
  description?: string;
  status: "completed" | "in_progress" | "locked";
  icon: string;
  stages: ApiStage[];
}

export interface UserProgress {
  currentXp: number;
  streakDays: number;
  placementTestCompleted?: boolean;
  skipToMilestoneId?: string | null;
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
    personalizedLearningPath?: Array<{
      canonicalLessonId: string;
      stageId: string;
      exerciseId: string;
      status: "auto_passed" | "required" | "locked";
    }>;
    studyPlan?: string[];
    pagination?: Pagination;
  };
}

export interface RoadmapDto {
  skillId: string;
  skillTitle: string;
  milestones: Milestone[];
  userProgress: UserProgress;
  studyPlan?: string[];
}

export interface DetailLesson {
  id: string;
  title: string;
  description: string;
  type: "theory" | "liveClass" | "finalProject";
  status: "completed" | "in_progress" | "locked" | "auto_passed";
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
