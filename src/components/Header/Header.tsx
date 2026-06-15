import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { ROUTES } from '../../constants/routes';
import { Button } from '../Button/Button';
import { ChevronDown, User, LogOut, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const { isAuthenticated, currentUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: ROUTES.HOME },
    { name: 'Learn', path: ROUTES.LEARNING_PATH },
    { name: 'Challenge', path: ROUTES.CHALLENGE_LOBBY },
    { name: 'Leaderboard', path: ROUTES.LEADERBOARD },
  ];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
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
    <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="text-2xl font-bold text-blue-600">FrontEndly</div>
      
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-6 items-center">
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

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex space-x-3 items-center">
        {isAuthenticated && currentUser ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <img
                src={currentUser.avatar || currentUser.avatarUrl || `https://ui-avatars.com/api/?name=${currentUser.username || currentUser.name || 'User'}&background=0D8ABC&color=fff`}
                alt={currentUser.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <div className="border-t border-slate-200 my-2"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-50">
          <nav className="flex flex-col p-4 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="border-t border-slate-200 my-2"></div>
            {isAuthenticated && currentUser ? (
              <>
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink to={ROUTES.LOGIN} onClick={handleNavClick}>
                  <Button variant="outline" className="w-full">Login</Button>
                </NavLink>
                <NavLink to={ROUTES.REGISTER} onClick={handleNavClick}>
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
