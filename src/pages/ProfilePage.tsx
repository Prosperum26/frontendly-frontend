
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { profileService } from '../features/profile/services/profile.service';
import { authService } from '../features/auth/services/auth.service';
import type { UserProfile, Badge as BadgeType, ActivityLog } from '../features/profile/types/profile.types';
import NetworkErrorCard from '../components/NetworkErrorCard';
import { Share2, Flame, Star, Trophy, Zap, BookOpen, Target } from 'lucide-react';
import { EditProfileForm } from '../features/profile/components/EditProfileForm';
import { AvatarUpload } from '../features/profile/components/AvatarUpload';
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

  return (
    <div className="bg-surface min-h-screen py-8 font-sans text-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* 1. Header Card (User Info) */}
        <div className="bg-main-bg rounded-2xl p-8 border border-border shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <AvatarUpload 
              currentAvatarUrl={userData?.avatarUrl || currentUser?.avatar}
              level={userData?.level || 1}
              onSuccess={() => window.location.reload()}
            />
            
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-heading">
                  {userData?.username || userData?.name || 'User'}
                </h1>
              </div>
              <p className="text-sm font-semibold text-blue-600 mt-1">
                {userData?.role === 'user' ? 'Frontend Student' : 'Frontend Master'}
              </p>
              <p className="text-sm text-muted mt-1 italic">{userData?.email}</p>
            </div>

            <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
              <button 
                onClick={() => setIsEditing(true)} 
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Edit Profile
              </button>
              <button 
                onClick={() => setIsShareModalOpen(true)} 
                className="flex items-center justify-center gap-2 border border-slate-300 text-body px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-surface transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share Profile
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 border border-red-300 text-red-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between text-xs font-bold text-muted mb-2">
              <span>XP Progress</span>
              <span className="text-heading">{userData?.xp || 0} <span className="text-muted">/ {(userData?.level || 1) * 1000} XP</span></span>
            </div>
            <div className="h-2.5 w-full bg-surface rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full" 
                style={{ width: `${Math.min(((userData?.xp || 0) / ((userData?.level || 1) * 1000)) * 100, 100)}%` }}>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          {isEditing && (
            <div className="mt-4 bg-main-bg p-6 rounded-xl border border-border shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-heading">
                  Update Personal Details
                </h3>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="text-sm text-muted hover:text-body"
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

        <ProgressTrack />

        {/* 2. Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-main-bg p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-xl">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black">{userData?.stats?.streakDays || 0}</h3>
              <p className="text-xs text-muted font-semibold uppercase tracking-wider mt-0.5">Day Streak</p>
            </div>
          </div>

          <div className="bg-main-bg p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-xl">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black">{userData?.xp || 0}</h3>
              <p className="text-xs text-muted font-semibold uppercase tracking-wider mt-0.5">Total XP</p>
            </div>
          </div>

          <div className="bg-main-bg p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-xl">
              <Target className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black">{userData?.stats?.coursesCompleted || 0}</h3>
              <p className="text-xs text-muted font-semibold uppercase tracking-wider mt-0.5">Courses</p>
            </div>
          </div>

          <div className="bg-main-bg p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
              <Trophy className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black">{badges.length}</h3>
              <p className="text-xs text-muted font-semibold uppercase tracking-wider mt-0.5">Badges</p>
            </div>
          </div>
        </div>

        {/* 3. Middle Grid: Radar, Badges, Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Radar Chart Placeholder */}
          <div className="bg-main-bg p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="text-xs font-bold text-heading uppercase tracking-wider mb-6">Proficiency Radar</h3>
            <div className="relative w-full aspect-square flex flex-col items-center justify-center">
              {userData?.skills && userData.skills.length >= 3 ? (
                <svg viewBox="0 0 100 100" className="w-full h-full max-w-[200px] text-muted">
                  <polygon points="50,10 90,80 10,80" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                  <polygon points="50,30 78,70 22,70" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                  <polygon points="50,50 65,60 35,60" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="50" y1="50" x2="50" y2="10" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="50" y1="50" x2="90" y2="80" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="50" y1="50" x2="10" y2="80" stroke="currentColor" strokeWidth="0.5" />
                  
                  {/* Dynamic Polygon based on skills */}
                  {(() => {
                    const htmlSkill = userData.skills?.find((s: { name: string; level: number }) => s.name.toLowerCase() === 'html')?.level || 1;
                    const cssSkill = userData.skills?.find((s: { name: string; level: number }) => s.name.toLowerCase() === 'css')?.level || 1;
                    const jsSkill = userData.skills?.find((s: { name: string; level: number }) => s.name.toLowerCase() === 'js')?.level || 1;
                    
                    // Normalize level (1-10) to radius (0-40)
                    const r1 = (htmlSkill / 10) * 40;
                    const r2 = (cssSkill / 10) * 40;
                    const r3 = (jsSkill / 10) * 40;
                    
                    const p1 = `50,${50 - r1}`;
                    const p2 = `${50 + r2 * Math.cos(Math.PI / 6)},${50 + r2 * Math.sin(Math.PI / 6)}`;
                    const p3 = `${50 - r3 * Math.cos(Math.PI / 6)},${50 + r3 * Math.sin(Math.PI / 6)}`;
                    
                    return <polygon points={`${p1} ${p2} ${p3}`} fill="rgba(37, 99, 235, 0.1)" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />;
                  })()}

                  <text x="50" y="5" fontSize="6" textAnchor="middle" fill="currentColor" fontWeight="bold">HTML</text>
                  <text x="95" y="85" fontSize="6" textAnchor="middle" fill="currentColor" fontWeight="bold">CSS</text>
                  <text x="5" y="85" fontSize="6" textAnchor="middle" fill="currentColor" fontWeight="bold">JS</text>
                </svg>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-[10px] text-muted font-medium px-4">Complete more lessons to see your proficiency radar</p>
                </div>
              )}
            </div>
          </div>

          {/* Badges Collection */}
          <div className="bg-main-bg p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-heading">Badge Collection</h3>
              <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">View all</a>
            </div>
            <div className="flex flex-col items-center justify-center min-h-[180px]">
              {badges.length === 0 ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-xs text-muted font-medium px-6 text-center">No badges earned yet. Complete challenges to unlock them!</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-y-6 gap-x-2 w-full">
                  {badges.slice(0, 6).map((badge, idx) => (
                    <div key={`profile-badge-${String(badge.id || idx)}`} className="flex flex-col items-center text-center">
                      <Badge badge={badge} size="lg" />
                      <span className="text-[10px] font-semibold text-body line-clamp-1 mt-2">{badge.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Activity Heatmap */}
          <CodingActivity />
        </div>

        {/* 4. Recent Activity Feed */}
        <div className="bg-main-bg rounded-2xl border border-border shadow-sm">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Star className="w-5 h-5 text-blue-600" />
              Recent Achievements
            </h3>
          </div>
          <div className="divide-y divide-border">
            {activities.length === 0 ? (
              <p className="p-6 text-center text-muted text-sm italic">No recent activities</p>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="p-5 flex items-start gap-4 hover:bg-surface/50 transition-colors">
                  <div className={`mt-1 p-2 rounded-lg ${
                    activity.type === 'lesson_completed' ? 'bg-green-50 text-green-600' :
                    activity.type === 'challenge_won' ? 'bg-blue-50 text-blue-600' :
                    'bg-orange-50 text-orange-600'
                  }`}>
                    {activity.type === 'lesson_completed' ? <BookOpen className="w-4 h-4" /> :
                     activity.type === 'challenge_won' ? <Trophy className="w-4 h-4" /> :
                     <Zap className="w-4 h-4" />}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-heading font-bold leading-tight">{activity.description}</p>
                    <p className="text-xs text-muted mt-1 font-medium">{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                  <Link to="#" className="text-xs text-blue-600 font-bold hover:underline shrink-0">View Details</Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Share Profile Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm bg-main-bg rounded-3xl p-6 shadow-2xl border border-border animate-in zoom-in-95 duration-300">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-4 right-4 text-muted hover:text-body bg-surface hover:bg-surface p-1.5 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Logo / Header Card */}
            <div className="w-full flex justify-between items-center mb-6">
              <span className="text-xs font-black tracking-widest text-blue-600 uppercase">Frontendly Card</span>
              <span className="text-xs font-bold text-body bg-surface px-2 py-1 rounded-md border border-border">Lv. {userData?.level || 1}</span>
            </div>

            {/* Avatar & Name */}
            <div className="flex flex-col items-center mb-6">
              <img 
                src={userData?.avatarUrl || 'https://ui-avatars.com/api/?name=User&background=e2e8f0&color=475569'} 
                alt="Avatar" 
                className="w-24 h-24 object-cover rounded-full border-4 border-surface shadow-sm mb-3"
              />
              <h2 className="text-2xl font-black mb-1 text-heading">
                {userData?.username || userData?.name || 'Developer'}
              </h2>
              <p className="text-blue-600 text-sm font-bold">{userData?.role === 'user' ? 'Frontend Student' : 'Frontend Master'}</p>
            </div>

            {/* Personal Info */}
            <div className="bg-surface rounded-2xl p-4 mb-6 border border-border space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Email</span>
                <span className="text-sm font-semibold text-body">{userData?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Phone</span>
                <span className="text-sm font-semibold text-body">{(userData as UserProfile)?.phoneNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Date of Birth</span>
                <span className="text-sm font-semibold text-body">
                  {(userData as UserProfile)?.dateOfBirth ? new Date((userData as UserProfile).dateOfBirth!).toLocaleDateString('en-GB') : 'N/A'}
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="w-full grid grid-cols-3 gap-3 mb-6">
              <div className="bg-blue-50/50 p-3 rounded-2xl text-center border border-blue-100">
                <p className="text-[10px] text-blue-600 font-bold mb-1 uppercase tracking-wider">XP</p>
                <p className="font-black text-blue-700">{userData?.xp || 0}</p>
              </div>
              <div className="bg-orange-50/50 p-3 rounded-2xl text-center border border-orange-100">
                <p className="text-[10px] text-orange-600 font-bold mb-1 uppercase tracking-wider">Streak</p>
                <p className="font-black text-orange-700">{userData?.stats?.streakDays || 0}🔥</p>
              </div>
              <div className="bg-yellow-50/50 p-3 rounded-2xl text-center border border-yellow-100">
                <p className="text-[10px] text-yellow-600 font-bold mb-1 uppercase tracking-wider">Badges</p>
                <p className="font-black text-yellow-700">{badges.length}🏆</p>
              </div>
            </div>

            {/* Action Button */}
            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5"
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
