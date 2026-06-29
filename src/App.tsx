import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, ToastProvider } from './components/Toast';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { ROUTES, workspacePath } from './constants/routes';
import { useSessionVerification } from './features/auth/hooks/useSessionVerification';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import {
  LessonComplete,
  MilestoneCompletePage,
  MilestoneDetailPage,
  TheoryPage,
} from './features/learning-path';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import WorkspaceLayout from './layouts/WorkspaceLayout';
import BannedPage from './pages/BannedPage';
import ChallengeLobbyPage from './pages/ChallengeLobbyPage';
import EntranceTestPage from './pages/EntranceTestPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import LeaderboardPage from './pages/LeaderboardPage';
import LearningPathPage from './pages/LearningPathPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import WorkspacePage from './pages/WorkspacePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  useSessionVerification();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
        storageKey="frontendly-theme"
      >
        <ToastProvider>
          <Router>
            <Routes>
              <Route path={ROUTES.BANNED} element={<BannedPage />} />

              <Route element={<AuthLayout />}>
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
                <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
                <Route path={ROUTES.CONTACT} element={<ContactPage />} />
                <Route path={ROUTES.PRIVACY} element={<PrivacyPolicyPage />} />
                <Route path={ROUTES.TERMS} element={<TermsPage />} />
              </Route>

              <Route element={<MainLayout />}>
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route
                  path={ROUTES.ENTRANCE_TEST}
                  element={
                    <ProtectedRoute>
                      <EntranceTestPage />
                    </ProtectedRoute>
                  }
                />
                <Route path={ROUTES.LEARNING_PATH} element={<LearningPathPage />} />
                <Route path={ROUTES.MILESTONE_DETAIL} element={<MilestoneDetailPage />} />
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

              <Route path={ROUTES.LESSON_THEORY} element={<TheoryPage />} />
              <Route path={ROUTES.LESSON_COMPLETE} element={<LessonComplete />} />
              <Route path={ROUTES.MILESTONE_COMPLETE} element={<MilestoneCompletePage />} />

              <Route element={<WorkspaceLayout />}>
                <Route
                  path={ROUTES.WORKSPACE}
                  element={
                    <ProtectedRoute allowGuest>
                      <WorkspacePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/workspace"
                  element={<Navigate to={workspacePath('exercise_s1')} replace />}
                />
              </Route>

              <Route path="/" element={<Navigate to={ROUTES.HOME} replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
          <ToastContainer />
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
