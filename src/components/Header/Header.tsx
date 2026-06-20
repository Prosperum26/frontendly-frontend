import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { ROUTES } from '../../constants/routes';
import { Button } from '../Button/Button';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export const Header: React.FC = () => {
  const { isAuthenticated, currentUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { name: 'Home', path: ROUTES.HOME },
    { name: 'Learn', path: ROUTES.LEARNING_PATH },
    { name: 'Challenge', path: ROUTES.CHALLENGE_LOBBY },
    { name: 'Leaderboard', path: ROUTES.LEADERBOARD },
  ];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const handleProfileClick = () => {
    navigate(ROUTES.PROFILE);
  };

  return (
    <header className="bg-main-bg border-b border-border px-6 py-4 flex items-center justify-between">
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
                  : 'text-body hover:bg-surface hover:text-heading'
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
      <div className="flex space-x-3 items-center">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg hover:bg-surface dark:hover:bg-surface transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        {isAuthenticated && currentUser ? (
          <>
            <div className="flex items-center space-x-3">
              {currentUser.avatar && (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <span className="text-sm font-medium text-body">{currentUser.username}</span>
            </div>
            <Button variant="outline" onClick={handleProfileClick}>
              Profile
            </Button>
            <Button variant="primary" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <NavLink to={ROUTES.LOGIN}>
              <Button variant="outline">Login</Button>
            </NavLink>
            <NavLink to={ROUTES.REGISTER}>
              <Button variant="primary">Sign Up</Button>
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
