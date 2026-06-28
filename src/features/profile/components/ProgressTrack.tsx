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
    <div className="bg-main-bg rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-500 mt-4 animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden dark:bg-surface dark:border-border">
      {isCompleted && (
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-500/5 dark:bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
      )}

      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-bold text-heading flex items-center gap-2.5 dark:text-heading">
          <div className={`p-2 rounded-xl ${isCompleted ? 'bg-green-50 dark:bg-green-900/30 text-green-500 dark:text-green-400' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400'}`}>
            {isCompleted ? <Award className="w-5 h-5 animate-bounce" /> : <Target className="w-5 h-5" />}
          </div>
          Learning Progress
        </h3>
        <div>
          {progress.isUnlocked ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2.5 py-1 rounded-full border border-green-100 dark:border-green-700">
              <Unlock className="w-3.5 h-3.5" /> Unlocked
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-bold text-muted bg-surface dark:bg-slate-700 px-2.5 py-1 rounded-full border border-border dark:border-slate-600">
              <Lock className="w-3.5 h-3.5" /> Locked
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-blue-50 dark:bg-slate-700/60 p-3 rounded-xl border border-blue-100 dark:border-slate-600/80">
          <p className="text-xs font-semibold text-blue-700 dark:text-muted uppercase tracking-wider">Current Milestone</p>
          <p className="text-base font-bold text-heading mt-0.5 dark:text-slate-200">{progress.currentMilestone}</p>
        </div>
        <div className="bg-emerald-50 dark:bg-slate-700/60 p-3 rounded-xl border border-emerald-100 dark:border-slate-600/80 text-right">
          <p className="text-xs font-semibold text-emerald-700 dark:text-muted uppercase tracking-wider">Lessons Completed</p>
          <p className="text-base font-bold text-heading mt-0.5 dark:text-slate-200">
            <span className="text-emerald-600 dark:text-blue-400 font-black">{progress.completedLessons}</span>
            <span className="text-emerald-700/60 dark:text-slate-500 font-normal"> / {progress.totalLessons}</span>
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="w-full bg-blue-100 dark:bg-slate-700 rounded-full h-4 overflow-hidden p-0.5 shadow-inner flex items-center">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ease-out ${
              isCompleted 
                ? 'bg-gradient-to-r from-emerald-500 to-green-500 shadow-[0_0_12px_rgba(16,185,129,0.4)] animate-pulse' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]'
            }`} 
            style={{ width: `${progress.completionPercentage}%` }}
          />
        </div>
        
        <div className={`text-right text-lg font-black transition-colors duration-300 ${isCompleted ? 'text-emerald-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
          {progress.completionPercentage}%
        </div>
      </div>
    </div>
  );
};
