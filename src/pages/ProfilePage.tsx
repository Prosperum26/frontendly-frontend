
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { profileService } from '../features/profile/services/profile.service';
import { authService } from '../features/auth/services/auth.service';
import type { UserProfile, Badge as BadgeType, ActivityLog } from '../features/profile/types/profile.types';
import NetworkErrorCard from '../components/NetworkErrorCard';
import { Share2, Flame, Star, Trophy, Zap, BookOpen, Target } from 'lucide-react';
import { EditProfileForm } from '../features/profile/components/EditProfileForm';
import { CodingActivity } from '../features/profile/components/CodingActivity';
import { ProgressTrack } from '../features/profile/components/ProgressTrack';
import { Badge } from '../features/profile/components/Badge';

export const ProfilePage: React.FC = () => {
  const { currentUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isEditing, setIsEditing] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    const loadProfileData = async () => {
      if (isOffline) return;
      
      setIsLoading(true);
      try {
        const [profile, badgeList, activityList] = await Promise.all([
          profileService.fetchProfile(),
          profileService.fetchBadges(),
          profileService.fetchActivity(),
        ]);
        setProfileData(profile);
        setBadges(Array.isArray(badgeList) ? badgeList : []);
        setActivities(Array.isArray(activityList) ? activityList : []);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [isOffline]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await profileService.uploadAvatar(file);
      alert('Avatar updated successfully!');
      window.location.reload();
    } catch {
      alert('Server connection error');
    }
  };

  if (isOffline) {
    return <NetworkErrorCard onRetry={() => window.location.reload()} onBack={() => window.location.href = '/'} />;
  }

  if (isLoading) {
    return (
      <div className="bg-surface min-h-screen py-8 font-sans text-heading flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-body">Loading profile...</p>
        </div>
      </div>
    );
  }

  const userData = (profileData || currentUser) as UserProfile;

  const xpPercentage = Math.min(((userData?.xp || 0) / ((userData?.level || 1) * 1000)) * 100, 100);
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (xpPercentage / 100) * circumference;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="bg-surface dark:bg-editor-dark min-h-screen font-body text-heading dark:text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* HERO SECTION - Full width with gradient overlay */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-main-bg via-surface to-main-bg dark:from-editor-panel dark:via-editor-dark dark:to-editor-panel border border-border dark:border-slate-800 shadow-2xl">
          {/* Subtle purple-blue gradient overlay for gamified feel */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none dark:from-purple-900/10 dark:via-transparent dark:to-blue-900/10" />
          
          <div className="relative p-8 md:p-10">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Avatar with XP Progress HUD */}
              <div className="relative flex-shrink-0">
                <div className="relative w-36 h-36">
                  {/* Circular XP Progress Ring */}
                  <svg className="w-36 h-36 transform -rotate-90 absolute inset-0" viewBox="0 0 120 120">
                    {/* Background ring */}
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="#1f2937"
                      strokeWidth="6"
                    />
                    {/* Progress ring with glow */}
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="#F0883E"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className={!prefersReducedMotion ? 'animate-xp-fill' : ''}
                      style={{ filter: 'drop-shadow(0 0 8px rgba(240, 136, 62, 0.4))' }}
                    />
                    {/* Technical tick marks */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                      <line
                        key={angle}
                        x1="60"
                        y1="4"
                        x2="60"
                        y2="10"
                        stroke="#4B5563"
                        strokeWidth="2"
                        transform={`rotate(${angle} 60 60)`}
                      />
                    ))}
                  </svg>
                  {/* Avatar in center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <img 
                        src={userData?.avatarUrl || currentUser?.avatar || '/default-avatar.png'} 
                        alt="Avatar" 
                        className="w-24 h-24 rounded-full object-cover border-4 border-slate-300 dark:border-slate-700 shadow-md bg-slate-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/default-avatar.png';
                        }}
                      />
                      {/* Hover overlay for change avatar */}
                      <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">Change</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleAvatarUpload}
                      />
                    </div>
                  </div>
                </div>
                {/* Level badge floating */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-syntax-amber text-editor-dark px-3 py-1 rounded-full font-display font-bold text-sm shadow-lg shadow-orange-500/30 border-2 border-editor-dark">
                  Lv. {userData?.level || 1}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-grow space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-heading dark:text-white">
                    {userData?.username || userData?.name || 'User'}
                  </h1>
                  {/* Terminal-style streak counter - SIGNATURE ELEMENT */}
                  {(userData?.stats?.streakDays || 0) > 0 && (
                    <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-syntax-green/10 border border-green-200 dark:border-syntax-green/30 px-3 py-1.5 rounded-md font-mono text-sm text-green-700 dark:text-syntax-green">
                      <span className="text-slate-400 dark:text-syntax-grey">[</span>
                      <Flame 
                        className={`w-4 h-4 ${!prefersReducedMotion ? 'animate-flame-flicker' : ''}`} 
                        style={{ filter: 'drop-shadow(0 0 6px rgba(63, 185, 80, 0.6))' }}
                      />
                      <span className="font-bold">streak: {userData?.stats?.streakDays || 0} day</span>
                      <span className="text-slate-400 dark:text-syntax-grey">]</span>
                    </div>
                  )}
                </div>
                <p className="text-primary dark:text-syntax-blue font-semibold">
                  {userData?.role === 'user' ? 'Frontend Student' : 'Frontend Master'}
                </p>
                <p className="text-muted dark:text-syntax-grey text-sm font-mono">{userData?.email}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white dark:bg-syntax-blue dark:hover:bg-blue-500 dark:text-editor-dark px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
                >
                  Edit Profile
                </button>
                <button 
                  onClick={() => setIsShareModalOpen(true)} 
                  className="flex items-center justify-center gap-2 border border-border dark:border-slate-600 text-body dark:text-slate-200 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-surface dark:hover:bg-slate-700/50 transition-all duration-200"
                >
                  <Share2 className="w-4 h-4" />
                  Share Profile
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 border border-red-300 dark:border-red-900/50 text-red-700 dark:text-red-400 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* XP Progress Bar below hero */}
            <div className="mt-8 pt-6 border-t border-border dark:border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-display font-bold text-muted dark:text-syntax-grey uppercase tracking-wider">XP Progress</span>
                <span className="font-mono text-sm text-amber-600 dark:text-syntax-amber font-bold">
                  {userData?.xp || 0} <span className="text-muted dark:text-syntax-grey">/ {(userData?.level || 1) * 1000} XP</span>
                </span>
              </div>
              <div className="h-3 w-full bg-surface-raised dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r from-amber-500 to-orange-500 dark:from-syntax-amber dark:to-orange-500 rounded-full ${!prefersReducedMotion ? 'animate-xp-fill' : ''}`}
                  style={{ 
                    width: `${xpPercentage}%`,
                    boxShadow: '0 0 12px rgba(240, 136, 62, 0.4)'
                  }}
                >
                </div>
              </div>
            </div>

            {/* Edit Profile Form */}
            {isEditing && (
              <div className="mt-6 bg-surface dark:bg-editor-panel p-6 rounded-xl border border-border dark:border-slate-700 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-display font-bold text-heading dark:text-white">
                    Update Personal Details
                  </h3>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="text-sm text-muted dark:text-syntax-grey hover:text-heading dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                <EditProfileForm 
                  currentUser={userData} 
                  onSuccess={() => setIsEditing(false)} 
                />
              </div>
            )}
          </div>
        </div>

        {/* PRIMARY SECTION: Learning Path + Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Learning Path - Tall card, left column */}
          <div className="lg:col-span-2">
            <ProgressTrack />
          </div>

          {/* Stats Grid - Compact 2x2 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface dark:bg-editor-panel rounded-xl p-4 border border-border dark:border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-500 dark:text-syntax-amber" />
                </div>
                <div>
                  <h3 className="font-mono text-xl font-bold text-heading dark:text-white">{userData?.stats?.streakDays || 0}</h3>
                  <p className="text-[10px] font-display font-bold text-muted dark:text-syntax-grey uppercase tracking-wider">Day Streak</p>
                </div>
              </div>
            </div>

            <div className="bg-surface dark:bg-editor-panel rounded-xl p-4 border border-border dark:border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                  <Star className="w-5 h-5 text-blue-500 dark:text-syntax-blue" />
                </div>
                <div>
                  <h3 className="font-mono text-xl font-bold text-heading dark:text-white">{userData?.xp || 0}</h3>
                  <p className="text-[10px] font-display font-bold text-muted dark:text-syntax-grey uppercase tracking-wider">Total XP</p>
                </div>
              </div>
            </div>

            <div className="bg-surface dark:bg-editor-panel rounded-xl p-4 border border-border dark:border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-950/30 flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-500 dark:text-syntax-green" />
                </div>
                <div>
                  <h3 className="font-mono text-xl font-bold text-heading dark:text-white">{userData?.stats?.coursesCompleted || 0}</h3>
                  <p className="text-[10px] font-display font-bold text-muted dark:text-syntax-grey uppercase tracking-wider">Courses</p>
                </div>
              </div>
            </div>

            <div className="bg-surface dark:bg-editor-panel rounded-xl p-4 border border-border dark:border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-mono text-xl font-bold text-heading dark:text-white">{badges.length}</h3>
                  <p className="text-[10px] font-display font-bold text-muted dark:text-syntax-grey uppercase tracking-wider">Badges</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECONDARY SECTION: Activity Heatmap + Proficiency Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coding Activity Heatmap */}
          <div className="bg-surface dark:bg-editor-panel rounded-xl border border-border dark:border-slate-800 p-6 hover:border-slate-700 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-display font-bold text-heading dark:text-white">Coding Activity</h3>
              <span className="text-xs font-mono text-muted dark:text-syntax-grey">Last 3 months</span>
            </div>
            <CodingActivity />
          </div>

          {/* Proficiency Radar - Compact circular */}
          <div className="bg-surface dark:bg-editor-panel rounded-xl border border-border dark:border-slate-800 p-6 hover:border-slate-700 transition-all duration-300">
            <h3 className="text-xs font-display font-bold text-muted dark:text-syntax-grey uppercase tracking-wider mb-4">Proficiency Radar</h3>
            <div className="relative w-full aspect-square max-w-[280px] mx-auto flex flex-col items-center justify-center">
              {userData?.skills && userData.skills.length >= 3 ? (
                <svg viewBox="0 0 100 100" className="w-full h-full text-muted dark:text-syntax-grey">
                  <polygon points="50,10 90,80 10,80" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                  <polygon points="50,30 78,70 22,70" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                  <polygon points="50,50 65,60 35,60" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="50" y1="50" x2="50" y2="10" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="50" y1="50" x2="90" y2="80" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="50" y1="50" x2="10" y2="80" stroke="currentColor" strokeWidth="0.5" />
                  
                  {(() => {
                    const htmlSkill = userData.skills?.find((s: { name: string; level: number }) => s.name.toLowerCase() === 'html')?.level || 1;
                    const cssSkill = userData.skills?.find((s: { name: string; level: number }) => s.name.toLowerCase() === 'css')?.level || 1;
                    const jsSkill = userData.skills?.find((s: { name: string; level: number }) => s.name.toLowerCase() === 'js')?.level || 1;
                    
                    const r1 = (htmlSkill / 10) * 40;
                    const r2 = (cssSkill / 10) * 40;
                    const r3 = (jsSkill / 10) * 40;
                    
                    const p1 = `50,${50 - r1}`;
                    const p2 = `${50 + r2 * Math.cos(Math.PI / 6)},${50 + r2 * Math.sin(Math.PI / 6)}`;
                    const p3 = `${50 - r3 * Math.cos(Math.PI / 6)},${50 + r3 * Math.sin(Math.PI / 6)}`;
                    
                    return <polygon points={`${p1} ${p2} ${p3}`} fill="rgba(88, 166, 255, 0.2)" stroke="#58A6FF" strokeWidth="2" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(88, 166, 255, 0.3))' }} />;
                  })()}

                  <text x="50" y="5" fontSize="6" textAnchor="middle" fill="currentColor" fontWeight="bold">HTML</text>
                  <text x="95" y="85" fontSize="6" textAnchor="middle" fill="currentColor" fontWeight="bold">CSS</text>
                  <text x="5" y="85" fontSize="6" textAnchor="middle" fill="currentColor" fontWeight="bold">JS</text>
                </svg>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-surface-raised dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-muted dark:text-syntax-grey" />
                  </div>
                  <p className="text-[10px] text-muted dark:text-syntax-grey font-medium px-4">Complete more lessons to see your proficiency radar</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TERTIARY SECTION: Badge Shelf - Horizontal scroll with collectible feel */}
        <div className="bg-surface dark:bg-editor-panel rounded-xl border border-border dark:border-slate-800 p-6 hover:border-slate-700 transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-display font-bold text-heading dark:text-white">Badge Collection</h3>
            <a href="#" className="text-xs font-mono text-primary dark:text-syntax-blue hover:text-primary-hover dark:hover:text-blue-400 transition-colors">View all →</a>
          </div>
          
          {/* Shelf visual - horizontal line */}
          <div className="relative">
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-muted/30 dark:via-syntax-grey/30 to-transparent" />
            
            {badges.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-surface-raised dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-muted dark:text-syntax-grey" />
                </div>
                <p className="text-xs text-muted dark:text-syntax-grey font-medium px-6 text-center">No badges earned yet. Complete challenges to unlock them!</p>
              </div>
            ) : (
              <div className="flex gap-6 overflow-x-auto pb-4 pt-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {badges.map((badge, idx) => (
                  <div key={`profile-badge-${String(badge.id || idx)}`} className="flex flex-col items-center text-center flex-shrink-0 group">
                    <div className="relative mb-2 transition-transform duration-300 group-hover:-translate-y-2">
                      <Badge badge={badge} size="lg" />
                    </div>
                    <span className="text-[10px] font-display font-semibold text-body dark:text-slate-300 line-clamp-1 max-w-[80px] group-hover:text-heading dark:group-hover:text-white transition-colors">{badge.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* QUIET SECTION: Recent Achievements - Simple list, not boxed */}
        <div className="space-y-3">
          <h3 className="text-sm font-display font-bold text-heading dark:text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-primary dark:text-syntax-blue" />
            Recent Achievements
          </h3>
          {activities.length === 0 ? (
            <p className="text-center text-muted dark:text-syntax-grey text-sm italic py-4">No recent activities</p>
          ) : (
            <div className="space-y-2">
              {activities.slice(0, 5).map((activity, index) => (
                <div 
                  key={typeof activity.id === 'string' ? activity.id : `activity-${index}-${Date.now()}`} 
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-surface-raised dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <div className={`mt-0.5 p-2 rounded-lg ${
                    activity.type === 'lesson_completed' ? 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-syntax-green' :
                    activity.type === 'challenge_won' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-syntax-blue' :
                    'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-syntax-amber'
                  }`}>
                    {activity.type === 'lesson_completed' ? <BookOpen className="w-4 h-4" /> :
                     activity.type === 'challenge_won' ? <Trophy className="w-4 h-4" /> :
                     <Zap className="w-4 h-4" />}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-body dark:text-slate-200 font-medium leading-tight">{activity.description}</p>
                    <p className="text-xs text-muted dark:text-syntax-grey mt-1 font-mono">{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                  <Link to="#" className="text-xs font-mono text-primary dark:text-syntax-blue opacity-0 group-hover:opacity-100 transition-opacity hover:underline shrink-0">View Details</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Share Profile Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm bg-surface dark:bg-editor-panel rounded-3xl p-6 shadow-2xl border border-border dark:border-slate-700 animate-in zoom-in-95 duration-300">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-4 right-4 text-muted dark:text-syntax-grey hover:text-heading dark:hover:text-white bg-surface dark:bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Logo / Header Card */}
            <div className="w-full flex justify-between items-center mb-6">
              <span className="text-xs font-display font-black tracking-widest text-primary dark:text-syntax-blue uppercase">Frontendly Card</span>
              <span className="text-xs font-mono font-bold text-body dark:text-slate-200 bg-surface-raised dark:bg-slate-800 px-2 py-1 rounded-md border border-border dark:border-slate-700">Lv. {userData?.level || 1}</span>
            </div>

            {/* Avatar & Name */}
            <div className="flex flex-col items-center mb-6">
              <img 
                src={userData?.avatarUrl || 'https://ui-avatars.com/api/?name=User&background=e2e8f0&color=475569'} 
                alt="Avatar" 
                className="w-24 h-24 object-cover rounded-full border-4 border-surface dark:border-slate-800 shadow-sm mb-3"
              />
              <h2 className="text-2xl font-display font-black mb-1 text-heading dark:text-white">
                {userData?.username || userData?.name || 'Developer'}
              </h2>
              <p className="text-primary dark:text-syntax-blue text-sm font-bold">{userData?.role === 'user' ? 'Frontend Student' : 'Frontend Master'}</p>
            </div>

            {/* Personal Info */}
            <div className="bg-surface-raised dark:bg-slate-800 rounded-2xl p-4 mb-6 border border-border dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-display font-bold text-muted dark:text-syntax-grey uppercase tracking-wider">Email</span>
                <span className="text-sm font-mono font-semibold text-body dark:text-slate-200">{userData?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-display font-bold text-muted dark:text-syntax-grey uppercase tracking-wider">Phone</span>
                <span className="text-sm font-mono font-semibold text-body dark:text-slate-200">{(userData as UserProfile)?.phoneNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-display font-bold text-muted dark:text-syntax-grey uppercase tracking-wider">Date of Birth</span>
                <span className="text-sm font-mono font-semibold text-body dark:text-slate-200">
                  {(userData as UserProfile)?.dateOfBirth ? new Date((userData as UserProfile).dateOfBirth!).toLocaleDateString('en-GB') : 'N/A'}
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="w-full grid grid-cols-3 gap-3 mb-6">
              <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-2xl text-center border border-blue-100 dark:border-blue-900/50">
                <p className="text-[10px] text-primary dark:text-syntax-blue font-bold mb-1 uppercase tracking-wider font-display">XP</p>
                <p className="font-mono font-black text-blue-700 dark:text-blue-300">{userData?.xp || 0}</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-950/30 p-3 rounded-2xl text-center border border-orange-100 dark:border-orange-900/50">
                <p className="text-[10px] text-orange-600 dark:text-syntax-amber font-bold mb-1 uppercase tracking-wider font-display">Streak</p>
                <p className="font-mono font-black text-orange-700 dark:text-orange-300">{userData?.stats?.streakDays || 0}🔥</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-950/30 p-3 rounded-2xl text-center border border-yellow-100 dark:border-yellow-900/50">
                <p className="text-[10px] text-yellow-600 dark:text-yellow-400 font-bold mb-1 uppercase tracking-wider font-display">Badges</p>
                <p className="font-mono font-black text-yellow-700 dark:text-yellow-300">{badges.length}🏆</p>
              </div>
            </div>

            {/* Action Button */}
            <button 
              className="w-full bg-primary hover:bg-primary-hover dark:bg-syntax-blue dark:hover:bg-blue-500 text-white dark:text-editor-dark font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Profile link copied to clipboard!');
              }}
            >
              <Share2 className="w-4 h-4" />
              Copy Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
