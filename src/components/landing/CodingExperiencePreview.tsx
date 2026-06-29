import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, Terminal, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const CodingExperiencePreview: React.FC = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const codeLines = [
    'function Welcome() {',
    '  return (',
    '    <div className="card">',
    '      <h1>Hello React!</h1>',
    '      <p>My first component</p>',
    '    </div>',
    '  );',
    '}',
    '',
    'export default Welcome;'
  ];

  useEffect(() => {
    if (currentLine < codeLines.length - 1) {
      const timer = setTimeout(() => {
        setCurrentLine(currentLine + 1);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setShowSuccess(true), 500);
    }
  }, [currentLine, codeLines.length]);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-cyan-500/30">
            <Code2 className="w-4 h-4" />
            <span>Interactive Coding</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            Write Code, See Results Instantly
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Our browser-based editor lets you code with real-time feedback and live preview
          </p>
        </div>

        {/* Code Editor Preview */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-800 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 dark:border-slate-800">
            {/* Editor Header */}
            <div className="bg-slate-900 dark:bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-700 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
                <Terminal className="w-4 h-4" />
                <span>App.jsx</span>
              </div>
            </div>

            {/* Editor Content */}
            <div className="grid md:grid-cols-2">
              {/* Code Panel */}
              <div className="p-6 bg-slate-800 dark:bg-slate-900 border-r border-slate-700 dark:border-slate-800">
                <pre className="font-mono text-sm leading-relaxed">
                  {codeLines.slice(0, currentLine + 1).map((line, i) => (
                    <div key={i} className="animate-fade-in">
                      <span className="text-purple-400">{i + 1}</span>
                      <span className="ml-4 text-slate-300 dark:text-slate-400">{line}</span>
                    </div>
                  ))}
                  {currentLine < codeLines.length - 1 && (
                    <div className="animate-pulse">
                      <span className="text-purple-400">{currentLine + 2}</span>
                      <span className="ml-4 text-cyan-400 dark:text-cyan-500">|</span>
                    </div>
                  )}
                </pre>
              </div>

              {/* Preview Panel */}
              <div className="p-6 bg-slate-900 dark:bg-slate-950 flex flex-col">
                <div className="text-xs text-slate-400 dark:text-slate-500 mb-4 font-semibold uppercase tracking-wider">
                  Live Preview
                </div>
                <div className="flex-1 bg-white rounded-lg p-6 flex items-center justify-center">
                  {showSuccess ? (
                    <div className="text-center animate-fade-in-up">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="bg-green-50 text-green-800 px-4 py-2 rounded-lg text-sm font-semibold inline-block">
                        All Tests Passed! ✓
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 dark:text-slate-500 animate-pulse">
                      <Terminal className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Running tests...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Editor Footer */}
            <div className="bg-slate-900 dark:bg-slate-950 px-4 py-3 border-t border-slate-700 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-slate-400 dark:text-slate-500">
                <span>React 18</span>
                <span>•</span>
                <span>JSX</span>
                <span>•</span>
                <span>Auto-save on</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-400 dark:text-green-500">Connected</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-8">
            <Link
              to={ROUTES.REGISTER}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105"
            >
              <Play className="w-5 h-5" />
              <span>Try It Yourself</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
