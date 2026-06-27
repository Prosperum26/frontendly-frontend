import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Code2, Trophy, Users, Play, Terminal, Swords, Flame, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import NetworkErrorCard from '../components/NetworkErrorCard';
import { ROUTES } from '../constants/routes';
import type { User } from '../features/auth/types/auth.types';
import { leaderboardService } from '../features/leaderboard/services/leaderboard.service';
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
  learningProgress,
  profileLoading,
  userRank,
  progressLoading,
  currentUser,
}) => {
  const loading = profileLoading || progressLoading;
  const user = profileData || currentUser;
  const streakDays =
    profileData?.streakDays ?? profileData?.stats?.streakDays ?? currentUser?.stats?.streakDays ?? 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col flex-grow">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        
        {/* 1. Header & Lời chào */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-main-bg p-6 sm:p-8 rounded-2xl border border-border shadow-sm">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-heading mb-2">
              Welcome back, {user?.username || user?.name || 'Developer'}!
            </h1>
            <p className="text-body text-sm sm:text-base">Ready to write some code today?</p>
          </div>
          <div className="flex items-center gap-3 bg-orange-50/50 px-5 py-2.5 rounded-xl border border-orange-100">
            <Flame className="w-6 h-6 text-orange-500" />
            <div>
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Current Streak</p>
              <p className="font-black text-orange-700 text-lg leading-tight">{streakDays} Days</p>
            </div>
          </div>
        </div>

        {/* 2. Main Grid (Bệ phóng hành động) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Cột trái (Trọng tâm: Học & Code) - Chiếm 2/3 */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            
            {/* Tiếp tục lộ trình */}
            <div className="bg-main-bg rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Play className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-heading">Resume Learning</h2>
                  <p className="text-sm text-muted">Pick up exactly where you left off</p>
                </div>
              </div>

              {learningProgress ? (
                <div className="bg-surface-raised rounded-xl p-5 border border-border">
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                        Current Milestone
                      </span>
                      <span className="font-bold text-heading">
                        {learningProgress.currentMilestone || 'Starting your journey'}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-muted">
                      {learningProgress.completionPercentage || 0}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-border/50 rounded-full h-2.5 mb-5 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${learningProgress.completionPercentage || 0}%` }}
                    />
                  </div>
                  
                  <Link
                    to={ROUTES.LEARNING_PATH}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-hover transition-colors"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6 bg-surface-raised rounded-xl border border-border border-dashed">
                  <p className="text-muted text-sm mb-4">You haven't started any lessons yet.</p>
                  <Link
                    to={ROUTES.LEARNING_PATH}
                    className="inline-block bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-hover transition-colors"
                  >
                    Browse Curriculum
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Workspace */}
            <div className="bg-main-bg rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-heading">Quick Workspace</h2>
                  <p className="text-sm text-muted">Experiment with code freely</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Thẻ tạo mới */}
                <Link to={'#'} className="group flex flex-col items-center justify-center p-6 bg-surface-raised border border-border border-dashed rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-slate-400 font-bold text-xl leading-none">+</span>
                  </div>
                  <span className="text-sm font-semibold text-heading">New Sandbox</span>
                </Link>
                {/* Sandbox gần đây (Mock) */}
                <div className="p-5 bg-surface-raised border border-border rounded-xl flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-heading text-sm mb-1">Flexbox Layout Test</h3>
                    <p className="text-xs text-muted">Edited 2 hours ago</p>
                  </div>
                  <Link to={'#'} className="text-primary text-xs font-bold mt-4 hover:underline flex items-center gap-1">
                    Open Editor <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải (Khám phá & Thử thách) - Chiếm 1/3 */}
          <div className="space-y-6 sm:space-y-8">
            
            {/* Daily Quests */}
            <div className="bg-main-bg rounded-2xl border border-border p-6 shadow-sm">
               <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <Swords className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-lg font-bold text-heading">Daily Quests</h2>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 bg-surface-raised rounded-xl border border-border flex justify-between items-center gap-3">
                  <div>
                    <p className="text-sm font-bold text-heading mb-0.5">Complete 1 Lesson</p>
                    <p className="text-xs text-green-600 font-bold">+50 XP</p>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-border" />
                </div>
                <div className="p-4 bg-surface-raised rounded-xl border border-border flex justify-between items-center gap-3">
                  <div>
                    <p className="text-sm font-bold text-heading mb-0.5">Win a Code Battle</p>
                    <p className="text-xs text-green-600 font-bold">+100 XP</p>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-border" />
                </div>
              </div>
              <Link to={ROUTES.CHALLENGE_LOBBY} className="block text-center text-sm font-semibold text-primary mt-4 hover:underline">
                Enter Challenge Lobby
              </Link>
            </div>

            {/* Mini Leaderboard (Thay cho Rank tĩnh) */}
            <div className="bg-main-bg rounded-2xl border border-border p-6 shadow-sm">
               <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                </div>
                <h2 className="text-lg font-bold text-heading">Current Standing</h2>
              </div>
              <div className="text-center p-6 bg-surface-raised rounded-xl border border-border mb-4">
                <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Your Rank</p>
                <p className="text-4xl font-black text-heading">
                  {userRank ? `#${userRank}` : 'Unranked'}
                </p>
              </div>
              <Link to={'#'} className="w-full block text-center bg-surface-raised border border-border text-heading px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
                View Leaderboard
              </Link>
            </div>

          </div>
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
  return (
    <div className="w-full flex-grow flex flex-col bg-surface font-sans">
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
                    <Link
                      to={ROUTES.ENTRANCE_TEST}
                      className="px-6 py-3 text-blue-600 text-sm font-semibold hover:underline text-center"
                    >
                      Take entrance test
                    </Link>
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
