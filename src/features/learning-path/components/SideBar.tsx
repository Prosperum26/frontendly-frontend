import React, { useState, useEffect } from "react";
import { PlayCircle, Flame, Trophy, Plus, Star, Zap, Sun } from "lucide-react";
import api from "../../../services/api";
import "./SideBar.css";
import defaultAvatar from "../../../assets/default_avatar.png";

import type { UserData, ProgressResponse, Badge } from "../types/apiResponses";

interface SideBarProps {
  onWatchIntro: () => void;
}

export const SideBar: React.FC<SideBarProps> = ({ onWatchIntro }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [progressData, setProgressData] = useState<ProgressResponse | null>(null);
  const [badgesData, setBadgesData] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [userRes, progressRes, badgesRes] = await Promise.all([
          api.get("/v1/users/me"),
          api.get("/v1/users/progress"),
          api.get("/v1/users/badges"),
        ]);

        const uData = userRes?.data?.data ?? {};
        setUserData(uData);

        const pData = progressRes?.data ?? {};
        setProgressData(pData);

        const bData = badgesRes?.data?.badges ?? badgesRes?.data ?? [];
        setBadgesData(Array.isArray(bData) ? bData : []);
      } catch (err: any) {
        if (err?.response?.status === 401) {
          setError("Unauthenticated – please log in.");
        } else {
          console.error("Error fetching sidebar user details:", err);
          setError(err?.message || "Failed to load user info");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderBadge = (badge: Badge, index: number) => {
    const { name, icon, isUnlocked } = badge;
    const iconElement = (() => {
      switch (icon) {
        case "zap":
          return <Zap size={16} fill="#2563eb" color="#2563eb" />;
        case "sun":
          return <Sun size={16} fill="#d97706" color="#d97706" />;
        default:
          return name;
      }
    })();
    const badgeClass = isUnlocked
      ? "badge-icon bg-blue-light text-blue"
      : "badge-icon bg-gray-200 text-gray-500 grayscale opacity-50";
    return (
      <div key={index} className={badgeClass} title={name}>
        {iconElement}
      </div>
    );
  };

  const displayName = userData?.name || "Alex Rivera";
  const userTitle = "Junior Developer";
  const avatarUrl = userData?.avatarUrl || defaultAvatar;

  const currentXp = progressData?.xp ?? 0;
  const maxXp = progressData?.xpToNextLevel ?? 0;
  const xpPercentage = maxXp ? Math.min(100, Math.max(0, Math.round((currentXp / maxXp) * 100))) : 0;

  const streakText =
    typeof progressData?.streak === "number" ? `${progressData.streak} Days` : progressData?.streak ?? "-";
  const rankText =
    typeof progressData?.rank === "number" ? `Top ${progressData.rank}%` : progressData?.rank ?? "-";

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
              <PlayCircle size={16} /> Watch Intro
            </button>
          </div>
        </div>
      </div>

      <div className="progress-section">
        <h4 className="progress-section-title">YOUR PROGRESS</h4>
        <div className="progress-card">
          {isLoading ? (
            <div style={{ padding: "20px 0", textAlign: "center", color: "#94a3b8" }}>
              Loading user progress…
            </div>
          ) : error ? (
            <div style={{ padding: "20px 0", textAlign: "center", color: "#ef4444" }}>
              {error}
            </div>
          ) : (
            <>
              <div className="profile-info">
                <div className="avatar-wrapper">
                  <img src={avatarUrl} alt={displayName} className="avatar" />
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
                  <div className="xp-fill" style={{ width: `${xpPercentage}%` }} />
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
