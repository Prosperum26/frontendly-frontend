import React from 'react';
import { gamificationFeatures } from '../../data/curriculum-data';
import { 
  Trophy, Swords, TrendingUp, Map, 
  Terminal, Sparkles, Star, Flame, Award, Target
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  XP: Trophy,
  Level: TrendingUp,
  Streak: Flame,
  Badge: Award,
  Challenge: Swords,
  Progress: Target,
  Path: Map,
  Playground: Terminal
};

export const GamificationSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-purple-200 dark:border-purple-500/30">
            <Sparkles className="w-4 h-4" />
            <span>Gamified Learning</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Learn While You Play
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Stay motivated with XP, levels, streaks, and achievements as you master React
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gamificationFeatures.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Star;
            return (
              <div
                key={index}
                className="group bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 cursor-pointer"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <Icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Highlight Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl shadow-blue-500/20 dark:shadow-blue-500/40">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.3),transparent_50%)]" />
          </div>
          <div className="relative z-10 text-center">
            <h3 className="text-2xl md:text-3xl font-black mb-3">
              Compete & Climb the Ranks
            </h3>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Test your skills with coding challenges, climb the leaderboards, and earn exclusive rewards
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
