import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Play, Terminal, Swords, Flame, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import NetworkErrorCard from '../components/NetworkErrorCard';
import { AuthRequiredModal } from '../components/AuthRequiredModal/AuthRequiredModal';
import { ROUTES } from '../constants/routes';
import type { User } from '../features/auth/types/auth.types';
import { leaderboardService } from '../features/leaderboard/services/leaderboard.service';
import { profileService } from '../features/profile/services/profile.service';
import { challengeService } from '../features/challenge';
import { SandboxStorageService } from '../features/sandbox/services/sandboxStorage.service';
import type {
  Badge as BadgeType,
  LearningProgress,
  UserProfile,
} from '../features/profile/types/profile.types';
import type { ChallengeExercise } from '../features/challenge';
import type { Sandbox } from '../features/sandbox/types/sandbox.types';
import { useAuthStore } from '../store/auth.store';
import { HeroSection } from '../components/landing/HeroSection';
import { CurriculumPreview } from '../components/landing/CurriculumPreview';
import { GamificationSection } from '../components/landing/GamificationSection';
import { WhyLearnHere } from '../components/landing/WhyLearnHere';
import { CodingExperiencePreview } from '../components/landing/CodingExperiencePreview';
import { PlatformStats } from '../components/landing/PlatformStats';
import { FinalCTA } from '../components/landing/FinalCTA';

interface DashboardProps {
  profileData: UserProfile | undefined;
  badgesData: BadgeType[] | undefined;
  userRank: number | null | undefined;
  learningProgress: LearningProgress | undefined;
  challenges: ChallengeExercise[] | undefined;
  profileLoading: boolean;
  badgesLoading: boolean;
  rankLoading: boolean;
  progressLoading: boolean;
  challengesLoading: boolean;
  currentUser: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({
  profileData,
  learningProgress,
  profileLoading,
  userRank,
  progressLoading,
  currentUser,
  challenges,
  challengesLoading,
}) => {
  const loading = profileLoading || progressLoading;
  const user = profileData || currentUser;
  const streakDays =
    profileData?.streakDays ?? profileData?.stats?.streakDays ?? currentUser?.stats?.streakDays ?? 0;
  const [recentSandboxes, setRecentSandboxes] = useState<Sandbox[]>([]);
  const { isAuthenticated } = useAuthStore();
  const hasLoadedSandboxes = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !hasLoadedSandboxes.current) {
      setRecentSandboxes(SandboxStorageService.getAllSandboxes().slice(0, 2));
      hasLoadedSandboxes.current = true;
    }
  }, [isAuthenticated]);

  // Calculate time ago - useMemo is acceptable here as it's derived data
  const sandboxTimeAgo = useMemo(() => {
    return recentSandboxes.map(sandbox => ({
      ...sandbox,
      // eslint-disable-next-line react-hooks/purity
      timeAgo: Math.floor((Date.now() - sandbox.updatedAt) / 3600000)
    }));
  }, [recentSandboxes]);

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
          <div className="flex items-center gap-3 bg-orange-50/50 dark:bg-orange-950/30 px-5 py-2.5 rounded-xl border border-orange-100 dark:border-orange-900/50">
            <Flame className="w-6 h-6 text-orange-500 dark:text-orange-400" />
            <div>
              <p className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Current Streak</p>
              <p className="font-black text-orange-700 dark:text-orange-300 text-lg leading-tight">{streakDays} Days</p>
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
                <Link 
                  to={isAuthenticated ? ROUTES.SANDBOX_LIST : ROUTES.LOGIN} 
                  className="group flex flex-col items-center justify-center p-6 bg-surface-raised border border-border border-dashed rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-slate-400 font-bold text-xl leading-none">+</span>
                  </div>
                  <span className="text-sm font-semibold text-heading">New Sandbox</span>
                </Link>
                {/* Sandbox gần đây */}
                {sandboxTimeAgo.length > 0 ? (
                  sandboxTimeAgo.map((sandbox) => (
                    <div key={sandbox.id} className="p-5 bg-surface-raised border border-border rounded-xl flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-heading text-sm mb-1">{sandbox.name}</h3>
                        <p className="text-xs text-muted">
                          Edited {sandbox.timeAgo}h ago
                        </p>
                      </div>
                      <Link to={`/sandbox/${sandbox.id}`} className="text-primary text-xs font-bold mt-4 hover:underline flex items-center gap-1">
                        Open Editor <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="p-5 bg-surface-raised border border-border rounded-xl flex flex-col justify-center items-center text-center">
                    <p className="text-xs text-muted mb-2">No recent sandboxes</p>
                    <Link to={ROUTES.SANDBOX_LIST} className="text-primary text-xs font-bold hover:underline">
                      Create one
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cột phải (Khám phá & Thử thách) - Chiếm 1/3 */}
          <div className="space-y-6 sm:space-y-8">
            
            {/* Challenges */}
            <div className="bg-main-bg rounded-2xl border border-border p-6 shadow-sm">
               <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <Swords className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-lg font-bold text-heading">Challenges</h2>
              </div>
              
              {challengesLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 bg-surface-raised rounded-xl border border-border animate-pulse">
                      <div className="h-4 bg-slate-200 rounded mb-2 w-3/4" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : challenges && challenges.length > 0 ? (
                <div className="space-y-3">
                  {challenges.slice(0, 3).map((challenge) => (
                    <Link
                      key={challenge.id}
                      to={`/workspace/${challenge.id}`}
                      className="block p-4 bg-surface-raised rounded-xl border border-border hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-grow">
                          <p className="text-sm font-bold text-heading mb-1">{challenge.title}</p>
                          <p className="text-xs text-muted line-clamp-2">{challenge.description}</p>
                          <div className="flex gap-2 mt-2">
                            {challenge.tags?.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-slate-100 dark:bg-slate-700 text-muted px-2 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          challenge.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                          challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {challenge.difficulty}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-surface-raised rounded-xl border border-border border-dashed">
                  <p className="text-muted text-sm mb-4">No challenges available</p>
                </div>
              )}
              <Link to={ROUTES.CHALLENGE_LOBBY} className="block text-center text-sm font-semibold text-primary mt-4 hover:underline">
                View All Challenges
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
              <Link to={ROUTES.LEADERBOARD} className="w-full block text-center bg-surface-raised border border-border text-heading px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
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
  const [showAuthModal, setShowAuthModal] = useState(false);

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
            <HeroSection />
            <CurriculumPreview />
            <GamificationSection />
            <WhyLearnHere />
            <CodingExperiencePreview />
            <PlatformStats />
            <FinalCTA />
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

  const { data: challenges, isLoading: challengesLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: () => challengeService.getChallenges(),
    enabled: isAuthenticated,
  });

  return isAuthenticated && currentUser ? (
    <Dashboard
      profileData={profileData}
      badgesData={badgesData}
      userRank={userRank}
      learningProgress={learningProgress}
      challenges={challenges}
      profileLoading={profileLoading}
      badgesLoading={badgesLoading}
      rankLoading={rankLoading}
      progressLoading={progressLoading}
      challengesLoading={challengesLoading}
      currentUser={currentUser}
    />
  ) : (
    <LandingPage isOffline={isOffline} navigate={navigate} />
  );
};

export default HomePage;
