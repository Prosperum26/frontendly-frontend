export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar?: string;
  level: number;
  xp: number;
  rank: number;
  rankDelta?: number;
}

export interface Tier {
  name: string;
  minRank: number;
  maxRank: number;
  color: string;
}

export interface RankDelta {
  previous: number;
  current: number;
  change: number;
}
