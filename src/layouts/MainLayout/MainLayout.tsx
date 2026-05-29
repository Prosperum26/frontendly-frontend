import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import api from "../../services/api";
import defaultAvatar from "../../assets/default_avatar.png";

export const MainLayout: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/v1/users/me");
        const data = res?.data?.data || {};
        setUser(data);
      } catch (err: any) {
        if (err?.response?.status === 401) {
          setError("Unauthenticated – please log in.");
        } else {
          setError(err?.message || "Failed to load user info");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const avatarUrl = user?.avatarUrl || defaultAvatar;
  const userName = user?.name || "Guest";

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
        <div className="main-layout-user">
          {isLoading ? (
            <span>Loading...</span>
          ) : error ? (
            <span className="error-text">{error}</span>
          ) : (
            <>
              <img src={avatarUrl} alt={userName} className="user-avatar" />
              <span className="user-name">{userName}</span>
            </>
          )}
        </div>
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
