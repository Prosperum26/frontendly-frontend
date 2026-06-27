import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Code2, Trophy, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import NetworkErrorCard from '../components/NetworkErrorCard';
import { AuthRequiredModal } from '../components/AuthRequiredModal/AuthRequiredModal';
import { ROUTES } from '../constants/routes';
import type { User } from '../features/auth/types/auth.types';
import { leaderboardService } from '../features/leaderboard/services/leaderboard.service';
import { Badge } from '../features/profile/components/Badge';
import { profileService } from '../features/profile/services/profile.service';
import type {
  Badge as BadgeType,
  LearningProgress,
  UserProfile,
} from '../features/profile/types/profile.types';
import { useAuthStore } from '../store/auth.store';

interface DashboardProps {
  profileData: UserProfile | undefined;
  badgesData: BadgeType[] | undefined;
  userRank: number | null | undefined;
  learningProgress: LearningProgress | undefined;
  profileLoading: boolean;
  badgesLoading: boolean;
  rankLoading: boolean;
  progressLoading: boolean;
  currentUser: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({
  profileData,
  badgesData,
  userRank,
  learningProgress,
  profileLoading,
  badgesLoading,
  rankLoading,
  progressLoading,
  currentUser,
}) => {
  const loading = profileLoading || badgesLoading || rankLoading || progressLoading;
  const user = profileData || currentUser;
  const streakDays =
    profileData?.streakDays ?? profileData?.stats?.streakDays ?? currentUser?.stats?.streakDays ?? 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-heading">
            Welcome to your Frontend journey, {user?.username || user?.name || 'User'}!
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-main-bg rounded-xl p-4 sm:p-6 shadow-sm border border-border">
            <p className="text-xs sm:text-sm text-muted mb-1 sm:mb-2">XP EARNED</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{user?.xp || 0}</p>
          </div>
          <div className="bg-main-bg rounded-xl p-4 sm:p-6 shadow-sm border border-border">
            <p className="text-xs sm:text-sm text-muted mb-1 sm:mb-2">DAY STREAK</p>
            <p className="text-xl sm:text-2xl font-bold text-orange-500">{streakDays}</p>
          </div>
          <div className="bg-main-bg rounded-xl p-4 sm:p-6 shadow-sm border border-border">
            <p className="text-xs sm:text-sm text-muted mb-1 sm:mb-2">MODULES</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">{user?.level || 0}</p>
          </div>
          <div className="bg-main-bg rounded-xl p-4 sm:p-6 shadow-sm border border-border">
            <p className="text-xs sm:text-sm text-muted mb-1 sm:mb-2">RANK</p>
            <p className="text-xl sm:text-2xl font-bold text-purple-600">
              {userRank ? `#${userRank}` : '---'}
            </p>
          </div>
        </div>

        <div className="bg-main-bg rounded-xl p-4 sm:p-6 shadow-sm mb-6 sm:mb-8 border border-border">
          <h2 className="text-lg sm:text-xl font-bold text-heading mb-3 sm:mb-4">Current Progress</h2>
          {learningProgress && (
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-body text-sm sm:text-base">
                  {learningProgress.currentMilestone || 'Learning Path'}
                </span>
                <span className="text-xs sm:text-sm text-muted">
                  {learningProgress.completionPercentage || 0}%
                </span>
              </div>
              <div className="w-full bg-surface-raised rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${learningProgress.completionPercentage || 0}%` }}
                />
              </div>
              <Link
                to={ROUTES.LEARNING_PATH}
                className="mt-2 inline-block text-xs sm:text-sm text-blue-600 font-medium hover:underline"
              >
                Continue Learning
              </Link>
            </div>
          )}
        </div>

        <div className="bg-main-bg rounded-xl p-4 sm:p-6 shadow-sm mb-6 sm:mb-8 border border-border">
          <h2 className="text-lg sm:text-xl font-bold text-heading mb-3 sm:mb-4">Badge Collection</h2>
          {badgesData && badgesData.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-4 justify-items-center">
              {badgesData.map((badge, idx) => (
                <Badge key={badge.id || idx} badge={badge} size="lg" />
              ))}
            </div>
          ) : (
            <p className="text-muted text-sm sm:text-base">No badges yet. Complete lessons to unlock badges!</p>
          )}
          <Link to={ROUTES.PROFILE} className="text-blue-600 font-medium text-sm sm:text-base hover:underline">
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

interface LandingPageProps {
  isOffline: boolean;
  navigate: (path: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ isOffline, navigate }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleEntranceTestClick = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="w-full flex-grow flex flex-col bg-surface font-sans">
      <AuthRequiredModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <main className="flex-grow flex flex-col">
        {isOffline ? (
          <div className="w-full flex-grow flex items-center justify-center p-4 sm:p-6 mt-12">
            <NetworkErrorCard
              onRetry={() => window.location.reload()}
              onBack={() => navigate(ROUTES.HOME)}
            />
          </div>
        ) : (
          <div className="w-full">
            <section className="border-b border-border bg-main-bg">
              <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20">
                <div className="max-w-3xl">
                  <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-4">
                    Frontend learning platform
                  </p>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-heading leading-tight tracking-tight mb-5">
                    Learn HTML, CSS, JavaScript &amp; React by building real projects
                  </h1>
                  <p className="text-body text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
                    FrontEndly guides you through structured milestones with theory lessons,
                    hands-on coding exercises, and instant feedback — no local setup required.
                  </p>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                    <Link
                      to={ROUTES.REGISTER}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors text-center"
                    >
                      Create free account
                    </Link>
                    <Link
                      to={ROUTES.LEARNING_PATH}
                      className="px-6 py-3 bg-main-bg text-heading border border-border rounded-lg text-sm font-semibold hover:bg-surface transition-colors text-center"
                    >
                      Browse learning path
                    </Link>
                    <button
                      onClick={handleEntranceTestClick}
                      className="px-6 py-3 text-blue-600 text-sm font-semibold hover:underline text-center"
                    >
                      Take entrance test
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-16">
              <h2 className="text-xl sm:text-2xl font-bold text-heading mb-8">
                How FrontEndly works
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: BookOpen,
                    step: '1',
                    title: 'Read theory',
                    text: 'Short lessons explain concepts before you write any code.',
                  },
                  {
                    icon: Code2,
                    step: '2',
                    title: 'Code in browser',
                    text: 'Open exercises in the built-in editor with a live preview panel.',
                  },
                  {
                    icon: Trophy,
                    step: '3',
                    title: 'Pass checks',
                    text: 'Submit to validate requirements, lint rules, and visual design.',
                  },
                  {
                    icon: Users,
                    step: '4',
                    title: 'Track progress',
                    text: 'Earn XP, unlock badges, and climb the leaderboard.',
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="rounded-xl border border-border bg-main-bg p-5 sm:p-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-sm font-bold">
                        {item.step}
                      </span>
                      <item.icon className="h-5 w-5 text-muted" aria-hidden />
                    </div>
                    <h3 className="font-semibold text-heading mb-2">{item.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-main-bg border-y border-border">
              <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-16">
                <div className="grid lg:grid-cols-2 gap-10 items-start">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-heading mb-4">
                      Structured curriculum
                    </h2>
                    <p className="text-muted text-sm sm:text-base leading-relaxed mb-6">
                      Three milestones take you from your first React component to styling,
                      events, and conditional rendering — each with theory and practice stages.
                    </p>
                    <ul className="space-y-3 text-sm text-body">
                      <li className="flex gap-2">
                        <span className="text-blue-600 font-bold">M1</span>
                        React fundamentals — components, JSX, createRoot
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-600 font-bold">M2</span>
                        Styling, events, CSS modules, conditional UI
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-600 font-bold">M3</span>
                        Advanced patterns and capstone projects
                      </li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: 'HTML', color: '#d97706', bg: '#ffedd5' },
                      { label: 'CSS', color: '#4f46e5', bg: '#e0e7ff' },
                      { label: 'JS', color: '#0ea5e9', bg: '#e0f2fe' },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        to={ROUTES.LEARNING_PATH}
                        className="rounded-xl border border-border p-5 text-center hover:border-blue-300 transition-colors"
                      >
                        <div
                          className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-xs font-black"
                          style={{ backgroundColor: item.bg, color: item.color }}
                        >
                          {item.label}
                        </div>
                        <span className="text-sm font-semibold text-heading">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-16 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-heading mb-3">
                Ready to start coding?
              </h2>
              <p className="text-muted text-sm sm:text-base mb-6 max-w-lg mx-auto">
                Jump into the learning path or try a challenge exercise — no install needed.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  to={ROUTES.LEARNING_PATH}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  Start learning
                </Link>
                <Link
                  to={ROUTES.CHALLENGE_LOBBY}
                  className="px-6 py-3 border border-border rounded-lg text-sm font-semibold text-heading hover:bg-main-bg transition-colors"
                >
                  Practice coding
                </Link>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuthStore();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.fetchProfile(),
    enabled: isAuthenticated,
  });

