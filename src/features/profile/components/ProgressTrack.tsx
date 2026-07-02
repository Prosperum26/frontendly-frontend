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
    <div className="bg-surface dark:bg-editor-panel rounded-xl border border-border dark:border-slate-800 p-6 hover:border-slate-700 transition-all duration-300 relative overflow-hidden">
      {isCompleted && (
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-500/5 dark:bg-syntax-green/10 rounded-full blur-3xl pointer-events-none" />
      )}

      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-display font-bold text-heading dark:text-white flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${isCompleted ? 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-syntax-green' : 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-syntax-blue'}`}>
            {isCompleted ? <Award className="w-5 h-5" /> : <Target className="w-5 h-5" />}
          </div>
          Learning Progress
        </h3>
        <div>
          {progress.isUnlocked ? (
            <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-green-600 dark:text-syntax-green bg-green-50 dark:bg-green-950/30 px-2.5 py-1 rounded-full border border-green-100 dark:border-green-900/50">
              <Unlock className="w-3.5 h-3.5" /> Unlocked
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-muted dark:text-syntax-grey bg-surface dark:bg-slate-800 px-2.5 py-1 rounded-full border border-border dark:border-slate-700">
              <Lock className="w-3.5 h-3.5" /> Locked
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-xl border border-blue-100 dark:border-blue-900/50">
          <p className="text-xs font-display font-semibold text-blue-700 dark:text-syntax-blue uppercase tracking-wider">Current Milestone</p>
          <p className="text-base font-display font-bold text-heading dark:text-white mt-0.5">{progress.currentMilestone}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-xl border border-green-100 dark:border-green-900/50 text-right">
          <p className="text-xs font-display font-semibold text-green-700 dark:text-syntax-green uppercase tracking-wider">Lessons Completed</p>
          <p className="text-base font-display font-bold text-heading dark:text-white mt-0.5">
            <span className="font-mono text-green-600 dark:text-syntax-green font-black">{progress.completedLessons}</span>
            <span className="text-muted dark:text-syntax-grey font-normal"> / {progress.totalLessons}</span>
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="w-full bg-surface-raised dark:bg-slate-800 rounded-full h-4 overflow-hidden p-0.5 shadow-inner flex items-center">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ease-out ${
              isCompleted 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 dark:from-syntax-green dark:to-green-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-syntax-blue dark:to-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.3)]'
            }`} 
            style={{ width: `${progress.completionPercentage}%` }}
          />
        </div>
        
        <div className={`text-right text-lg font-mono font-black transition-colors duration-300 ${isCompleted ? 'text-green-600 dark:text-syntax-green' : 'text-blue-600 dark:text-syntax-blue'}`}>
          {progress.completionPercentage}%
        </div>
      </div>
    </div>
  );
};
