export interface Room {
  id: string;
  name: string;
  hostId: string;
  players: Player[];
  maxPlayers: number;
  status: 'waiting' | 'in_progress' | 'completed';
}

export interface MatchState {
  roomId: string;
  status: 'waiting' | 'in_progress' | 'completed';
  startTime?: number;
  endTime?: number;
  winner?: string;
}

export interface Player {
  id: string;
  username: string;
  avatar?: string;
  score: number;
  isReady: boolean;
}

export interface ChallengeExercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  previewImage: string;
}
