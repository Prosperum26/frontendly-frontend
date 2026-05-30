import React from 'react';

export const ProfilePage: React.FC = () => {
  // Create mock data for Heatmap chart (Coding Activity)
  const heatmapCells = Array.from({ length: 84 }).map((_, i) => {
    // Thuật toán tạo pattern màu ngẫu nhiên nhưng cố định
    const level = i % 7 === 0 ? 4 : i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : i % 2 === 0 ? 1 : 0;
    const colors = ['bg-slate-100', 'bg-blue-200', 'bg-blue-400', 'bg-blue-500', 'bg-blue-700'];
    return <div key={i} className={`w-3 h-3 rounded-sm ${colors[level]}`}></div>;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* 1. Header Card (User Info) */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                alt="Avatar" 
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
              />
              <span className="absolute bottom-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">
                Lv. 14
              </span>
            </div>
            
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Alex Rivers</h1>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#2563eb" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="white"/>
                  <circle cx="12" cy="12" r="10" fill="#2563eb"/>
                  <path d="M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="white"/>
                </svg>
              </div>
              <p className="text-sm font-semibold text-blue-600 mt-1">Frontend Master</p>
              <p className="text-sm text-slate-500 mt-1 italic">"Code. Learn. Build. Repeat."</p>
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
              <span className="text-slate-900">12,450 <span className="text-slate-400">/ 15,000 XP</span></span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: '83%' }}></div>
            </div>
          </div>
        </div>

        {/* 2. Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-xl">🔥</div>
            <div>
              <h3 className="text-2xl font-black">12</h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Day Streak</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-xl">⭐</div>
            <div>
              <h3 className="text-2xl font-black">48.2k</h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Total XP</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-xl">🎯</div>
            <div>
              <h3 className="text-2xl font-black">92%</h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Accuracy</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-xl">🏆</div>
            <div>
              <h3 className="text-2xl font-black">14</h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Challenges</p>
            </div>
          </div>
        </div>

        {/* 3. Middle Grid: Radar, Badges, Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Radar Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-6">Proficiency Radar</h3>
            <div className="relative w-full aspect-square flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full max-w-[200px] text-slate-400">
                {/* Lưới Radar */}
                <polygon points="50,10 90,80 10,80" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2"/>
                <polygon points="50,30 78,70 22,70" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2"/>
                <polygon points="50,50 65,60 35,60" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2"/>
                {/* Đường nối */}
                <line x1="50" y1="50" x2="50" y2="10" stroke="currentColor" strokeWidth="0.5"/>
                <line x1="50" y1="50" x2="90" y2="80" stroke="currentColor" strokeWidth="0.5"/>
                <line x1="50" y1="50" x2="10" y2="80" stroke="currentColor" strokeWidth="0.5"/>
                {/* Data Polygon */}
                <polygon points="50,25 80,75 30,65" fill="rgba(37, 99, 235, 0.1)" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round"/>
                
                <text x="50" y="5" fontSize="6" textAnchor="middle" fill="#64748b" fontWeight="bold">HTML</text>
                <text x="95" y="85" fontSize="6" textAnchor="middle" fill="#64748b" fontWeight="bold">CSS</text>
                <text x="5" y="85" fontSize="6" textAnchor="middle" fill="#64748b" fontWeight="bold">JS</text>
              </svg>
            </div>
          </div>

          {/* Badges Collection */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-900">Badge Collection</h3>
              <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">View all</a>
            </div>
            <div className="grid grid-cols-3 gap-y-6 gap-x-2">
              {[
                { title: 'Flexbox Fanatic', icon: 'FX', active: true },
                { title: 'Grid God', icon: 'GD', active: true },
                { title: 'Async Ace', icon: 'JS', active: true },
                { title: 'A11y Ally', icon: 'A1', active: false },
                { title: 'Clean Coder', icon: 'CC', active: false },
                { title: 'First Flight', icon: '✈️', active: false },
              ].map((badge, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div 
                    className={`w-14 h-14 flex items-center justify-center font-black text-lg mb-2 transition-all ${badge.active ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-300 grayscale'}`}
                    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                  >
                    {badge.icon}
                  </div>
                  <span className={`text-[10px] font-semibold ${badge.active ? 'text-slate-600' : 'text-slate-400'}`}>{badge.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Coding Activity Heatmap */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-900">Coding Activity</h3>
              <span className="text-xs text-slate-400 font-medium">Last 3 months</span>
            </div>
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
            <div className="mt-4 flex justify-end items-center gap-1.5 text-xs text-slate-400">
              <span>Less</span>
              <div className="w-3 h-3 rounded-sm bg-slate-100"></div>
              <div className="w-3 h-3 rounded-sm bg-blue-200"></div>
              <div className="w-3 h-3 rounded-sm bg-blue-400"></div>
              <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
              <div className="w-3 h-3 rounded-sm bg-blue-700"></div>
              <span>More</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Course 1 */}
              <div className="border border-slate-100 p-5 rounded-xl shadow-sm">
                <div className="text-blue-600 font-black text-xl mb-3">CSS</div>
                <h4 className="font-bold text-sm text-slate-900">Advanced CSS</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">12 / 16 lessons</p>
                <div className="h-1.5 w-full bg-slate-100 rounded-full">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              {/* Course 2 */}
              <div className="border border-slate-100 p-5 rounded-xl shadow-sm">
                <div className="text-yellow-500 font-black text-xl mb-3">JS</div>
                <h4 className="font-bold text-sm text-slate-900">JavaScript Basics</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">9 / 15 lessons</p>
                <div className="h-1.5 w-full bg-slate-100 rounded-full">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              {/* Course 3 */}
              <div className="border border-slate-100 p-5 rounded-xl shadow-sm">
                <div className="text-teal-500 font-black text-xl mb-3">RE</div>
                <h4 className="font-bold text-sm text-slate-900">React Essentials</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">6 / 20 lessons</p>
                <div className="h-1.5 w-full bg-slate-100 rounded-full">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
              <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">View all</a>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Completed Advanced Selectors challenge</h4>
                  <p className="text-xs text-slate-400 mt-0.5">+450 XP • 2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 text-orange-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Won CSS Battle against User_992</h4>
                  <p className="text-xs text-slate-400 mt-0.5">+120 XP • 5 hours ago</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Started Lesson BEM Methodology</h4>
                  <p className="text-xs text-slate-400 mt-0.5">In progress • Yesterday</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0 text-purple-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Unlocked Grid God badge</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Milestone • 2 days ago</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;