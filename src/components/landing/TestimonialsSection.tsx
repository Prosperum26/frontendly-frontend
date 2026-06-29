import React from 'react';
import { testimonials } from '../../data/curriculum-data';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-yellow-200 dark:border-yellow-500/30">
            <Star className="w-4 h-4" />
            <span>Student Success</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Loved by Learners
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Join thousands of developers who transformed their careers with FrontEndly
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-800 rounded-2xl p-8 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/20 transition-all duration-300 border-2 border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-500 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-12 h-12" style={{ color: testimonial.color }} />
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: testimonial.color }}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {testimonial.username} • Level {testimonial.level}
                  </p>
                </div>
              </div>

              {/* Review */}
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 relative z-10">
                "{testimonial.review}"
              </p>

              {/* XP Badge */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {testimonial.xp} XP earned
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 flex-wrap justify-center">
            {['Structured Curriculum', 'Interactive Learning', 'Real Projects'].map((indicator, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-heading dark:text-slate-100">
                  {indicator}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