  const { data: badgesData, isLoading: badgesLoading } = useQuery({
    queryKey: ['badges'],
    queryFn: () => profileService.fetchBadges(),
    enabled: isAuthenticated,
  });

  const { data: userRank, isLoading: rankLoading } = useQuery({
    queryKey: ['userRank', currentUser?._id || currentUser?.id],
    queryFn: () => {
      const userId = currentUser?._id || currentUser?.id;
      return userId ? leaderboardService.fetchUserRank(userId) : Promise.resolve(null);
    },
    enabled: isAuthenticated && !!(currentUser?._id || currentUser?.id),
  });

  const { data: learningProgress, isLoading: progressLoading } = useQuery({
    queryKey: ['learningProgress'],
    queryFn: () => profileService.fetchLearningProgress(),
    enabled: isAuthenticated,
  });

  return isAuthenticated && currentUser ? (
    <Dashboard
      profileData={profileData}
      badgesData={badgesData}
      userRank={userRank}
      learningProgress={learningProgress}
      profileLoading={profileLoading}
      badgesLoading={badgesLoading}
      rankLoading={rankLoading}
      progressLoading={progressLoading}
      currentUser={currentUser}
    />
  ) : (
    <LandingPage isOffline={isOffline} navigate={navigate} />
  );
};

export default HomePage;
