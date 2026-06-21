
import React, { useState, useLayoutEffect } from 'react';
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { authService } from '../../features/auth/services/auth.service';
import { ROUTES } from '../../constants/routes';
import { Button } from '../Button/Button';
import { ChevronDown, User, LogOut, Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export const Header: React.FC = () => {
  const { isAuthenticated, currentUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  // Fix hydration mismatch
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder that matches the structure to avoid layout shift
    return (
      <header className="bg-main-bg border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="text-xl sm:text-2xl font-bold text-blue-600">FrontEndly</div>
        <div className="md:hidden w-8 h-8"></div>
      </header>
    );
  }

  const navLinks = [
    { name: 'Home', path: ROUTES.HOME },
    { name: 'Learn', path: ROUTES.LEARNING_PATH },
    { name: 'Challenge', path: ROUTES.CHALLENGE_LOBBY },
    { name: 'Leaderboard', path: ROUTES.LEADERBOARD },
  ];

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      logout();
      navigate(ROUTES.LOGIN);
      setDropdownOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const handleProfileClick = () => {
    navigate(ROUTES.PROFILE);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-main-bg border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link to={ROUTES.HOME} className="text-xl sm:text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
        FrontEndly
      </Link>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-3 rounded-lg hover:bg-surface transition-colors min-h-[48px] min-w-[48px]"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="w-6 h-6 text-body" /> : <Menu className="w-6 h-6 text-body" />}
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-4 lg:space-x-6 items-center">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `px-3 lg:px-4 py-2 rounded-lg text-sm transition-all duration-150 ${
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

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex space-x-3 items-center">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="p-3 rounded-lg hover:bg-surface dark:hover:bg-surface transition-colors min-h-[48px] min-w-[48px]"
          aria-label="Toggle dark mode"
        >
          {resolvedTheme === 'dark' ? <Sun className="w-5 h-5 text-body" /> : <Moon className="w-5 h-5 text-body" />}
        </button>

        {isAuthenticated && currentUser ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-surface transition-colors min-h-[48px] min-w-[48px]"
              aria-label="User menu"
            >
              <img
                src={
                  currentUser.avatar ||
                  currentUser.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${
                    currentUser.username || currentUser.name || 'User'
                  }&background=0D8ABC&color=fff&size=48`
                }
                alt={currentUser.username}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
              />
              <ChevronDown className="w-4 h-4 text-muted" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-main-bg rounded-lg shadow-lg border border-border py-2 z-50">
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-body hover:bg-surface transition-colors min-h-[48px]"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <div className="border-t border-border my-2"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors min-h-[48px]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {location.pathname === ROUTES.LOGIN ? (
              <>
                {/* 1. If on Login page */}
                <NavLink
                  to={ROUTES.REGISTER}
                  className="inline-block active:scale-95 transition-transform duration-150"
                >
                  <Button variant="outline">Sign Up</Button>
                </NavLink>
                <NavLink
                  to={ROUTES.LEARNING_PATH}
                  className="inline-block active:scale-95 transition-transform duration-150"
                >
                  <Button variant="primary">Start Learning</Button>
                </NavLink>
              </>
            ) : location.pathname === ROUTES.REGISTER ? (
              <>
                {/* 2. If on Register page */}
                <NavLink
                  to={ROUTES.LOGIN}
                  className="inline-block active:scale-95 transition-transform duration-150"
                >
                  <Button variant="outline">Log in</Button>
                </NavLink>
                <NavLink
                  to={ROUTES.LEARNING_PATH}
                  className="inline-block active:scale-95 transition-transform duration-150"
                >
                  <Button variant="primary">Start Learning</Button>
                </NavLink>
              </>
            ) : (
              <>
                {/* 3. If on Home or other pages */}
                <NavLink
                  to={ROUTES.LOGIN}
                  className="inline-block active:scale-95 transition-transform duration-150"
                >
                  <Button variant="outline">Login</Button>
                </NavLink>
                <NavLink
                  to={ROUTES.REGISTER}
                  className="inline-block active:scale-95 transition-transform duration-150"
                >
                  <Button variant="primary">Sign Up</Button>
                </NavLink>
              </>
            )}
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-main-bg border-b border-border shadow-lg z-50">
          <nav className="flex flex-col p-4 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-sm transition-all duration-150 min-h-[48px] flex items-center ${
                    isActive
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-body hover:bg-surface'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {/* Dark Mode Toggle (Mobile) */}
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-body hover:bg-surface rounded-lg min-h-[48px]"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span>Toggle Dark Mode</span>
            </button>

            <div className="border-t border-border my-2"></div>
            {isAuthenticated && currentUser ? (
              <>
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-body hover:bg-surface rounded-lg min-h-[48px]"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg min-h-[48px]"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink to={ROUTES.LOGIN} onClick={handleNavClick} className="w-full">
                  <Button variant="outline" className="w-full">Login</Button>
                </NavLink>
                <NavLink to={ROUTES.REGISTER} onClick={handleNavClick} className="w-full">
                  <Button variant="primary" className="w-full">Sign Up</Button>
                </NavLink>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
