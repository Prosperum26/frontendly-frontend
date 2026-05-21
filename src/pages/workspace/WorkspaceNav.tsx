import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const WorkspaceNav: React.FC = () => {
  return (
    <header className="workspace-nav">
      <div className="workspace-nav__left">
        <Link to={ROUTES.HOME} className="workspace-nav__logo">
          FrontEndly
        </Link>
        <ul className="workspace-nav__links">
          <li>
            <Link to={ROUTES.HOME} className="workspace-nav__link">
              Home
            </Link>
          </li>
          <li>
            <Link to={ROUTES.LEARNING_PATH} className="workspace-nav__link workspace-nav__link--active">
              Learn
            </Link>
          </li>
          <li>
            <Link to={ROUTES.CHALLENGE_LOBBY} className="workspace-nav__link">
              Challenge
            </Link>
          </li>
          <li>
            <span className="workspace-nav__link">About</span>
          </li>
        </ul>
      </div>
      <div className="workspace-nav__right">
        <label className="workspace-nav__search">
          <svg className="workspace-nav__search-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            className="workspace-nav__search-input"
            type="search"
            placeholder="Search paths..."
            readOnly
          />
        </label>
        <button type="button" className="workspace-nav__icon-btn" aria-label="Notifications">
          <svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor" aria-hidden>
            <path d="M8 18a2 2 0 002-2H6a2 2 0 002 2zm6-6V9a6 6 0 00-5-5.91V2H7v1.09A6 6 0 002 9v3l-2 2v1h16v-1l-2-2z" />
          </svg>
        </button>
        <button type="button" className="workspace-nav__icon-btn" aria-label="Achievements">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2L12 17l-6.3 4 2.3-7.2-6-4.6h7.6L12 2z" />
          </svg>
        </button>
        <div className="workspace-nav__avatar" role="img" aria-label="User profile" />
      </div>
    </header>
  );
};

export default WorkspaceNav;
