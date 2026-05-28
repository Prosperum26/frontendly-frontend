import React from "react";
import { PlayCircle, Flame, Trophy, Plus, Star, Zap, Sun } from "lucide-react";
import "./SideBar.css";
import defaultAvatar from "../../../assets/default_avatar.png";
interface SideBarProps {
  onWatchIntro: () => void;
}
export const SideBar: React.FC<SideBarProps> = ({ onWatchIntro }) => {
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
          <div className="profile-info">
            <div className="avatar-wrapper">
              <img
                src={defaultAvatar}
                alt="Alex Rivera"
                className="avatar"
              />
              <div className="level-badge">
                <Star size={10} fill="white" stroke="white" />
              </div>
            </div>
            <div>
              <h3 className="user-name">Alex Rivera</h3>
              <p className="user-title">Junior Developer</p>
            </div>
          </div>

          <div className="xp-container">
            <div className="xp-header">
              <span className="xp-label">EXPERIENCE POINTS</span>
              <span className="xp-value">
                <strong>2,450</strong> / 3,000
              </span>
            </div>
            <div className="xp-track">
              <div className="xp-fill" style={{ width: "81%" }}></div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-box">
              <span className="stat-label">STREAK</span>
              <div className="stat-value text-blue">
                <Flame size={20} fill="#2563eb" color="#2563eb" />
                <span>12 Days</span>
              </div>
            </div>
            <div className="stat-box">
              <span className="stat-label">RANK</span>
              <div className="stat-value text-blue">
                <Trophy size={20} fill="#2563eb" color="#2563eb" />
                <span>Top 5%</span>
              </div>
            </div>
          </div>

          <div className="badges-section">
            <span className="stat-label">Badges Earned</span>
            <div className="badges-list">
              <div className="badge-icon bg-green-light text-green">HTML</div>
              <div className="badge-icon bg-blue-light text-blue">
                <Zap size={16} fill="#2563eb" color="#2563eb" />
              </div>
              <div className="badge-icon bg-yellow-light text-yellow">
                <Sun size={16} fill="#d97706" color="#d97706" />
              </div>
              <div className="badge-empty">
                <Plus size={16} color="#94a3b8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
