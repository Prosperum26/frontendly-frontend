import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-main-bg border-t border-border py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Cột 1: Brand */}
        <div className="col-span-1">
          <Link to={ROUTES.HOME} className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2 block">
            FrontEndly
          </Link>
          <p className="text-xs text-muted mt-4">
            © 2026 FrontEndly. All rights reserved.
          </p>
        </div>

        {/* Cột 2: Platform */}
        <div>
          <h4 className="text-xs font-semibold text-heading mb-4 uppercase tracking-wider">
            Platform
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to={ROUTES.LEARNING_PATH} className="text-blue-600 dark:text-blue-400 hover:underline transition-colors">
                Learning Path
              </Link>
            </li>
            <li>
              <Link to={ROUTES.CHALLENGE_LOBBY} className="text-blue-600 dark:text-blue-400 hover:underline transition-colors">
                Challenges
              </Link>
            </li>
            <li>
              <Link to={ROUTES.LEADERBOARD} className="text-blue-600 dark:text-blue-400 hover:underline transition-colors">
                Leaderboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Legal & Support */}
        <div>
          <h4 className="text-xs font-semibold text-heading mb-4 uppercase tracking-wider">
            Support
          </h4>
          <ul className="space-y-2 text-sm">
           {/* Sửa href thành thẻ Link trỏ về ROUTE */}
<li>
  <Link to={ROUTES.CONTACT} className="text-blue-600 dark:text-blue-400 hover:underline transition-colors">
    Contact Us
  </Link>
</li>
<li>
  <Link to={ROUTES.PRIVACY} className="text-blue-600 dark:text-blue-400 hover:underline transition-colors">
    Privacy Policy
  </Link>
</li>
          </ul>
        </div>

      </div>
    </footer>
  );
};

export default Footer;