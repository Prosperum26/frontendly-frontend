import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import WorkspaceLayout from './layouts/WorkspaceLayout';
import HomePage from './pages/HomePage';
import LearningPathPage from './pages/LearningPathPage';
import EntranceTestPage from './pages/EntranceTestPage';
import {
  MilestoneDetailPage,
  TheoryPage,
  LessonComplete,
  MilestoneCompletePage,
} from './features/learning-path';
import WorkspacePage from './pages/WorkspacePage';
import ChallengeLobbyPage from './pages/ChallengeLobbyPage';
import ChallengeBattlePage from './pages/ChallengeBattlePage';
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import BannedPage from './pages/BannedPage';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { useSessionVerification } from './features/auth/hooks/useSessionVerification';
import { ROUTES, workspacePath } from './constants/routes';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  // Verify session on app load
  useSessionVerification();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <Router>
          <Routes>
            {/* Banned route */}
            <Route path={ROUTES.BANNED} element={<BannedPage />} />

            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
              <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
              <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
            </Route>

            {/* Main app routes */}
            <Route element={<MainLayout />}>
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.ENTRANCE_TEST} element={<EntranceTestPage />} />
              <Route path={ROUTES.LEARNING_PATH} element={<LearningPathPage />} />
              <Route
                path={ROUTES.MILESTONE_DETAIL}
                element={<MilestoneDetailPage />}
              />
              <Route
                path={ROUTES.CHALLENGE_LOBBY}
                element={<ChallengeLobbyPage />}
              />
              <Route
                path={ROUTES.PROFILE}
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path={ROUTES.LEADERBOARD} element={<LeaderboardPage />} />
            </Route>

            {/* Standalone learning pages (own full-screen header) */}
            <Route path={ROUTES.LESSON_THEORY} element={<TheoryPage />} />
            <Route path={ROUTES.LESSON_COMPLETE} element={<LessonComplete />} />
            <Route
              path={ROUTES.MILESTONE_COMPLETE}
              element={<MilestoneCompletePage />}
            />

            {/* Workspace routes */}
            <Route element={<WorkspaceLayout />}>
              <Route
                path={ROUTES.WORKSPACE}
                element={
                  <ProtectedRoute>
                    <WorkspacePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workspace"
                element={<Navigate to={workspacePath('exercise_s1')} replace />}
              />
              <Route
                path={ROUTES.CHALLENGE_BATTLE}
                element={
                  <ProtectedRoute>
                    <ChallengeBattlePage />
                  </ProtectedRoute>
                }
              />
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
