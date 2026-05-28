import React from 'react';
import { PlayCircle, Flame, Trophy, Plus } from 'lucide-react';
import './SideBar.css';
interface SideBarProps {
  onWatchIntro: () => void;
}
export const SideBar: React.FC<SideBarProps> = ({ onWatchIntro }) => {
  return (
    <aside className="sidebar">
      {/* Introduction Section */}
      <div className="sidebar-section">
        <h4 className="sidebar-section-title">INTRODUCTION</h4>
        <div className="sidebar-intro-card">
          <div className="sidebar-intro-thumbnail">
            <img src="" alt="" />
            <div className="play-overlay">
              <PlayCircle className="play-icon" />
            </div>
          </div>
          <div className="intro-content">
            <h3 className="intro-heading">Getting Started</h3>
            <p className="intro-desc">
              Learn how to navigate the expert mentor mode and utilize the interactive workspace for maximum learning efficiency.
            </p>
            <button className="watch-btn" onClick={onWatchIntro}>
              <img src="src/assets/learning-path/sidebar/continue2_icon.svg" />
              Watch Intro
            </button>
          </div>
        </div>
      </div>
      {/* Your Progress Section */}
      <div className="progress-section">
        <h4 className="progress-section-title">YOUR PROGRESS</h4>
        <div className="progress-card">
          {/* Profile info */}
          <div className="profile-info">
            <div className="avatar-wrapper">
              <img src="src/assets/default_avatar.png" alt="USERNAME" className="avatar" />
              <div className="level-badge">
                <img src="src/assets/learning-path/sidebar/star_icon.svg" />
              </div>
            </div>
            <div>
              <h3 className="user-name">USERNAME</h3>
              <p className="user-title">trình độ</p>
            </div>
          </div>
          {/* XP Bar */}
          <div className="xp-container">
            <div className="xp-header">
              <span className="xp-label">EXPERIENCE POINTS</span>
              {/*Dummy data */}
              <span className="xp-value"><strong>2,450</strong> / 3,000</span>
            </div>
            <div className="xp-track">
              <div className="xp-fill" style={{ width: '81%' }}></div>
            </div>
          </div>
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-box">
              <span className="stat-label">STREAK</span>
              <div className="stat-value text-blue">
                <Flame size={16} />
                <span>12 Days</span>
              </div>
            </div>
            <div className="stat-box">
              <span className="stat-label">RANK</span>
              <div className="stat-value text-blue">
                <Trophy size={16} />
                <span>Top 5%</span>
              </div>
            </div>
          </div>
          {/* Badges Earned */}
          <div className="badges-section">
            <span className="stat-label">Badges Earned</span>
            <div className="badges-list">
              <div className="badge-icon bg-green-light text-green">HTML</div>
              <div className="badge-icon bg-blue-light text-blue">
                <Flame size={16} />
              </div>
              <div className="badge-icon bg-yellow-light text-yellow">
                <Trophy size={16} />
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