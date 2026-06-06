import React, { useState, useEffect } from 'react';
import { authService } from '../features/auth/services/auth.service';
import { useAuthStore } from '../store/auth.store';
import type { User } from '../features/auth/types/auth.types';
import NetworkErrorCard from '../components/NetworkErrorCard';

export const ProfilePage: React.FC = () => {
  const { currentUser } = useAuthStore();
  const [profileData, setProfileData] = useState<User | null>(null);
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
    const fetchProfile = async () => {
      if (isOffline) return;
      
      setIsLoading(true);
      try {
        const data = await authService.getProfile();
        setProfileData(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [isOffline]);


  if (isOffline) {
    return <NetworkErrorCard onRetry={() => window.location.reload()} onBack={() => window.location.href = '/'} />;
  }

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen py-8 font-sans text-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const userData = profileData || currentUser;

  return (
    <div className="bg-slate-50 min-h-screen py-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* 1. Header Card (User Info) */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <img 
                src={userData?.avatar || "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"} 
                alt="Avatar" 
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
              />
              <span className="absolute bottom-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">
                Lv. {userData?.stats?.level || 1}
              </span>
            </div>
            
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black" style={{ color: '#000000' }}>{userData?.name || userData?.username || 'User'}</h1>
                {userData?.verified && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#2563eb" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="white"/>
                    <circle cx="12" cy="12" r="10" fill="#2563eb"/>
                    <path d="M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="white"/>
                  </svg>
                )}
              </div>
              <p className="text-sm font-semibold text-blue-600 mt-1">{userData?.role || 'Frontend Learner'}</p>
              <p className="text-sm text-slate-500 mt-1 italic">{userData?.bio || '"Code. Learn. Build. Repeat."'}</p>
            </div>

            <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Edit Profile
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                Share Profile
              </button>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
              <span>XP Progress</span>
              <span className="text-slate-900">{userData?.stats?.totalXP || 0} <span className="text-slate-400">/ {userData?.stats?.nextLevelXP || 15000} XP</span></span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${userData?.stats?.xpProgress || 0}%` }}></div>
            </div>
          </div>
        </div>

        {/* 2. Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-xl">🔥</div>
            <div>
              <h3 className="text-2xl font-black">{userData?.stats?.streakDays || 0}</h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Day Streak</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-xl">⭐</div>
            <div>
              <h3 className="text-2xl font-black">{userData?.stats?.totalXP || 0}</h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Total XP</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-xl">🎯</div>
            <div>
              <h3 className="text-2xl font-black">{userData?.stats?.accuracy || 0}%</h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Accuracy</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-xl">🏆</div>
            <div>
              <h3 className="text-2xl font-black">{userData?.stats?.challenges || 0}</h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Challenges</p>
            </div>
          </div>
        </div>

        {/* 3. Middle Grid: Radar, Badges, Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Radar Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
              Proficiency data coming soon
            </div>
          </div>

          {/* Badges Collection */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-900">Badge Collection</h3>
              <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">View all</a>
            </div>
            <div className="grid grid-cols-3 gap-y-6 gap-x-2">
              {(userData?.badges || []).slice(0, 6).map((badge: { icon?: string; name?: string; earnedAt?: Date }, idx: number) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div 
                    className={`w-14 h-14 flex items-center justify-center font-black text-lg mb-2 transition-all ${badge.earnedAt ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-300 grayscale'}`}
                    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                  >
                    {badge.icon || '🏆'}
                  </div>
                  <span className={`text-[10px] font-semibold ${badge.earnedAt ? 'text-slate-600' : 'text-slate-400'}`}>{badge.name || 'Badge'}</span>
                </div>
              ))}
              {(userData?.badges || []).length === 0 && (
                <div className="col-span-3 text-center text-slate-400 text-xs py-4">
                  No badges earned yet
                </div>
              )}
            </div>
          </div>

          {/* Coding Activity Heatmap */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-900">Coding Activity</h3>
              <span className="text-xs text-slate-400 font-medium">Last 3 months</span>
            </div>
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
              Activity data coming soon
            </div>
          </div>
        </div>

        {/* 4. Bottom Grid: Courses & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Courses */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-900">Recent Courses</h3>
              <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">View all</a>
            </div>
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
              Course data coming soon
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
              <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">View all</a>
            </div>
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
              Activity data coming soon
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;