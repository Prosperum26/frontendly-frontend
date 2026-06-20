import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import NetworkErrorCard from '../components/NetworkErrorCard';
import { useAuthStore } from '../store/auth.store';
import { profileService } from '../features/profile/services/profile.service';
import { leaderboardService } from '../features/leaderboard/services/leaderboard.service';
import { Badge } from '../features/profile/components/Badge';
import type { User } from '../features/auth/types/auth.types';
import type { UserProfile, Badge as BadgeType, LearningProgress } from '../features/profile/types/profile.types';

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
  profileData, badgesData, userRank, learningProgress, profileLoading, badgesLoading, rankLoading, progressLoading, currentUser }) => {
  const loading = profileLoading || badgesLoading || rankLoading || progressLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  const user = profileData || currentUser;
  const recentBadges = badgesData?.slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome to your Frontend journey, {user?.username || user?.name || 'User'}!
          </h1>
        </div>

        {/* Weekly Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-sm text-slate-500 mb-2">XP EARNED</p>
            <p className="text-2xl font-bold text-blue-600">{user?.xp || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-sm text-slate-500 mb-2">DAY STREAK</p>
            <p className="text-2xl font-bold text-orange-500">{user?.stats?.streakDays || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-sm text-slate-500 mb-2">MODULES</p>
            <p className="text-2xl font-bold text-green-600">{user?.level || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-sm text-slate-500 mb-2">RANK</p>
            <p className="text-2xl font-bold text-purple-600">
              {userRank ? `#${userRank}` : '---'}
            </p>
          </div>
        </div>

        {/* Current Progress */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Current Progress</h2>
          <div className="space-y-4">
            {learningProgress && (
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-slate-700">{learningProgress.currentMilestone || 'Learning Path'}</span>
                  <span className="text-sm text-slate-500">{learningProgress.completionPercentage || 0}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${learningProgress.completionPercentage || 0}%` }}
                  ></div>
                </div>
                <Link to="/learning-path" className="mt-2 text-sm text-blue-600 font-medium hover:underline">
                  Continue Learning
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Badge Collection */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Badge Collection</h2>
          {badgesData && badgesData.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-4 justify-items-center">
              {badgesData.map((badge, idx) => (
                <Badge key={badge.id || idx} badge={badge} size="lg" />
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No badges yet. Complete lessons to unlock badges!</p>
          )}
          <Link to="/profile" className="text-blue-600 font-medium hover:underline">
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

const LandingPage: React.FC<LandingPageProps> = ({ isOffline, navigate }) => (
  <div className="w-full flex-grow flex flex-col bg-slate-50 font-sans">
    <main className="flex-grow flex flex-col items-center">
      {isOffline ? (
        <div className="w-full flex-grow flex items-center justify-center p-6 mt-12">
          <NetworkErrorCard
            onRetry={() => window.location.reload()}
            onBack={() => navigate('/')}
          />
        </div>
      ) : (
        <div className="w-full">
          {/* HERO SECTION */}
          <section className="w-full max-w-7xl mx-auto px-8 pt-20 pb-24 grid lg:grid-cols-2 gap-16 items-center">
            {/* Left column: Text & Buttons */}
            <div className="flex flex-col space-y-8 z-10">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black !text-slate-900 leading-[1.1] tracking-tight">
                Code the Web <br />
                <span className="text-blue-600">your way.</span>
              </h1>
              <p className="text-slate-600 font-medium leading-relaxed max-w-lg text-base md:text-lg">
                With FrontEndly, you can learn Frontend programming in a simple, easy-to-understand way. The code editor and live server features allow you to program and run projects in real-time without complex setup.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link to="/learning-path" className="px-8 py-4 bg-blue-600 text-white rounded-lg text-center text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">
                  Start Learning!
                </Link>
                <Link to="/register" className="px-8 py-4 bg-white text-slate-800 border border-slate-300 rounded-lg text-center text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Right column: Code Editor Mockup & Floating Preview */}
            <div className="relative mt-8 lg:mt-0 w-full max-w-lg mx-auto lg:ml-auto select-none">
              {/* Mockup Editor */}
              <div className="bg-[#1e1e2e] rounded-xl shadow-2xl overflow-hidden border border-slate-800">
                {/* Editor Header */}
                <div className="bg-[#181825] px-4 py-3 flex items-center justify-between border-b border-slate-700/50">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono tracking-wider">index.html</div>
                </div>
                {/* Code Content */}
                <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto text-slate-300">
                  <div>
                    <span className="text-pink-400">&lt;div</span> <span className="text-green-300">class</span>=<span className="text-yellow-300">"hero"</span><span className="text-pink-400">&gt;</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-pink-400">&lt;h1&gt;</span>Hello World<span className="text-pink-400">&lt;/h1&gt;</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-pink-400">&lt;p&gt;</span>Start your journey.<span className="text-pink-400">&lt;/p&gt;</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-pink-400">&lt;button</span> <span className="text-green-300">onclick</span>=<span className="text-yellow-300">"start()"</span><span className="text-pink-400">&gt;</span>
                  </div>
                  <div className="pl-8">Click Me</div>
                  <div className="pl-4">
                    <span className="text-pink-400">&lt;/button&gt;</span>
                  </div>
                  <div>
                    <span className="text-pink-400">&lt;/div&gt;</span>
                  </div>
                </div>
              </div>

              {/* Floating Preview Card */}
              <div className="absolute -bottom-10 -right-4 md:-right-10 bg-white p-5 rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 w-64 z-20">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Live Preview</span>
                </div>
                <div className="w-full h-10 bg-[#f1f5f9] rounded-lg mb-3 flex items-center justify-center">
                  <div className="w-16 h-3 bg-[#1e1b4b] rounded-full opacity-90"></div>
                </div>
                <button className="w-full bg-[#1e1b4b] text-white text-xs font-bold py-2.5 rounded-lg hover:bg-blue-900 transition-colors uppercase tracking-wider">
                  Interact
                </button>
              </div>
            </div>
          </section>

          {/* FEATURES SECTION */}
          <section className="w-full bg-white pt-24 pb-32 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold !text-slate-900 mb-4 tracking-tight">Master the Core Technologies</h2>
                <p className="text-sm md:text-base text-slate-500 font-medium">Build a rock-solid foundation with our structured learning paths designed for the modern web.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Card 1: HTML */}
                <div className="group bg-white rounded-xl p-8 border-t-2 border-slate-200 border-t-[#d97706] shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(217,119,6,0.3)] flex flex-col h-full cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-[#ffedd5] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                    <span className="text-[10px] font-black text-[#d97706]">HTML</span>
                  </div>
                  <h3 className="text-xl font-bold !text-slate-900 mb-3">HTML5 Mastery</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8 flex-grow">
                    Semantic architecture, accessibility standards, and SEO-friendly structure for modern applications.
                  </p>
                  <Link to="/learning-path" className="text-[#d97706] font-bold text-sm flex items-center gap-2 hover:underline w-fit">
                    Start Path <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5 text-lg leading-none">→</span>
                  </Link>
                </div>

                {/* Card 2: CSS */}
                <div className="group bg-white rounded-xl p-8 border-t-2 border-slate-200 border-t-[#4f46e5] shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(79,70,229,0.3)] flex flex-col h-full cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-[#e0e7ff] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                    <span className="text-[10px] font-black text-[#4f46e5]">CSS</span>
                  </div>
                  <h3 className="text-xl font-bold !text-slate-900 mb-3">Modern CSS</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8 flex-grow">
                    Flexbox, Grid, Animations, and responsive design patterns using Tailwind CSS and native CSS3.
                  </p>
                  <Link to="/learning-path" className="text-[#4f46e5] font-bold text-sm flex items-center gap-2 hover:underline w-fit">
                    Start Path <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5 text-lg leading-none">→</span>
                  </Link>
                </div>

                {/* Card 3: JS */}
                <div className="group bg-white rounded-xl p-8 border-t-2 border-slate-200 border-t-[#0ea5e9] shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(14,165,233,0.3)] flex flex-col h-full cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-[#e0f2fe] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                    <span className="text-[10px] font-black text-[#0ea5e9]">JS</span>
                  </div>
                  <h3 className="text-xl font-bold !text-slate-900 mb-3">JavaScript ES6+</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8 flex-grow">
                    Functional programming, async/await, and DOM manipulation for interactive web experiences.
                  </p>
                  <Link to="/learning-path" className="text-[#0ea5e9] font-bold text-sm flex items-center gap-2 hover:underline w-fit">
                    Start Path <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5 text-lg leading-none">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  </div>
);

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuthStore();

  // Network status monitoring (consolidated)
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

  // Fetch profile data
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.fetchProfile(),
    enabled: isAuthenticated,
  });

  // Fetch badges
  const { data: badgesData, isLoading: badgesLoading } = useQuery({
    queryKey: ['badges'],
    queryFn: () => profileService.fetchBadges(),
    enabled: isAuthenticated,
  });

  // Fetch user rank
  const { data: userRank, isLoading: rankLoading } = useQuery({
    queryKey: ['userRank', currentUser?._id || currentUser?.id],
    queryFn: () => {
      const userId = currentUser?._id || currentUser?.id;
      return userId ? leaderboardService.fetchUserRank(userId) : Promise.resolve(null);
    },
    enabled: isAuthenticated && !!(currentUser?._id || currentUser?.id),
  });

  // Fetch learning progress
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
