import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Trophy,
  Grid,
  Columns,
  Layers,
  Headphones,
  CheckCircle,
  Circle,
  HelpCircle
} from "lucide-react";
import { DUMMY_MILESTONE_DETAILS } from "../../../data/dummy/milestoneDetail";
import "./TheoryPage.css";

export const TheoryPage: React.FC = () => {
  const { milestoneId, lessonId } = useParams<{
    milestoneId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();

  let milestone = milestoneId
    ? DUMMY_MILESTONE_DETAILS[milestoneId]
    : undefined;

  if (!milestone && milestoneId) {
    const cleanId = milestoneId.replace(/\D/g, "");
    const fallbackKey = `m${cleanId || "2"}`;
    milestone = DUMMY_MILESTONE_DETAILS[fallbackKey] || DUMMY_MILESTONE_DETAILS["m2"];
  }

  const [activeTab, setActiveTab] = useState("Learn");

  if (!milestone) {
    return (
      <div className="tp-error-container">
        <h2>Milestone not found</h2>
        <button className="tp-back-btn" onClick={() => navigate("/learning-path")}>
          <ArrowLeft size={16} /> Back to Learning Path
        </button>
      </div>
    );
  }

  const handleBackToOverview = () => {
    navigate(`/learning-path/milestone/${milestone.id}`);
  };

  const handleContinue = () => {
    navigate(
      `/learning-path/milestone/${milestone.id}/lesson/${lessonId || "dl2"}/complete`
    );
  };

  return (
    <div className="tp-page-container">
      <header className="tp-top-header">
        <div className="tp-header-left" onClick={handleBackToOverview}>
          <ArrowLeft size={20} className="tp-arrow-icon" />
          <h2 className="tp-header-title">CSS Grid: The Grid Container</h2>
        </div>
        
        <nav className="tp-header-nav">
          <span className={activeTab === "Home" ? "active" : ""} onClick={() => setActiveTab("Home")}>Home</span>
          <span className={activeTab === "Learn" ? "active" : ""} onClick={() => setActiveTab("Learn")}>Learn</span>
          <span className={activeTab === "Challenge" ? "active" : ""} onClick={() => setActiveTab("Challenge")}>Challenge</span>
          <span className={activeTab === "About" ? "active" : ""} onClick={() => setActiveTab("About")}>About</span>
        </nav>

        <div className="tp-header-right">
          <button className="tp-icon-btn">
            <Bell size={20} />
          </button>
          <button className="tp-icon-btn">
            <Trophy size={20} />
          </button>
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80"
            alt="Alex Rivera"
            className="tp-profile-pic"
          />
        </div>
      </header>

      <div className="tp-content-layout">
        <aside className="tp-left-sidebar">
          <div className="tp-sidebar-progress-box">
            <span className="tp-sidebar-subtitle">COURSE PROGRESS</span>
            <div className="tp-sidebar-progress-stats">
              <div className="tp-sidebar-progress-bar-track">
                <div className="tp-sidebar-progress-bar-fill" style={{ width: "25%" }}></div>
              </div>
              <span className="tp-sidebar-progress-text">25% Complete</span>
            </div>
          </div>

          <div className="tp-sidebar-lessons">
            <span className="tp-sidebar-subtitle">LESSONS</span>
            <ul className="tp-lessons-list">
              <li className="tp-lesson-item completed">
                <CheckCircle size={18} className="tp-lesson-icon completed" />
                <span>1. CSS Positioning Deep Dive</span>
              </li>
              <li className="tp-lesson-item active">
                <div className="tp-active-dot-container">
                  <div className="tp-active-dot"></div>
                </div>
                <span>2. The Grid Container</span>
              </li>
              <li className="tp-lesson-item">
                <Circle size={18} className="tp-lesson-icon" />
                <span>3. Grid Tracks & Gaps</span>
              </li>
              <li className="tp-lesson-item">
                <Circle size={18} className="tp-lesson-icon" />
                <span>4. Grid Area Naming</span>
              </li>
            </ul>
          </div>

        </aside>

        <main className="tp-main-body">
          <div className="tp-body-grid">
            <div className="tp-body-left">
              <span className="tp-badge">THEORY 01</span>
              <h1 className="tp-title">Understanding the Container</h1>
              <p className="tp-description">
                The journey into CSS Grid begins with the <strong>Grid Container</strong>. By applying <code>display: grid</code> to an element, you initialize a grid formatting context for all its direct children.
              </p>

              <div className="tp-cards-list">
                <div className="tp-info-card">
                  <div className="tp-card-icon-box">
                    <Grid size={20} />
                  </div>
                  <div className="tp-card-content">
                    <h3 className="tp-card-heading">Grid Tracks</h3>
                    <p className="tp-card-text">
                      The columns and rows of the grid. You define these using <code>grid-template-columns</code> and <code>grid-template-rows</code>.
                    </p>
                  </div>
                </div>

                <div className="tp-info-card">
                  <div className="tp-card-icon-box">
                    <Columns size={20} />
                  </div>
                  <div className="tp-card-content">
                    <h3 className="tp-card-heading">Grid Gaps</h3>
                    <p className="tp-card-text">
                      The space between rows and columns, defined by the <code>gap</code> property (or column-gap and row-gap).
                    </p>
                  </div>
                </div>

                <div className="tp-info-card">
                  <div className="tp-card-icon-box">
                    <Layers size={20} />
                  </div>
                  <div className="tp-card-content">
                    <h3 className="tp-card-heading">Grid Cells</h3>
                    <p className="tp-card-text">
                      The smallest unit on the grid, formed by the intersection of a row track and a column track.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="tp-body-right">
              <div className="tp-demo-container">
                <div className="tp-demo-grid">
                  <div className="tp-demo-cell">1</div>
                  <div className="tp-demo-cell">2</div>
                  <div className="tp-demo-cell">3</div>
                  <div className="tp-demo-cell">4</div>
                  <div className="tp-demo-cell">5</div>
                  <div className="tp-demo-cell">6</div>
                </div>
              </div>

              <div className="tp-code-editor">
                <div className="tp-code-editor-header">
                  <div className="tp-editor-dots">
                    <span className="tp-dot red"></span>
                    <span className="tp-dot yellow"></span>
                    <span className="tp-dot green"></span>
                  </div>
                  <span className="tp-editor-filename">STYLES.CSS</span>
                </div>
                <pre className="tp-editor-content">
                  <code>
{`.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 100px 100px;
  gap: 16px;
}

.item {
  background-color: #2563eb33;
  border: 2px dashed #2563eb;
}`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="tp-fixed-footer">
        <button className="tp-footer-back-link" onClick={handleBackToOverview}>
          <ArrowLeft size={16} />
          <span>BACK TO OVERVIEW</span>
        </button>

        <div className="tp-footer-progress-pill">
          <span className="tp-progress-pill-label">PROGRESS</span>
          <div className="tp-progress-pill-track">
            <div className="tp-progress-pill-fill" style={{ width: "25%" }}></div>
          </div>
          <span className="tp-progress-pill-count">1/4 Lessons</span>
        </div>

        <button className="tp-footer-continue-btn" onClick={handleContinue}>
          <span>CONTINUE</span>
          <ArrowLeft size={16} className="tp-arrow-right-icon" />
        </button>
      </footer>
    </div>
  );
};

export default TheoryPage;