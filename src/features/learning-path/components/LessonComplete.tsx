import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MoreVertical, Award, Star } from "lucide-react";
import api from "../../../services/api";
import { useRoadmapStore } from "../stores/roadmapStore";
import { useRoadmap } from "../hooks/useRoadmap";
import { DEFAULT_SKILL_ID } from "../utils/roadmapMappers";
import { ROUTES } from "../../../constants/routes";
import "./LessonComplete.css";

export const LessonComplete: React.FC = () => {
  const { milestoneId, lessonId } = useParams<{
    milestoneId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getMilestoneDetailById = useRoadmapStore(
    (s) => s.getMilestoneDetailById,
  );
  const getNextLessonId = useRoadmapStore((s) => s.getNextLessonId);
  const { refetch } = useRoadmap(DEFAULT_SKILL_ID);

  useEffect(() => {
    void refetch();
    void queryClient.invalidateQueries({ queryKey: ["roadmap"] });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [refetch, queryClient]);

  const milestone = milestoneId
    ? getMilestoneDetailById(milestoneId)
    : undefined;
  const currentLesson = milestone?.lessons.find((l) => l.id === lessonId);
  const next =
    milestoneId && lessonId ? getNextLessonId(milestoneId, lessonId) : null;

  const handleReturn = () => {
    navigate(ROUTES.HOME);
  };

  const handleNextLesson = async () => {
    if (lessonId) {
      try {
        await api.patch(`/v1/stages/${lessonId}/complete`, {});
      } catch (err) {
        console.error("Error marking lesson complete before navigating:", err);
      }
    }

    try {
      await queryClient.invalidateQueries({ queryKey: ["roadmap"] });
      await refetch();
    } catch (err) {
      console.error("Error refreshing roadmap after completion:", err);
    }

    if (next) {
      navigate(
        `/learning-path/milestone/${next.milestoneId}/lesson/${next.lessonId}`,
      );
      return;
    }

    navigate(ROUTES.HOME);
  };

  const progressPercent = milestone?.progressPercent ?? 0;
  const completedCount = milestone?.completedLessons ?? 0;
  const totalCount = milestone?.totalLessons ?? 0;

  return (
    <div className="lcp-page-container">
      <header className="lcp-top-header">
        <div className="lcp-header-left" onClick={handleReturn}>
          <ArrowLeft size={20} className="lcp-back-icon" />
          <h2 className="lcp-header-title">Lesson Complete</h2>
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

          <h1 className="lcp-title">Lesson Complete!</h1>
          <p className="lcp-subtitle">
            {currentLesson
              ? `Bạn đã hoàn thành "${currentLesson.title}".`
              : "Great job! Keep going on your learning path."}
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
                <span className="lcp-badge-label">MILESTONE</span>
                <span className="lcp-badge-value dark">
                  {milestone?.title || "In progress"}
                </span>
              </div>
            </div>
          </div>

          <div className="lcp-progress-card">
            <div className="lcp-progress-card-header">
              <span className="lcp-progress-title">Module Progress</span>
              <span className="lcp-progress-percent-badge">
                {progressPercent}% Completed
              </span>
            </div>

            <div className="lcp-progress-track-bar">
              <div
                className="lcp-progress-track-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="lcp-progress-card-footer">
              <span className="lcp-module-name">
                {milestone?.title || "Learning module"}
              </span>
              <span className="lcp-lessons-ratio">
                {completedCount} of {totalCount} Lessons
              </span>
            </div>
          </div>

          <div className="lcp-actions-row">
            {next && (
              <button
                type="button"
                className="lcp-btn-next"
                onClick={handleNextLesson}
              >
                Next Lesson
              </button>
            )}
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

export default LessonComplete;
