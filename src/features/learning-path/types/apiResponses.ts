export interface UserResponse {
  success: boolean;
  message: string;
  data: UserData;
}

export interface UserData {
  id: string;
  name: string;
  avatarUrl: string;
  totalXp: number;
  currentLevel: number;
  userTitle?: string;
}

export interface ProgressResponse {
  level: number;
  xp: number;
  xpToNextLevel: number;
  progressPercent: number;
  streak?: number | string;
  rank?: number | string;
}

export interface BadgesResponse {
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  isUnlocked: boolean;
}
