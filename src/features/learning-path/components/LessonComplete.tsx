import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Trophy, ArrowRight, Home, Sparkles } from "lucide-react";
import { DUMMY_MILESTONE_DETAILS } from "../../../data/dummy/milestoneDetail";
import "./LessonComplete.css";

export const LessonComplete: React.FC = () => {
  const { milestoneId, lessonId } = useParams<{
    milestoneId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();

  const milestone = milestoneId
    ? DUMMY_MILESTONE_DETAILS[milestoneId]
    : undefined;
  const currentLesson = milestone?.lessons.find((l) => l.id === lessonId);

  // Find next lesson if any
  const currentIdx = milestone?.lessons.findIndex((l) => l.id === lessonId) ?? -1;
  const nextLesson =
    milestone && currentIdx !== -1 && currentIdx < milestone.lessons.length - 1
      ? milestone.lessons[currentIdx + 1]
      : undefined;

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!milestone || !currentLesson) {
    return (
      <div className="lc-wrapper">
        <div className="lc-card">
          <h2>Lesson not found</h2>
          <button className="lc-btn-primary" onClick={() => navigate("/learning-path")}>
            Back to Learning Path
          </button>
        </div>
      </div>
    );
  }

  // Calculate XP reward
  const xpReward = currentLesson.type === "theory" ? 100 : 150;

  return (
    <div className="lc-wrapper">
      {/* CSS-based Confetti Rain */}
      <div className="confetti-container">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className={`confetti confetti-${i % 5}`} />
        ))}
      </div>

      <div className="lc-card">
        {/* Celebration Header */}
        <div className="lc-icon-container">
          <div className="lc-trophy-ring animate-pulse-slow">
            <Trophy size={48} className="lc-trophy-icon" />
          </div>
          <Sparkles className="lc-sparkles-icon" size={24} />
        </div>

        <span className="lc-subtitle">LESSON COMPLETED</span>
        <h1 className="lc-title">{currentLesson.title}</h1>
        <p className="lc-desc">
          Fantastic job! You've successfully finished this lesson and unlocked new knowledge.
        </p>

        {/* XP and Rewards Section */}
        <div className="lc-rewards-box">
          <div className="lc-reward-item">
            <span className="lc-reward-value">+{xpReward}</span>
            <span className="lc-reward-label">XP Earned</span>
          </div>
          <div className="lc-reward-divider" />
          <div className="lc-reward-item">
            <span className="lc-reward-value">100%</span>
            <span className="lc-reward-label">Accuracy</span>
          </div>
        </div>

        {/* Milestone Progress Preview */}
        <div className="lc-progress-preview">
          <div className="lc-progress-header">
            <span>{milestone.title}</span>
            <span className="lc-progress-percent">
              {milestone.progressPercent}% Completed
            </span>
          </div>
          <div className="lc-progress-track">
            <div
              className="lc-progress-fill"
              style={{ width: `${milestone.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="lc-actions">
          {nextLesson && nextLesson.status !== "locked" ? (
            <button
              className="lc-btn-primary"
              onClick={() =>
                navigate(
                  `/learning-path/milestone/${milestoneId}/lesson/${nextLesson.id}`
                )
              }
            >
              Next Lesson
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              className="lc-btn-primary"
              onClick={() => navigate(`/learning-path/milestone/${milestoneId}`)}
            >
              Back to Roadmap
              <ArrowRight size={16} />
            </button>
          )}

          <button
            className="lc-btn-secondary"
            onClick={() => navigate("/learning-path")}
          >
            <Home size={16} />
            Learning Path
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonComplete;
