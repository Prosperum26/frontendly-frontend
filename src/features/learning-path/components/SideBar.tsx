import React, { useState, useEffect } from "react";
import { PlayCircle, Flame, Trophy, Plus, Star, Zap, Sun } from "lucide-react";
import axios from "axios";
import "./SideBar.css";
import defaultAvatar from "../../../assets/default_avatar.png";

interface SideBarProps {
  onWatchIntro: () => void;
}

export const SideBar: React.FC<SideBarProps> = ({ onWatchIntro }) => {
  const [userData, setUserData] = useState<any>(null);
  const [progressData, setProgressData] = useState<any>(null);
  const [badgesData, setBadgesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [userRes, progressRes, badgesRes] = await Promise.all([
          axios.get("/api/v1/users/me", { headers }),
          axios.get("/api/v1/users/progress", { headers }),
          axios.get("/api/v1/users/badges", { headers }),
        ]);

        setUserData(userRes.data);
        setProgressData(progressRes.data);
        setBadgesData(badgesRes.data);
      } catch (err: any) {
        console.error("Error fetching sidebar user details:", err);
        setError(err?.message || "Failed to load user info");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderBadge = (badge: any, index: number) => {
    const badgeName = typeof badge === "string" ? badge : (badge?.name || "");
    const badgeIcon = typeof badge === "object" ? badge?.icon : null;

    if (badgeName === "HTML") {
      return (
        <div key={index} className="badge-icon bg-green-light text-green">
          HTML
        </div>
      );
    }

    if (badgeIcon === "zap" || badgeName.toLowerCase() === "zap" || badgeName.toLowerCase() === "speed") {
      return (
        <div key={index} className="badge-icon bg-blue-light text-blue">
          <Zap size={16} fill="#2563eb" color="#2563eb" />
        </div>
      );
    }

    if (badgeIcon === "sun" || badgeName.toLowerCase() === "sun" || badgeName.toLowerCase() === "streak") {
      return (
        <div key={index} className="badge-icon bg-yellow-light text-yellow">
          <Sun size={16} fill="#d97706" color="#d97706" />
        </div>
      );
    }

    return (
      <div key={index} className="badge-icon bg-blue-light text-blue">
        {badgeName}
      </div>
    );
  };

  // Safe defaults
  const displayName = userData?.username || userData?.displayName || userData?.name || "Alex Rivera";
  const userTitle = userData?.title || "Junior Developer";
  const avatarUrl = userData?.avatar || userData?.avatarUrl || defaultAvatar;

  const currentXp = typeof progressData?.xp === "number" ? progressData.xp : 2450;
  const maxXp = typeof progressData?.maxXp === "number" ? progressData.maxXp : 3000;
  const xpPercentage = Math.min(100, Math.max(0, Math.round((currentXp / maxXp) * 100)));

  const rawStreak = progressData?.streak !== undefined ? progressData.streak : 12;
  const streakText = typeof rawStreak === "number" ? `${rawStreak} Days` : String(rawStreak);

  const rawRank = progressData?.rank !== undefined ? progressData.rank : "Top 5%";
  const rankText = typeof rawRank === "number" ? `Top ${rawRank}%` : String(rawRank);

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h4 className="sidebar-section-title">INTRODUCTION</h4>
        <div className="sidebar-intro-card">
          <div
            className="sidebar-intro-thumbnail"
            onClick={onWatchIntro}
            style={{ cursor: "pointer" }}
          >
            <img
              src="https://img.youtube.com/vi/SqcY0GlETPk/maxresdefault.jpg"
              alt="Frontendly Getting Started Tutorial Thumbnail"
            />
            <div className="play-overlay">
              <PlayCircle className="play-icon" />
            </div>
          </div>
          <div className="intro-content">
            <h3 className="intro-heading">Getting Started</h3>
            <p className="intro-desc">
              Learn how to navigate the expert mentor mode and utilize the
              interactive workspace for maximum learning efficiency.
            </p>
            <button className="watch-btn" onClick={onWatchIntro}>
              <PlayCircle size={16} />
              Watch Intro
            </button>
          </div>
        </div>
      </div>

      <div className="progress-section">
        <h4 className="progress-section-title">YOUR PROGRESS</h4>
        <div className="progress-card">
          {isLoading ? (
            <div style={{ padding: "20px 0", textAlign: "center", color: "#94a3b8" }}>
              Loading user progress...
            </div>
          ) : error ? (
            <div style={{ padding: "20px 0", textAlign: "center", color: "#ef4444" }}>
              {error}
            </div>
          ) : (
            <>
              <div className="profile-info">
                <div className="avatar-wrapper">
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="avatar"
                  />
                  <div className="level-badge">
                    <Star size={10} fill="white" stroke="white" />
                  </div>
                </div>
                <div>
                  <h3 className="user-name">{displayName}</h3>
                  <p className="user-title">{userTitle}</p>
                </div>
              </div>

              <div className="xp-container">
                <div className="xp-header">
                  <span className="xp-label">EXPERIENCE POINTS</span>
                  <span className="xp-value">
                    <strong>{currentXp.toLocaleString()}</strong> / {maxXp.toLocaleString()}
                  </span>
                </div>
                <div className="xp-track">
                  <div className="xp-fill" style={{ width: `${xpPercentage}%` }}></div>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-box">
                  <span className="stat-label">STREAK</span>
                  <div className="stat-value text-blue">
                    <Flame size={20} fill="#2563eb" color="#2563eb" />
                    <span>{streakText}</span>
                  </div>
                </div>
                <div className="stat-box">
                  <span className="stat-label">RANK</span>
                  <div className="stat-value text-blue">
                    <Trophy size={20} fill="#2563eb" color="#2563eb" />
                    <span>{rankText}</span>
                  </div>
                </div>
              </div>

              <div className="badges-section">
                <span className="stat-label">Badges Earned</span>
                <div className="badges-list">
                  {badgesData.map((badge, idx) => renderBadge(badge, idx))}
                  <div className="badge-empty">
                    <Plus size={16} color="#94a3b8" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;

