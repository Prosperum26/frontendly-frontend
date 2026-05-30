import React from 'react';
import { Outlet } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  return (
    <div className="main-layout">
      <header className="main-layout-header">
        <div className="main-layout-logo">Frontendly</div>
        <nav className="main-layout-nav">
          <a href="/">Home</a>
          <a href="/learning-path">Learning Path</a>
          <a href="/challenge/lobby">Challenges</a>
          <a href="/leaderboard">Leaderboard</a>
          <a href="/profile">Profile</a>
        </nav>
      </header>
      <main className="main-layout-content">
        <Outlet />
      </main>
      <footer className="main-layout-footer">
        <p>&copy; 2026 Frontendly. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
