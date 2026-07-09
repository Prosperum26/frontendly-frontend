import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Target, ChevronRight, CheckCircle } from 'lucide-react';
import { curriculumData } from '../../data/curriculum-data';
import { ROUTES } from '../../constants/routes';

export const CurriculumPreview: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Your Path to React Mastery
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            A structured learning journey designed to take you from beginner to advanced React developer
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Milestones', value: curriculumData.totalMilestones, icon: Target },
            { label: 'Lessons', value: curriculumData.totalLessons, icon: BookOpen },
            { label: 'Exercises', value: curriculumData.totalExercises, icon: CheckCircle },
            { label: 'Hours', value: curriculumData.estimatedHours, icon: Clock }
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-800 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300 border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-lg dark:shadow-cyan-500/10"
            >
              <stat.icon className="w-8 h-8 text-cyan-600 dark:text-cyan-400 mx-auto mb-3" />
              <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Milestones */}
        <div className="space-y-8 mb-16">
          {curriculumData.milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className="group relative bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-800 rounded-2xl p-8 border-2 border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-500 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/20"
            >
              {/* Milestone number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-cyan-500/20">
                {index + 1}
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: milestone.color }}
                    >
                      {milestone.difficulty}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {milestone.lessons} Lessons
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">{milestone.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {milestone.topics.map((topic, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-cyan-50 dark:bg-slate-700 text-cyan-700 dark:text-cyan-300 rounded-full text-xs font-semibold"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mb-4">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${((index + 1) / curriculumData.totalMilestones) * 100}%`,
                        backgroundColor: milestone.color
                      }}
                    />
                  </div>
                  <Link
                    to={ROUTES.LEARNING_PATH}
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline group-hover:translate-x-2 transition-transform"
                  >
                    View Details <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sample Lessons */}
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            Sample Lessons
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {curriculumData.sampleLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer dark:hover:shadow-blue-500/10"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      lesson.level === 'easy'
                        ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                        : lesson.level === 'medium'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                    }`}
                  >
                    {lesson.level}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{lesson.milestone}</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">{lesson.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">{lesson.description}</p>
                <div className="flex flex-wrap gap-1">
                  {lesson.tags.slice(0, 2).map((tag, j) => (
                    <span
                      key={j}
                      className="px-2 py-0.5 bg-cyan-50 dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
