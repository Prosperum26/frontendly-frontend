export interface XPEvent {
  id: string;
  type: 'lesson_completed' | 'challenge_won' | 'daily_streak';
  amount: number;
  timestamp: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}
