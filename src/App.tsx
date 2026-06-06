import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import WorkspaceLayout from './layouts/WorkspaceLayout';
import HomePage from './pages/HomePage';
import LearningPathPage from './pages/LearningPathPage';
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
import { ROUTES } from './constants/routes';
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
              <Route path="/register" element={<RegisterPage />} />
              {/* ĐÃ CHUYỂN: Đưa trang quên mật khẩu vào đây để dùng chung layout auth sạch sẽ */}
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>

            {/* Main app routes */}
            <Route element={<MainLayout />}>
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.LEARNING_PATH} element={<LearningPathPage />} />
              <Route path={ROUTES.CHALLENGE_LOBBY} element={<ChallengeLobbyPage />} />
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