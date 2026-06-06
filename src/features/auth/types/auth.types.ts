export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  avatar?: string;
  level: number;
  xp: number;
  stage_progress?: string;
  verified?: boolean;
  role?: string;
  bio?: string;
  stats?: {
    streak_days?: number;
    total_xp?: number;
    accuracy?: number;
    challenges_completed?: number;
  };
  badges?: Array<{
    icon?: string;
    name?: string;
    earnedAt?: Date;
  }>;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface LoginResponse {
  message: string;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}
