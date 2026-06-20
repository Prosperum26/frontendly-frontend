import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { profileService } from '../features/profile/services/profile.service';
import type { UserProfile, Badge, ActivityLog } from '../features/profile/types/profile.types';
import NetworkErrorCard from '../components/NetworkErrorCard';
import { Edit, Share2, Flame, Star, Target, Trophy, Check, Zap, BookOpen } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser } = useAuthStore();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [activityStats, setActivityStats] = useState<Array<{ date: string; count: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const loadProfileData = async () => {
      if (isOffline) return;
      
      setIsLoading(true);
      try {
        const [profile, badgeList, activityList, statsList] = await Promise.all([
          profileService.fetchProfile(),
          profileService.fetchBadges(),
          profileService.fetchActivity(),
          profileService.fetchActivityStats(),
        ]);
        setProfileData(profile);
        setBadges(Array.isArray(badgeList) ? badgeList : []);
        setActivities(Array.isArray(activityList) ? activityList : []);
        setActivityStats(Array.isArray(statsList) ? statsList : []);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [isOffline]);

  // Create real data for heatmap (Coding Activity)
  const heatmapCells = useMemo(() => {
    // Last 84 days (12 weeks)
    const cells = [];
    const today = new Date();
    
    // Create a map for quick lookup
    const statsMap = new Map(activityStats.map(s => [s.date, s.count]));

    for (let i = 83; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = statsMap.get(dateStr) || 0;
      
      const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 10 ? 3 : 4;
      const colors = ['bg-slate-100', 'bg-blue-200', 'bg-blue-400', 'bg-blue-500', 'bg-blue-700'];
      
      cells.push(
        <div 
          key={dateStr} 
          className={`w-3 h-3 rounded-sm ${colors[level]} transition-colors`}
          title={`${dateStr}: ${count} activities`}
        ></div>
      );
    }
    return cells;
  }, [activityStats]);

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

  const userData = profileData || currentUser;

  return (
    <div className="bg-surface min-h-screen py-8 font-sans text-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* 1. Header Card (User Info) */}
        <div className="bg-main-bg rounded-2xl p-8 border border-border shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <img
                src={userData?.avatar || userData?.avatarUrl || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
              />
              <span className="absolute bottom-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">
                Lv. {userData?.level || 1}
              </span>
            </div>

            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{userData?.username || userData?.name || 'User'}</h1>
                <Check className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-sm font-semibold text-blue-600 mt-1">{userData?.role === 'user' ? 'Frontend Student' : 'Frontend Master'}</p>
              <p className="text-sm text-slate-500 mt-1 italic">{userData?.email}</p>
            </div>

            <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-slate-300 text-body px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-surface transition-colors">
                <Share2 className="w-4 h-4" />
                Share Profile
              </button>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
              <span>XP Progress</span>
              <span className="text-heading">{userData?.xp || 0} <span className="text-muted">/ {(userData?.level || 1) * 1000} XP</span></span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(((userData?.xp || 0) / ((userData?.level || 1) * 1000)) * 100, 100)}%` }}></div>
            </div>
          </div>
        </div>

        {/* 2. Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-main-bg p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-xl">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black">{userData?.stats?.streakDays || 0}</h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Day Streak</p>
            </div>
          </div>

          <div className="bg-main-bg p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-xl">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black">{userData?.xp || 0}</h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Total XP</p>
            </div>
          </div>

          <div className="bg-main-bg p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-xl">
              <Target className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black">{userData?.stats?.coursesCompleted || 0}</h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Courses</p>
            </div>
          </div>

          <div className="bg-main-bg p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
              <Trophy className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black">{badges.length}</h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Badges</p>
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
                  <p className="text-xs text-slate-500 font-medium px-6 text-center">No badges earned yet. Complete challenges to unlock them!</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-y-6 gap-x-2 w-full">
                  {badges.slice(0, 6).map((badge, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 flex items-center justify-center mb-2 transition-all">
                        <img src={badge.icon} alt={badge.name} className="w-full h-full object-contain dark:opacity-90 dark:brightness-95" />
                      </div>
                      <span className="text-[10px] font-semibold text-body line-clamp-1">{badge.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Activity Heatmap */}
          <div className="bg-main-bg p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-heading">Coding Activity</h3>
              <span className="text-xs text-muted font-medium">Last 3 months</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {heatmapCells}
            </div>
          </div>
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
    </div>

  );

};



export default ProfilePage;