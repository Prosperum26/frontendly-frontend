import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, Code2 } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export const HeroSection: React.FC = () => {
  const [symbolPositions, setSymbolPositions] = useState<Array<{
    symbol: string;
    left: number;
    top: number;
    animationDelay: number;
    animationDuration: number;
  }>>([]);

  useEffect(() => {
    // Generate random positions once on mount
    const positions = ['<', '>', '{', '}', '()', '[]', '//', '=>'].map((symbol, i) => ({
      symbol,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: i * 0.5,
      animationDuration: 3 + Math.random() * 2
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSymbolPositions(positions);
  }, []);
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-cyan-50/50 to-blue-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400/10 dark:bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-200/20 to-blue-200/20 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Floating code symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {symbolPositions.map((pos, i) => (
          <div
            key={i}
            className="absolute text-cyan-300/30 dark:text-cyan-400/30 font-mono text-2xl animate-float"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              animationDelay: `${pos.animationDelay}s`,
              animationDuration: `${pos.animationDuration}s`
            }}
          >
            {pos.symbol}
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-fade-in-up border border-cyan-200 dark:border-cyan-500/30">
            <Sparkles className="w-4 h-4" />
            <span>React Learning Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-6 animate-fade-in-up delay-100">
            Master React by
            <span className="block bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
              Building Real Projects
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in-up delay-200">
            Interactive lessons, hands-on coding exercises, and instant feedback — 
            no setup required. Go from beginner to job-ready developer.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-up delay-300">
            <Link
              to={ROUTES.REGISTER}
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-500 dark:to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/25 dark:hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              <Play className="w-5 h-5" />
              <span>Start Learning Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to={ROUTES.LEARNING_PATH}
              className="group inline-flex items-center gap-2 bg-white dark:bg-slate-800/80 backdrop-blur-sm text-slate-900 dark:text-white px-8 py-4 rounded-xl font-bold text-lg border-2 border-slate-200 dark:border-slate-600 hover:border-cyan-300 dark:hover:border-cyan-500 transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-cyan-500/20"
            >
              <Code2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <span>Explore Curriculum</span>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400 animate-fade-in-up delay-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>40 hours of content</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>12 hands-on exercises</span>
            </div>
          </div>
        </div>

        {/* Preview cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up delay-500">
          {[
            { title: "Interactive Lessons", desc: "Learn by doing with real code", icon: "BookOpen" },
            { title: "Instant Feedback", desc: "Get real-time validation", icon: "Zap" },
            { title: "Track Progress", desc: "XP, levels, and achievements", icon: "Trophy" }
          ].map((item, i) => (
            <div
              key={i}
              className="group bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-500 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/20"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-slate-300 dark:border-slate-600 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-cyan-500 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};
