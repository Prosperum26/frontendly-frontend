import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <div className="text-xl font-bold text-blue-600 mb-2">FrontEndly</div>
          <p className="text-slate-600 mb-4 text-sm">Keep going, you're doing great!</p>
          <p className="text-xs text-slate-400">
            © 2026 FrontEndly. Built for developers by developers. <br />
            Empowering the next generation of engineers with precision-crafted curriculum.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-800 mb-4 uppercase tracking-wider">Curriculum</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to={ROUTES.LEARNING_PATH} className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                Learning Path
              </Link>
            </li>
            <li>
              <Link to={ROUTES.LEARNING_PATH} className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                HTML Mastery
              </Link>
            </li>
            <li>
              <Link to={ROUTES.LEARNING_PATH} className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                CSS Mastery
              </Link>
            </li>
            <li>
              <Link to={ROUTES.LEARNING_PATH} className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                JavaScript ES6+
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-800 mb-4 uppercase tracking-wider">Community</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to={ROUTES.LEADERBOARD} className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                Leaderboard
              </Link>
            </li>
            <li>
              <Link to={ROUTES.CHALLENGE_LOBBY} className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                Challenges
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-800 mb-4 uppercase tracking-wider">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
