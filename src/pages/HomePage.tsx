import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import NetworkErrorCard from '../components/NetworkErrorCard';
import { ROUTES } from '../constants/routes';



export const HomePage: React.FC = () => {

  const navigate = useNavigate();
  
  // Network status monitoring (consolidated)
  const [isOffline, setIsOffline] = useState(!navigator.onLine);



  useEffect(() => {

    const handleOnline = () => setIsOffline(false);

    const handleOffline = () => setIsOffline(true);



    window.addEventListener('online', handleOnline);

    window.addEventListener('offline', handleOffline);



    return () => {

      window.removeEventListener('online', handleOnline);

      window.removeEventListener('offline', handleOffline);

    };

  }, []);



  return (

    <div className="w-full flex-grow flex flex-col bg-slate-50 font-sans">
      
      {/* NOTE: Removed <nav> and <footer> here to avoid UI duplication as agreed */}

      {/* Main Content */}

      <main className="flex-grow flex flex-col items-center">



        {isOffline ? (

          <div className="w-full flex-grow flex items-center justify-center p-6 mt-12">

            <NetworkErrorCard

              onRetry={() => window.location.reload()}

              onBack={() => navigate('/')}

            />

          </div>

        ) : (

          <div className="w-full">



            {/* HERO SECTION */}

            <section className="w-full max-w-7xl mx-auto px-8 pt-20 pb-24 grid lg:grid-cols-2 gap-16 items-center">
              {/* Left column: Text & Buttons */}
              <div className="flex flex-col space-y-8 z-10">

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black !text-slate-900 leading-[1.1] tracking-tight">

                  Code the Web <br />

                  <span className="text-blue-600">your way.</span>

                </h1>

                <p className="text-slate-600 font-medium leading-relaxed max-w-lg text-base md:text-lg">
                  With FrontEndly, you can learn Frontend programming in a simple, easy-to-understand way. The code editor and live server features allow you to program and run projects in real-time without complex setup.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link to={ROUTES.ENTRANCE_TEST} className="px-8 py-4 bg-green-600 text-white rounded-lg text-center text-sm font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30">
                Take Entrance Test
              </Link>

              <Link to={ROUTES.LEARNING_PATH} className="px-8 py-4 bg-blue-600 text-white rounded-lg text-center text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">
                Start Learning!
              </Link>

              <Link to={ROUTES.REGISTER} className="px-8 py-4 bg-white text-slate-800 border border-slate-300 rounded-lg text-center text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
                Sign Up
              </Link>

            </div>

              </div>

              {/* Right column: Code Editor Mockup & Floating Preview */}
              <div className="relative mt-8 lg:mt-0 w-full max-w-lg mx-auto lg:ml-auto select-none">

                {/* Mockup Editor */}

                <div className="bg-[#1e1e2e] rounded-xl shadow-2xl overflow-hidden border border-slate-800">
                  {/* Editor Header */}
                  <div className="bg-[#181825] px-4 py-3 flex items-center justify-between border-b border-slate-700/50">

                    <div className="flex space-x-2">

                      <div className="w-3 h-3 rounded-full bg-red-500"></div>

                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>

                      <div className="w-3 h-3 rounded-full bg-green-500"></div>

                    </div>

                    <div className="text-[10px] text-slate-500 font-mono tracking-wider">index.html</div>

                  </div>
                  {/* Code Content */}
                  <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto text-slate-300">

                    <div>

                      <span className="text-pink-400">&lt;div</span> <span className="text-green-300">class</span>=<span className="text-yellow-300">"hero"</span><span className="text-pink-400">&gt;</span>

                    </div>

                    <div className="pl-4">

                      <span className="text-pink-400">&lt;h1&gt;</span>Hello World<span className="text-pink-400">&lt;/h1&gt;</span>

                    </div>

                    <div className="pl-4">

                      <span className="text-pink-400">&lt;p&gt;</span>Start your journey.<span className="text-pink-400">&lt;/p&gt;</span>

                    </div>

                    <div className="pl-4">

                      <span className="text-pink-400">&lt;button</span> <span className="text-green-300">onclick</span>=<span className="text-yellow-300">"start()"</span><span className="text-pink-400">&gt;</span>

                    </div>

                    <div className="pl-8">Click Me</div>

                    <div className="pl-4">

                      <span className="text-pink-400">&lt;/button&gt;</span>

                    </div>

                    <div>

                      <span className="text-pink-400">&lt;/div&gt;</span>

                    </div>

                  </div>

                </div>



                {/* Floating Preview Card */}

                <div className="absolute -bottom-10 -right-4 md:-right-10 bg-white p-5 rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 w-64 z-20">

                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Live Preview</span>
                  </div>

                  <div className="w-full h-10 bg-[#f1f5f9] rounded-lg mb-3 flex items-center justify-center">

                    <div className="w-16 h-3 bg-[#1e1b4b] rounded-full opacity-90"></div>

                  </div>

                  <button className="w-full bg-[#1e1b4b] text-white text-xs font-bold py-2.5 rounded-lg hover:bg-blue-900 transition-colors uppercase tracking-wider">

                    Interact

                  </button>

                </div>

              </div>

            </section>

            {/* FEATURES SECTION (Added prominent hover effects) */}
            <section className="w-full bg-white pt-24 pb-32 border-t border-slate-100">

              <div className="max-w-7xl mx-auto px-8">



                <div className="text-center mb-16">

                  <h2 className="text-3xl md:text-4xl font-bold !text-slate-900 mb-4 tracking-tight">Master the Core Technologies</h2>

                  <p className="text-sm md:text-base text-slate-500 font-medium">Build a rock-solid foundation with our structured learning paths designed for the modern web.</p>

                </div>



                <div className="grid md:grid-cols-3 gap-8">



                  {/* Card 1: HTML */}

                  <div className="group bg-white rounded-xl p-8 border-t-2 border-slate-200 border-t-[#d97706] shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(217,119,6,0.3)] flex flex-col h-full cursor-pointer">

                    <div className="w-10 h-10 rounded-lg bg-[#ffedd5] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">

                      <span className="text-[10px] font-black text-[#d97706]">HTML</span>

                    </div>

                    <h3 className="text-xl font-bold !text-slate-900 mb-3">HTML5 Mastery</h3>

                    <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8 flex-grow">

                      Semantic architecture, accessibility standards, and SEO-friendly structure for modern applications.

                    </p>

                    <Link to="/learn/html" className="text-[#d97706] font-bold text-sm flex items-center gap-2 hover:underline w-fit">

                      Start Path <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5 text-lg leading-none">→</span>

                    </Link>

                  </div>



                  {/* Card 2: CSS */}

                  <div className="group bg-white rounded-xl p-8 border-t-2 border-slate-200 border-t-[#4f46e5] shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(79,70,229,0.3)] flex flex-col h-full cursor-pointer">

                    <div className="w-10 h-10 rounded-lg bg-[#e0e7ff] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">

                      <span className="text-[10px] font-black text-[#4f46e5]">CSS</span>

                    </div>

                    <h3 className="text-xl font-bold !text-slate-900 mb-3">Modern CSS</h3>

                    <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8 flex-grow">

                      Flexbox, Grid, Animations, and responsive design patterns using Tailwind CSS and native CSS3.

                    </p>

                    <Link to="/learn/css" className="text-[#4f46e5] font-bold text-sm flex items-center gap-2 hover:underline w-fit">

                      Start Path <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5 text-lg leading-none">→</span>

                    </Link>

                  </div>



                  {/* Card 3: JS */}

                  <div className="group bg-white rounded-xl p-8 border-t-2 border-slate-200 border-t-[#0ea5e9] shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(14,165,233,0.3)] flex flex-col h-full cursor-pointer">

                    <div className="w-10 h-10 rounded-lg bg-[#e0f2fe] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">

                      <span className="text-[10px] font-black text-[#0ea5e9]">JS</span>

                    </div>

                    <h3 className="text-xl font-bold !text-slate-900 mb-3">JavaScript ES6+</h3>

                    <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8 flex-grow">

                      Functional programming, async/await, and DOM manipulation for interactive web experiences.

                    </p>

                    <Link to="/learn/javascript" className="text-[#0ea5e9] font-bold text-sm flex items-center gap-2 hover:underline w-fit">

                      Start Path <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5 text-lg leading-none">→</span>

                    </Link>

                  </div>



                </div>

              </div>

            </section>

          </div>

        )}

      </main>

    </div>

  );

};



export default HomePage;