import { useState, useEffect } from 'react';
import { Target, Lock, Unlock, Award } from 'lucide-react';
import { profileService, type LearningProgress } from '../services/profile.service';

export const ProgressTrack = () => {
  const [progress, setProgress] = useState<LearningProgress>({
    totalLessons: 0,
    completedLessons: 0,
    completionPercentage: 0,
    currentMilestone: '-',
    isUnlocked: false,
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await profileService.fetchLearningProgress();
        setProgress(data);
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };
    fetchProgress();
  }, []);

  const isCompleted = progress.completionPercentage === 100;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-500 mt-4 animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden">
      {isCompleted && (
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
      )}

      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${isCompleted ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-blue-500'}`}>
            {isCompleted ? <Award className="w-5 h-5 animate-bounce" /> : <Target className="w-5 h-5" />}
          </div>
          Learning Progress
        </h3>
        <div>
          {progress.isUnlocked ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
              <Unlock className="w-3.5 h-3.5" /> Unlocked
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
              <Lock className="w-3.5 h-3.5" /> Locked
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100/80">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Milestone</p>
          <p className="text-base font-bold text-slate-800 mt-0.5">{progress.currentMilestone}</p>
        </div>
        <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100/80 text-right">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lessons Completed</p>
          <p className="text-base font-bold text-slate-800 mt-0.5">
            <span className="text-blue-600 font-black">{progress.completedLessons}</span>
            <span className="text-slate-400 font-normal"> / {progress.totalLessons}</span>
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden p-0.5 shadow-inner flex items-center">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ease-out ${
              isCompleted 
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)] animate-pulse' 
                : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 shadow-[0_0_10px_rgba(99,102,241,0.15)]'
            }`} 
            style={{ width: `${progress.completionPercentage}%` }}
          />
        </div>
        
        <div className={`text-right text-lg font-black transition-colors duration-300 ${isCompleted ? 'text-green-500' : 'text-blue-600'}`}>
          {progress.completionPercentage}%
        </div>
      </div>
    </div>
  );
};
