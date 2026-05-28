import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import WorkspaceLayout from './layouts/WorkspaceLayout';
import HomePage from './pages/HomePage';
import LearningPathPage from './pages/LearningPathPage';
import { MilestoneDetailPage, TheoryPage, LessonComplete } from './features/learning-path';
import WorkspacePage from './pages/WorkspacePage';
import ChallengeLobbyPage from './pages/ChallengeLobbyPage';
import ChallengeBattlePage from './pages/ChallengeBattlePage';
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import { ROUTES } from './constants/routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <Router>
          <Routes>
            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            </Route>

            {/* Main app routes */}
            <Route element={<MainLayout />}>
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.LEARNING_PATH} element={<LearningPathPage />} />
              <Route path={ROUTES.MILESTONE_DETAIL} element={<MilestoneDetailPage />} />
              <Route path={ROUTES.LESSON_THEORY} element={<TheoryPage />} />
              <Route path={ROUTES.LESSON_COMPLETE} element={<LessonComplete />} />
              <Route path={ROUTES.CHALLENGE_LOBBY} element={<ChallengeLobbyPage />} />
              <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
              <Route path={ROUTES.LEADERBOARD} element={<LeaderboardPage />} />
            </Route>

            {/* Workspace routes */}
            <Route element={<WorkspaceLayout />}>
              <Route path={ROUTES.WORKSPACE} element={<WorkspacePage />} />
              <Route path={ROUTES.CHALLENGE_BATTLE} element={<ChallengeBattlePage />} />
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to={ROUTES.HOME} replace />} />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
