import React, { useState, useEffect } from 'react';
import { curriculumData } from '../../data/curriculum-data';
import { Users, BookOpen, Code2, Award, Clock } from 'lucide-react';

export const PlatformStats: React.FC = () => {
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    setAnimateStats(true);
  }, []);

  const stats = [
    { value: curriculumData.totalLessons, label: 'Lessons', icon: BookOpen, suffix: '' },
    { value: curriculumData.totalExercises, label: 'Exercises', icon: Code2, suffix: '' },
    { value: curriculumData.totalTopics, label: 'Topics', icon: Award, suffix: '' },
    { value: curriculumData.estimatedHours, label: 'Hours', icon: Clock, suffix: '+' },
    { value: 10000, label: 'Learners', icon: Users, suffix: '+' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Award className="w-4 h-4" />
            <span>Platform Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-heading dark:text-slate-100 mb-4">
            Built for Scale
          </h2>
          <p className="text-lg text-body dark:text-slate-300 max-w-2xl mx-auto">
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
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center border-2 border-border dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-black text-heading dark:text-slate-100 mb-1">
                  {animateStats ? (
                    <span className="animate-count-up">
                      {stat.value.toLocaleString()}{stat.suffix}
                    </span>
                  ) : (
                    <span>{stat.value.toLocaleString()}{stat.suffix}</span>
                  )}
                </div>
                <div className="text-sm font-semibold text-muted dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Competency Progress */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 border-2 border-border dark:border-slate-600">
          <h3 className="text-2xl font-bold text-heading dark:text-slate-100 mb-8 text-center">
            Curriculum Coverage
          </h3>
          <div className="space-y-6">
            {curriculumData.competencies.map((competency, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-heading dark:text-slate-100">
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
