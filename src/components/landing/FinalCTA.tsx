import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Sparkles, Rocket } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export const FinalCTA: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 dark:from-blue-500 dark:via-purple-500 dark:to-blue-600 text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)] animate-pulse" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 dark:bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 dark:bg-white/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-8 animate-bounce">
            <Rocket className="w-10 h-10" />
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Ready to Start Your
            <span className="block">React Journey?</span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-blue-100 dark:text-blue-200 mb-10 max-w-2xl mx-auto">
            Join thousands of developers learning React the interactive way. 
            No setup required, start coding in seconds.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              to={ROUTES.REGISTER}
              className="group inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-white/25 dark:hover:shadow-white/40 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              <Play className="w-5 h-5" />
              <span>Start Learning Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to={ROUTES.LEARNING_PATH}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 dark:hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              <Sparkles className="w-5 h-5" />
              <span>Explore Curriculum</span>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-blue-100 dark:text-blue-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '12', label: 'Lessons' },
            { value: '12', label: 'Exercises' },
            { value: '20', label: 'Topics' },
            { value: '40', label: 'Hours' }
          ].map((stat, index) => (
            <div key={index}>
              <div className="text-3xl md:text-4xl font-black mb-1">{stat.value}</div>
              <div className="text-sm text-blue-100 dark:text-blue-200">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
