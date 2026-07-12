import React from 'react';
import { whyLearnHere } from '../../data/curriculum-data';
import { 
  BookOpen, Code2, Zap, Trophy, FolderOpen, 
  Cpu, Sparkles, Heart, Terminal
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Code2,
  Zap,
  Trophy,
  FolderOpen,
  Cpu,
  Sparkles,
  Heart,
  Terminal
};

export const WhyLearnHere: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Built for Modern React Developers
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Everything you need to go from beginner to professional, all in one platform
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyLearnHere.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Sparkles;
            return (
              <div
                key={index}
                className="group bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-800 rounded-2xl p-6 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer border-2 border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-500"
              >
                <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Icon className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
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

      </div>
    </section>
  );
};
