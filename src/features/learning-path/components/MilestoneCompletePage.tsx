import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreVertical, Award, Star } from "lucide-react";
import { useRoadmapStore } from "../stores/roadmapStore";
import { ROUTES } from "../../../constants/routes";
import "./LessonComplete.css";

export const MilestoneCompletePage: React.FC = () => {
  const { milestoneId } = useParams<{ milestoneId: string }>();
  const navigate = useNavigate();
  const getMilestoneDetailById = useRoadmapStore(
    (s) => s.getMilestoneDetailById,
  );

  const milestone = milestoneId
    ? getMilestoneDetailById(milestoneId)
    : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleReturn = () => {
    navigate(ROUTES.LEARNING_PATH);
  };

  const handleGoToNextMilestone = () => {
    navigate(ROUTES.LEARNING_PATH);
  };

  return (
    <div className="lcp-page-container">
      <header className="lcp-top-header">
        <div className="lcp-header-left" onClick={handleReturn}>
          <ArrowLeft size={20} className="lcp-back-icon" />
          <h2 className="lcp-header-title">Milestone Complete</h2>
        </div>
        <button type="button" className="lcp-more-btn">
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
                <circle
                  cx="50"
                  cy="50"
                  r="16"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="3"
                  className="lcp-pulse-circle"
                />
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

          <h1 className="lcp-title">Milestone Complete!</h1>
          <p className="lcp-subtitle">
            🎉 Chúc mừng! Bạn đã hoàn thành tất cả các bài học và bài tập trong milestone này. Tiếp tục học hỏi để nâng cao kỹ năng của mình!
          </p>

          <div className="lcp-badges-row">
            <div className="lcp-badge-box">
              <div className="lcp-badge-icon-container blue">
                <Star size={20} fill="#ffffff" color="#2563eb" />
              </div>
              <div className="lcp-badge-text">
                <span className="lcp-badge-label">MILESTONE</span>
                <span className="lcp-badge-value blue">{milestone?.title || "Hoàn thành"}</span>
              </div>
            </div>

            <div className="lcp-badge-box">
              <div className="lcp-badge-icon-container cyan">
                <Award size={20} fill="#ffffff" color="#06b6d4" />
              </div>
              <div className="lcp-badge-text">
                <span className="lcp-badge-label">STATUS</span>
                <span className="lcp-badge-value dark">
                  Excellent Job!
                </span>
              </div>
            </div>
          </div>

          <div className="lcp-actions-row">
            <button
              type="button"
              className="lcp-btn-next"
              onClick={handleGoToNextMilestone}
            >
              Tiếp tục học
            </button>
            <button
              type="button"
              className="lcp-btn-roadmap"
              onClick={handleReturn}
            >
              Return to Roadmap
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MilestoneCompletePage;
