import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../features/auth/services/auth.service';
import { useAuthStore } from '../store/auth.store';
import type { User } from '../features/auth/types/auth.types';
import NetworkErrorCard from '../components/NetworkErrorCard';
import { Edit, Share2, Flame, Star, Target, Trophy, Check, Zap, BookOpen } from 'lucide-react';

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

  // Create mock data for heatmap (Coding Activity)
  const heatmapCells = Array.from({ length: 84 }).map((_, i) => {
    const level = i % 7 === 0 ? 4 : i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : i % 2 === 0 ? 1 : 0;
    const colors = ['bg-slate-100', 'bg-blue-200', 'bg-blue-400', 'bg-blue-500', 'bg-blue-700'];
    return <div key={i} className={`w-3 h-3 rounded-sm ${colors[level]}`}></div>;
  });

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
                <h1 className="text-2xl font-bold">{userData?.name || userData?.username || 'User'}</h1>
                <Check className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-sm font-semibold text-blue-600 mt-1">{userData?.role || 'Frontend Master'}</p>
              <p className="text-sm text-slate-500 mt-1 italic">{userData?.bio || '"Code. Learn. Build. Repeat."'}</p>
            </div>



            <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
                <Share2 className="w-4 h-4" />
                Share Profile
              </button>
            </div>

          </div>



          <div className="mt-8">

            <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
              <span>XP Progress</span>
              <span className="text-slate-900">{userData?.xp || userData?.stats?.totalXP || 0} <span className="text-slate-400">/ 15,000 XP</span></span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${((userData?.xp || userData?.stats?.totalXP || 0) / 15000) * 100}%` }}></div>
            </div>

          </div>

        </div>



        {/* 2. Stats Row */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-xl">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black">{userData?.stats?.streakDays || userData?.stats?.streak_days || 0}</h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Day Streak</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-xl">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black">{userData?.xp || userData?.stats?.totalXP || 0}</h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Total XP</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-xl">
              <Target className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black">{userData?.stats?.accuracy || 0}%</h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Accuracy</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-xl">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black">{userData?.stats?.challenges || userData?.stats?.challenges_completed || 0}</h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Challenges</p>
            </div>
          </div>

        </div>



        {/* 3. Middle Grid: Radar, Badges, Heatmap */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">



          {/* Radar Chart */}

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-6">Proficiency Radar</h3>

            <div className="relative w-full aspect-square flex flex-col items-center justify-center">
              {!userData?.skills || userData.skills.length === 0 ? (
                <div className="text-center px-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">You haven't coded anything yet.</p>
                  <button className="text-xs text-blue-600 font-bold mt-2 hover:underline">Start coding →</button>
                </div>
              ) : (
                <svg viewBox="0 0 100 100" className="w-full h-full max-w-[200px] text-slate-400">
                  {/* Lưới Radar */}
                  <polygon points="50,10 90,80 10,80" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                  <polygon points="50,30 78,70 22,70" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                  <polygon points="50,50 65,60 35,60" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                  {/* Đường nối */}
                  <line x1="50" y1="50" x2="50" y2="10" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="50" y1="50" x2="90" y2="80" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="50" y1="50" x2="10" y2="80" stroke="currentColor" strokeWidth="0.5" />
                  {/* Data Polygon */}
                  <polygon points="50,25 80,75 30,65" fill="rgba(37, 99, 235, 0.1)" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" />
                  <text x="50" y="5" fontSize="6" textAnchor="middle" fill="#64748b" fontWeight="bold">HTML</text>
                  <text x="95" y="85" fontSize="6" textAnchor="middle" fill="#64748b" fontWeight="bold">CSS</text>
                  <text x="5" y="85" fontSize="6" textAnchor="middle" fill="#64748b" fontWeight="bold">JS</text>
                </svg>
              )}
            </div>

          </div>



          {/* Badges Collection */}

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

            <div className="flex justify-between items-center mb-6">

              <h3 className="text-sm font-bold text-slate-900">Badge Collection</h3>

              <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">View all</a>

            </div>

            <div className="flex flex-col items-center justify-center min-h-[180px]">
              {!userData?.badges || userData.badges.length === 0 ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium px-6">No badges earned yet. Complete challenges to unlock them!</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-y-6 gap-x-2 w-full">
                  {userData.badges.slice(0, 6).map((badge: any, idx: number) => (
                    <div key={idx} className="flex flex-col items-center text-center">
                      <div
                        className="w-14 h-14 flex items-center justify-center font-black text-lg mb-2 transition-all bg-blue-50 text-blue-600"
                        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                      >
                        {badge.icon || badge.name?.substring(0, 2).toUpperCase() || '??'}
                      </div>
                      <span className="text-[10px] font-semibold text-slate-600 line-clamp-1">{badge.name}</span>
                    </div>
                  ))}
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

            <div className="flex flex-col h-full">
              {!userData?.stats?.lastActiveAt ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <Flame className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium text-center px-4">You haven't coded anything yet. Start a challenge to see your activity!</p>
                </div>
              ) : (
                <div className="flex items-start gap-2 overflow-x-auto pb-2">
                  <div className="flex flex-col gap-[7px] text-[9px] text-slate-400 font-medium pt-1">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                    <span>Sun</span>
                  </div>
                  <div className="grid grid-rows-7 grid-flow-col gap-1.5">
                    {heatmapCells}
                  </div>
                </div>
              )}

              <div className="mt-auto pt-4 flex justify-between items-center border-t border-slate-50">
                <p className="text-[10px] text-slate-400 font-medium italic">Keep your streak alive!</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>Less</span>
                  <div className="w-3 h-3 rounded-sm bg-slate-100"></div>
                  <div className="w-3 h-3 rounded-sm bg-blue-700"></div>
                  <span>More</span>
                </div>
              </div>
            </div>

          </div>

        </div>



        {/* 4. Bottom Grid: Courses & Recent Activity */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">



          {/* Recent Courses */}

          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

            <div className="flex justify-between items-center mb-6">

              <h3 className="text-sm font-bold text-slate-900">Recent Courses</h3>

              <button className="text-xs font-semibold text-blue-600 hover:underline">View all</button>

            </div>

            <div className="min-h-[160px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl">
              {(!userData as any)?.recent_courses || (userData as any)?.recent_courses?.length === 0 ? (
                <div className="text-center">
                  <p className="text-sm text-slate-500 font-medium italic mb-3">"The journey of a thousand miles begins with a single line of code."</p>
                  <Link to="/learning-path" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
                    <BookOpen className="w-3.5 h-3.5" />
                    Find your first course
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full p-2">
                   {/* Render actual courses here */}
                </div>
              )}
            </div>

          </div>



          {/* Recent Activity */}

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

            <div className="flex justify-between items-center mb-6">

              <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>

              <button className="text-xs font-semibold text-blue-600 hover:underline">View all</button>

            </div>

            <div className="space-y-6">
              {(!userData as any)?.activities || (userData as any)?.activities?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 opacity-60">
                   <Zap className="w-8 h-8 text-slate-300 mb-2" />
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No Activity Yet</p>
                   <p className="text-[10px] text-slate-400 mt-1 text-center">Your progress will be tracked here.</p>
                </div>
              ) : (
                <div className="space-y-6">
                   {/* Render actual activities here */}
                </div>
              )}
            </div>

          </div>



        </div>

      </div>

    </div>

  );

};



export default ProfilePage;