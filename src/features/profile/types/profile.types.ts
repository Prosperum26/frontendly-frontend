export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  level: number;
  xp: number;
  streak: number;
  joinedAt: number;
}

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
