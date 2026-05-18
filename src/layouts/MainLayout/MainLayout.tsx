import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Button } from '../../components/Button/Button';

export const MainLayout: React.FC = () => {
  const navLinks = [
    { name: 'Home', path: ROUTES.HOME },
    { name: 'Learn', path: ROUTES.LEARNING_PATH },
    { name: 'Challenge', path: ROUTES.CHALLENGE_LOBBY },
    { name: 'Leaderboard', path: ROUTES.LEADERBOARD },
    { name: 'Profile', path: ROUTES.PROFILE },
  ];

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-blue-600">FrontEndly</div>
        <nav className="flex space-x-6 items-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm transition-all duration-150 ${
                  isActive 
                    ? 'bg-blue-600 text-white font-medium shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
        <div className="flex space-x-3 items-center">
          <NavLink to={ROUTES.LOGIN}>
            <Button variant="outline">Đăng ký</Button>
          </NavLink>
          <NavLink to={ROUTES.LEARNING_PATH}>
            <Button variant="primary">Bắt đầu học</Button>
          </NavLink>
        </div>
      </header>

     <main className="w-full min-h-[917px] flex-grow flex items-center justify-center bg-[#F8F9FF] p-6">
  <Outlet />
</main>

      <footer className="bg-white border-t border-gray-100 p-12 grid grid-cols-5 gap-10">
        <div className="col-span-2">
          <div className="text-xl font-bold text-slate-900 mb-2">FrontEndly</div>
          <p className="text-slate-600 mb-4 text-sm">Keep going, you're doing great!</p>
          <p className="text-xs text-slate-400">
            © 2026 FrontEndly. Built for developers by developers. <br/> 
            Empowering the next generation of engineers with precision-crafted curriculum.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-800 mb-4 uppercase tracking-wider">Curriculum</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="text-blue-600 hover:underline">HTML Path</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">CSS Mastery</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">JS Challenges</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-800 mb-4 uppercase tracking-wider">Community</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="text-blue-600 hover:underline">Global Rankings</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Showcase</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Discord</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-800 mb-4 uppercase tracking-wider">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="text-blue-600 hover:underline">About Us</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Contact</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;