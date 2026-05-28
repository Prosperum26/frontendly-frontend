import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Trophy,
  Grid,
  Columns,
  Layers,
  CheckCircle,
  Circle,
} from "lucide-react";
import api from "../../../services/api";
import { DUMMY_MILESTONE_DETAILS } from "../../../data/dummy/milestoneDetail";
import defaultAvatar from "../../../assets/default_avatar.png";
import "./TheoryPage.css";

export const TheoryPage: React.FC = () => {
  const { milestoneId, lessonId } = useParams<{
    milestoneId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();

  const [theoryData, setTheoryData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const stageId = lessonId || milestoneId;

  useEffect(() => {
    const fetchTheory = async () => {
      if (!stageId) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/v1/stages/${stageId}/theory`);
        // Handle nested response format safely
        setTheoryData(response.data?.data || response.data);
      } catch (err: any) {
        console.error("Error fetching stage theory:", err);
        setError(err?.message || "Failed to load lesson theory content");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTheory();
  }, [stageId]);

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

  const handleContinue = async () => {
    if (!stageId) return;
    try {
      await api.patch(`/v1/stages/${stageId}/unlock-practice`, {});
      
      // Navigate user to practice workspace
      navigate(`/workspace?stageId=${stageId}`);
    } catch (err: any) {
      console.error("Error unlocking practice:", err);
      // Fallback redirect so user is never stuck
      navigate(`/workspace?stageId=${stageId}`);
    }
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
          <span className={activeTab === "Learn Path" ? "active" : ""} onClick={() => setActiveTab("Learn Path")}>Learn Path</span>
          <span className={activeTab === "Milestone Roadmap" ? "active" : ""} onClick={() => setActiveTab("Milestone Roadmap")}>Milestone Roadmap</span>
          <span className={activeTab === "Lesson" ? "active" : ""} onClick={() => setActiveTab("Lesson")}>Lesson</span>
          <span className={activeTab === "Leaderboard" ? "active" : ""} onClick={() => setActiveTab("Leaderboard")}>Leaderboard</span>
          <span className={activeTab === "Profile" ? "active" : ""} onClick={() => setActiveTab("Profile")}>Profile</span>
        </nav>

        <div className="tp-header-right">
          <button className="tp-icon-btn">
            <Bell size={20} />
          </button>
          <button className="tp-icon-btn">
            <Trophy size={20} />
          </button>
          <img
            src={defaultAvatar}
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
            {isLoading ? (
              <div className="tp-body-left" style={{ padding: "40px", color: "#94a3b8" }}>
                Loading theory content...
              </div>
            ) : error ? (
              <div className="tp-body-left" style={{ padding: "40px", color: "#ef4444" }}>
                {error}
              </div>
            ) : (
              <div className="tp-body-left">
                <span className="tp-badge">THEORY</span>
                <h1 className="tp-title">{theoryData?.title || "Theory Lesson"}</h1>
                
                {theoryData?.contentHtml ? (
                  <div 
                    className="tp-theory-contentHtml" 
                    dangerouslySetInnerHTML={{ __html: theoryData.contentHtml }} 
                    style={{ lineHeight: "1.7", color: "var(--color-body)", fontSize: "15px" }}
                  />
                ) : (
                  <p className="tp-description">No theory content available.</p>
                )}

                {theoryData?.proTips && (
                  <div className="tp-pro-tips" style={{ marginTop: "24px", padding: "16px", background: "#fef3c7", borderRadius: "8px", borderLeft: "4px solid #d97706" }}>
                    <h4 style={{ color: "#92400e", fontWeight: "bold", marginBottom: "4px", fontSize: "14px" }}>Pro Tip</h4>
                    <p style={{ color: "#78350f", margin: 0, fontSize: "13px" }}>{theoryData.proTips}</p>
                  </div>
                )}

                {theoryData?.referenceLinks && theoryData.referenceLinks.length > 0 && (
                  <div className="tp-reference-links" style={{ marginTop: "32px", paddingTop: "20px", borderTop: "1px solid #e2e8f0" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", color: "var(--color-heading)" }}>Reference Links</h3>
                    <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                      {theoryData.referenceLinks.map((link: any, index: number) => {
                        const url = typeof link === "string" ? link : (link.url || link.link);
                        const label = typeof link === "string" ? link : (link.title || link.name || url);
                        return (
                          <li key={index} style={{ marginBottom: "8px" }}>
                            <a 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ color: "#2563eb", textDecoration: "underline" }}
                            >
                              {label}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}

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