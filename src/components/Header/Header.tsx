import React from 'react';
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';import { useAuthStore } from '../../store/auth.store';
import { ROUTES } from '../../constants/routes';
import { Button } from '../Button/Button';

export const Header: React.FC = () => {
  const { isAuthenticated, currentUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

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
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
<Link 
  to={ROUTES.HOME} 
  className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
>
  FrontEndly
</Link>      <nav className="flex space-x-6 items-center">
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
              <span className="text-sm font-medium text-slate-700">{currentUser.username}</span>
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
            {location.pathname === ROUTES.LOGIN ? (
              <>
                {/* 1. Nếu đang ở trang LOGIN */}
                <NavLink to={ROUTES.REGISTER} className="inline-block active:scale-95 transition-transform duration-150">
                  <Button variant="outline">Sign Up</Button>
                </NavLink>
               <NavLink to={ROUTES.LEARNING_PATH} className="inline-block active:scale-95 transition-transform duration-150">
  <Button variant="primary">Start Learning</Button>
</NavLink>
              </>
            ) : location.pathname === ROUTES.REGISTER ? (
              <>
                {/* 2. Nếu đang ở trang REGISTER */}
                <NavLink to={ROUTES.LOGIN} className="inline-block active:scale-95 transition-transform duration-150">
                  <Button variant="outline">Login</Button>
                </NavLink>
              <NavLink to={ROUTES.LEARNING_PATH} className="inline-block active:scale-95 transition-transform duration-150">
  <Button variant="primary">Start Learning</Button>
</NavLink>
              </>
            ) : (
              <>
                {/* 3. Nếu đang ở HOME hoặc các trang khác */}
                <NavLink to={ROUTES.LOGIN} className="inline-block active:scale-95 transition-transform duration-150">
                  <Button variant="outline">Login</Button>
                </NavLink>
                <NavLink to={ROUTES.REGISTER} className="inline-block active:scale-95 transition-transform duration-150">
                  <Button variant="primary">Sign Up</Button>
                </NavLink>
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
