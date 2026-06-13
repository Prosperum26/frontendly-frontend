export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  avatar?: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  stage_progress?: string;
  verified?: boolean;
  role?: string;
  bio?: string;
  stats?: {
    streak_days?: number;
    streakDays?: number;
    total_xp?: number;
    totalXP?: number;
    accuracy?: number;
    challenges_completed?: number;
    challenges?: number;
    totalLearningTime?: number;
    coursesCompleted?: number;
    lastActiveAt?: Date;
  };
  badges?: Array<{
    icon?: string;
    name?: string;
    earnedAt?: Date;
    badgeId?: Record<string, unknown>;
  }>;
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
}







export interface AuthState {



  isAuthenticated: boolean;



  user: User | null;



  token: string | null;



}







export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user?: User;
}







export interface LoginCredentials {



  email: string;



  password: string;



}







export interface RegisterCredentials {
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  username?: string;
  password: string;
}

export interface GoogleLoginCredentials {
  idToken: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}



