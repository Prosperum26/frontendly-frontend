export const ROUTES = {
  HOME: '/',
  LEARNING_PATH: '/learning-path',
  WORKSPACE: '/workspace/:exerciseId',
  CHALLENGE_LOBBY: '/challenge/lobby',
  CHALLENGE_BATTLE: '/challenge/battle',
  PROFILE: '/profile',
  LEADERBOARD: '/leaderboard',
  LOGIN: '/login',
  NOT_FOUND: '/404',
} as const;

export function workspacePath(exerciseId: string): string {
  return `/workspace/${exerciseId}`;
}
