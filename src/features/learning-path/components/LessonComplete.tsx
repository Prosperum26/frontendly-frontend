import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreVertical, Award, Star } from "lucide-react";
import { DUMMY_MILESTONE_DETAILS } from "../../../data/dummy/milestoneDetail";
import "./LessonComplete.css";

export const LessonComplete: React.FC = () => {
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleReturn = () => {
    navigate(`/learning-path/milestone/${milestone?.id || "m2"}`);
  };

  const handleNextLesson = () => {
    navigate(`/learning-path/milestone/${milestone?.id || "m2"}`);
  };

  return (
    <div className="lcp-page-container">
      <header className="lcp-top-header">
        <div className="lcp-header-left" onClick={handleReturn}>
          <ArrowLeft size={20} className="lcp-back-icon" />
          <h2 className="lcp-header-title">Lesson Complete</h2>
        </div>
        <button className="lcp-more-btn">
          <MoreVertical size={20} />
        </button>
      </header>

      <main className="lcp-main-content">
        <div className="lcp-celebration-card">
          <div className="lcp-hexagon-outer animate-pulse-slow">
            <div className="lcp-hexagon-inner">
              <svg viewBox="0 0 100 100" className="lcp-hexagon-svg">
                <polygon
                  points="50,5 90,28 90,72 50,95 10,72 10,28"
                  fill="#0b1329"
                  stroke="#06b6d4"
                  strokeWidth="4"
                />
                <circle cx="50" cy="50" r="16" fill="none" stroke="#22d3ee" strokeWidth="3" className="lcp-pulse-circle" />
                <polygon
                  points="50,22 75,36 75,64 50,78 25,64 25,36"
                  fill="none"
                  stroke="#0891b2"
                  strokeWidth="2"
                />
                <circle cx="50" cy="50" r="8" fill="#22d3ee" />
              </svg>
            </div>
          </div>

          <h1 className="lcp-title">Lesson Complete!</h1>
          <p className="lcp-subtitle">
            Great job! You've mastered the fundamentals of CSS Grid and are one step closer to becoming a senior developer.
          </p>

          <div className="lcp-badges-row">
            <div className="lcp-badge-box">
              <div className="lcp-badge-icon-container blue">
                <Star size={20} fill="#ffffff" color="#2563eb" />
              </div>
              <div className="lcp-badge-text">
                <span className="lcp-badge-label">EXPERIENCE POINTS</span>
                <span className="lcp-badge-value blue">+50 XP Earned</span>
              </div>
            </div>

            <div className="lcp-badge-box">
              <div className="lcp-badge-icon-container cyan">
                <Award size={20} fill="#ffffff" color="#06b6d4" />
              </div>
              <div className="lcp-badge-text">
                <span className="lcp-badge-label">NEW ACHIEVEMENT</span>
                <span className="lcp-badge-value dark">Grid Specialist</span>
              </div>
            </div>
          </div>

          <div className="lcp-progress-card">
            <div className="lcp-progress-card-header">
              <span className="lcp-progress-title">Module Progress</span>
              <span className="lcp-progress-percent-badge">50% Completed</span>
            </div>

            <div className="lcp-progress-track-bar">
              <div className="lcp-progress-track-fill" style={{ width: "50%" }}></div>
            </div>

            <div className="lcp-progress-card-footer">
              <span className="lcp-module-name">Module 1: Layout Systems</span>
              <span className="lcp-lessons-ratio">3 of 6 Lessons</span>
            </div>
          </div>

          <div className="lcp-actions-row">
            <button className="lcp-btn-next" onClick={handleNextLesson}>
              Next Lesson
            </button>
            <button className="lcp-btn-roadmap" onClick={handleReturn}>
              Return to Roadmap
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LessonComplete;
