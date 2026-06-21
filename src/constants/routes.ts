export const ROUTES = {
  HOME: '/',
  ENTRANCE_TEST: '/entrance-test',
  LEARNING_PATH: '/learning-path',
  MILESTONE_DETAIL: '/learning-path/milestone/:milestoneId',
  LESSON_THEORY: '/learning-path/milestone/:milestoneId/lesson/:lessonId',
  LESSON_COMPLETE:
    '/learning-path/milestone/:milestoneId/lesson/:lessonId/complete',
  MILESTONE_COMPLETE: '/learning-path/milestone/:milestoneId/complete',
  WORKSPACE: '/workspace/:exerciseId',
  CHALLENGE_LOBBY: '/challenge/lobby',
  PROFILE: '/profile',
  LEADERBOARD: '/leaderboard',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  BANNED: '/banned',
  NOT_FOUND: '/404',
} as const;

export function workspacePath(exerciseId: string): string {
  return `/workspace/${exerciseId}`;
}
