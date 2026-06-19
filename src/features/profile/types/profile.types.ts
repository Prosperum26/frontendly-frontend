export interface UserProfile {
  id?: string;
  username: string;
  email: string;
  avatar?: string;
  avatarUrl?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  level: number;
  xp: number;
  streak?: number;
  streakDays?: number;
  phoneNumber?: string;
  dateOfBirth?: string;
  bio?: string;
  joinedAt?: number;
  // THÊM vào interface UserProfile
lastPhoneUpdatedAt?: Date | string;
  stats?: {
    streakDays?: number;
    coursesCompleted?: number;
    totalCourses?: number; // ĐÃ THÊM: Để fix lỗi totalCourses trong ProfilePage
    totalLearningTime?: number;
    lastActiveAt?: Date;
  };
  social_accounts?: Array<{
    provider: string;
    providerId: string;
    linkedAt: Date;
  }>;
  skills?: Array<{
    name: string;
    level: number;
    earnedAt: Date;
  }>;
  badges?: Array<{
    badgeId: string; // ĐÃ SỬA: Thay any thành string
    earnedAt: Date;
  }>;
  stage_progress?: {
    currentStage?: number;
    maxUnlockedStage?: number;
    completedStages?: number[];
    totalProgress?: number;
    lastAccessedAt?: Date;
  };
}
// ... (Badge và ActivityLog giữ nguyên)
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: number;
}

export interface ActivityLog {
  id: string;
  type: 'lesson_completed' | 'challenge_won' | 'streak_achieved';
  description: string;
  timestamp: number;
}
