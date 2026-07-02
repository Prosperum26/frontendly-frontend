import React, { useState, useEffect, useRef } from 'react';
import { curriculumData } from '../../data/curriculum-data';
import { BookOpen, Code2, Award, Clock } from 'lucide-react';

export const PlatformStats: React.FC = () => {
  const [animateStats, setAnimateStats] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      setAnimateStats(true);
      hasMounted.current = true;
    }
  }, []);

  const stats = [
    { value: curriculumData.totalLessons, label: 'Lessons', icon: BookOpen, suffix: '' },
    { value: curriculumData.totalExercises, label: 'Exercises', icon: Code2, suffix: '' },
    { value: curriculumData.totalTopics, label: 'Topics', icon: Award, suffix: '' },
    { value: curriculumData.estimatedHours, label: 'Hours', icon: Clock, suffix: '+' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-cyan-50/50 to-blue-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-cyan-200 dark:border-cyan-500/30">
            <Award className="w-4 h-4" />
            <span>Platform Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Built for Scale
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Comprehensive curriculum designed to take you from beginner to professional
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 text-center border-2 border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-500 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/20"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1">
                  {animateStats ? (
                    <span className="animate-count-up">
                      {stat.value.toLocaleString()}{stat.suffix}
                    </span>
                  ) : (
                    <span>{stat.value.toLocaleString()}{stat.suffix}</span>
                  )}
                </div>
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Competency Progress */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 border-2 border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-lg dark:shadow-blue-500/10">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Curriculum Coverage
          </h3>
          <div className="space-y-6">
            {curriculumData.competencies.map((competency, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {competency.name}
                  </span>
                  <span className="font-bold" style={{ color: competency.color }}>
                    {competency.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: animateStats ? `${competency.percentage}%` : '0%',
                      backgroundColor: competency.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
