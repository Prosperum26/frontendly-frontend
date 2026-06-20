import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Circle } from "lucide-react";
import api from "../../../services/api";
import { useRoadmapStore } from "../stores/roadmapStore";
import { useRoadmap } from "../hooks/useRoadmap";
import { DEFAULT_SKILL_ID } from "../utils/roadmapMappers";
import { ROUTES, workspacePath } from "../../../constants/routes";
import { useAuthStore } from "../../../store/auth.store";
import { useGuestStore } from "../../../store/guest.store";
import { GuestModal } from "./GuestModal";
import "./TheoryPage.css";

interface Topic {
  title: string;
  content: string;
  code: string;
}

interface TheoryApiData {
  title?: string;
  contentHtml?: string;
  topics?: Topic[];
  proTips?: string;
  referenceLinks?: Array<
    string | { url?: string; link?: string; title?: string; name?: string }
  >;
}

export const TheoryPage: React.FC = () => {
  const { milestoneId, lessonId } = useParams<{
    milestoneId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();
  
  const getMilestoneDetailById = useRoadmapStore((s) => s.getMilestoneDetailById);
  const milestones = useRoadmapStore((s) => s.milestones);
  const { refetch, isLoading: roadmapLoading } = useRoadmap(DEFAULT_SKILL_ID);

  const { isAuthenticated } = useAuthStore();
  const { canViewTheory, recordTheoryView } = useGuestStore();
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [theoryData, setTheoryData] = useState<TheoryApiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockMessage, setUnlockMessage] = useState<string | null>(null);

  const stageId = lessonId ?? "";

  useEffect(() => {
    if (milestones.length === 0) {
      void refetch();
    }
  }, [milestones.length, refetch]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [lessonId]);

  useEffect(() => {
    const fetchTheory = async () => {
      if (!stageId) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/stages/${stageId}/theory`);
        setTheoryData(response.data?.data || response.data);
      } catch (err: unknown) {
        console.error("Error fetching stage theory:", err);
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load theory content.";
        setError(message);
        setTheoryData(null);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchTheory();
  }, [stageId]);

  const milestone = milestoneId ? getMilestoneDetailById(milestoneId) : undefined;

  const currentLesson = useMemo(
    () => milestone?.lessons.find((l) => l.id === lessonId),
    [milestone, lessonId]
  );

  if (!milestoneId || !lessonId) {
    return (
      <div className="tp-error-container">
        <h2>Missing Lesson Information</h2>
        <button
          type="button"
          className="tp-back-btn"
          onClick={() => navigate(ROUTES.LEARNING_PATH)}
        >
          <ArrowLeft size={16} /> Back to Learning Path
        </button>
      </div>
    );
  }

  if (!milestone && !roadmapLoading) {
    return (
      <div className="tp-error-container">
        <h2>Milestone Not Found</h2>
        <button
          type="button"
          className="tp-back-btn"
          onClick={() => navigate(ROUTES.LEARNING_PATH)}
        >
          <ArrowLeft size={16} /> Back to Learning Path
        </button>
      </div>
    );
  }

  const headerTitle = theoryData?.title || currentLesson?.title || "Theory Lesson";

  const handleBackToOverview = () => {
    navigate(`/learning-path/milestone/${milestoneId}`);
  };

  const handleLessonSelect = (id: string, status: string) => {
    if (status === "locked") return;
    if (id === lessonId) return;

    if (!isAuthenticated) {
      if (!canViewTheory(id)) {
        setShowGuestModal(true);
        return;
      }
      recordTheoryView(id);
    }

    navigate(`/learning-path/milestone/${milestoneId}/lesson/${id}`);
  };

  const handleContinue = async () => {
    if (!stageId || !milestoneId) return;

    if (!isAuthenticated) {
      if (!canViewTheory(stageId)) {
        setShowGuestModal(true);
        return;
      }
      recordTheoryView(stageId);
      const exerciseId = `exercise_${stageId}`;
      const targetPath = `${workspacePath(exerciseId)}?stageId=${stageId}&milestoneId=${milestoneId}`;
      navigate(targetPath, { state: { fromTheory: true } });
      return;
    }

    setIsUnlocking(true);
    setUnlockMessage(null);
    setError(null);

    try {
      const response = await api.patch(`/stages/${stageId}/unlock-practice`, {});
      const xpAwarded = response.data?.data?.xpAwarded || 0;
      const exerciseId = `exercise_${stageId}`;
      const targetPath = `${workspacePath(exerciseId)}?stageId=${stageId}&milestoneId=${milestoneId}`;

      if (xpAwarded > 0) {
        setUnlockMessage(`+${xpAwarded} XP awarded for theory!`);
        setTimeout(() => {
          navigate(targetPath, { state: { fromTheory: true } });
        }, 1500);
      } else {
        navigate(targetPath, { state: { fromTheory: true } });
      }
    } catch (err) {
      console.error("Error unlocking practice:", err);
      setError("Cannot unlock practice. Please try again.");
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div className="tp-page-container">
      <header className="tp-top-header">
        <button type="button" className="tp-header-left" onClick={handleBackToOverview}>
          <ArrowLeft size={20} className="tp-arrow-icon" />
          <h2 className="tp-header-title">{headerTitle}</h2>
        </button>

        <nav className="tp-header-nav">
          <Link to={ROUTES.HOME}>Home</Link>
          <Link to={ROUTES.LEARNING_PATH}>Learn Path</Link>
          <Link to={`/learning-path/milestone/${milestoneId}`}>Milestone</Link>
          <Link to={ROUTES.LEADERBOARD}>Leaderboard</Link>
          <Link to={ROUTES.PROFILE}>Profile</Link>
        </nav>
      </header>

      <div className="tp-content-layout">
        <aside className="tp-left-sidebar">
          <div className="tp-sidebar-lessons">
            <span className="tp-sidebar-subtitle">LESSONS</span>
            <ul className="tp-lessons-list">
              {milestone?.lessons.map((lesson) => {
                const isActive = lesson.id === lessonId;
                const isCompleted = lesson.status === "completed";
                const isLocked = lesson.status === "locked";

                return (
                  <li
                    key={lesson.id}
                    className={`tp-lesson-item ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""} ${isLocked ? "locked" : ""}`}
                    onClick={() => handleLessonSelect(lesson.id, lesson.status)}
                  >
                    {isCompleted ? (
                      <CheckCircle size={18} className="tp-lesson-icon completed" />
                    ) : isActive ? (
                      <div className="tp-active-dot-container">
                        <div className="tp-active-dot" />
                      </div>
                    ) : (
                      <Circle size={18} className="tp-lesson-icon" />
                    )}
                    <span className="tp-lesson-text">
                      {lesson.order}. {lesson.title}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        <main className="tp-main-body">
          <div className="tp-body-content-wrapper">
            {isLoading ? (
              <div className="tp-state-message text-muted">Loading theory content...</div>
            ) : error ? (
              <div className="tp-state-message text-danger">
                <p>{error}</p>
                <button type="button" className="tp-retry-btn" onClick={() => window.location.reload()}>
                  Retry
                </button>
              </div>
            ) : (
              <div className="tp-theory-article">
                <div className="tp-article-header">
                  <span className="tp-badge">THEORY</span>
                  <h1 className="tp-title">{headerTitle}</h1>
                </div>

                {theoryData?.topics && theoryData.topics.length > 0 ? (
                  <div className="tp-topics-container">
                    {theoryData.topics.map((topic, index) => (
                      <section key={index} className="tp-topic-section">
                        <h2 className="tp-topic-title">{topic.title}</h2>
                        <p className="tp-description">{topic.content}</p>

                        {topic.code && (
                          <div className="tp-code-editor">
                            <div className="tp-code-editor-header">
                              <div className="tp-editor-dots">
                                <span className="tp-dot red" />
                                <span className="tp-dot yellow" />
                                <span className="tp-dot green" />
                              </div>
                              <div className="tp-editor-filename">preview.js</div>
                            </div>
                            <pre className="tp-editor-content">
                              <code>{topic.code}</code>
                            </pre>
                          </div>
                        )}
                      </section>
                    ))}
                  </div>
                ) : theoryData?.contentHtml ? (
                  <div
                    className="tp-theory-contentHtml"
                    dangerouslySetInnerHTML={{ __html: theoryData.contentHtml }}
                  />
                ) : (
                  <p className="tp-description">No theory content available for this lesson.</p>
                )}

                {theoryData?.proTips && (
                  <div className="tp-pro-tips">
                    <h4 className="tp-pro-tips-title">Pro Tip</h4>
                    <p className="tp-pro-tips-text">{theoryData.proTips}</p>
                  </div>
                )}

                {theoryData?.referenceLinks && theoryData.referenceLinks.length > 0 && (
                  <div className="tp-reference-links">
                    <h3 className="tp-reference-title">Reference Links</h3>
                    <ul className="tp-reference-list">
                      {theoryData.referenceLinks.map((link, index) => {
                        const url = typeof link === "string" ? link : link.url || link.link;
                        const label = typeof link === "string" ? link : link.title || link.name || url;
                        return (
                          <li key={index} className="tp-reference-item">
                            <a href={url} target="_blank" rel="noopener noreferrer">
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
          </div>
        </main>
      </div>

      <footer className="tp-fixed-footer">
        <button type="button" className="tp-footer-back-link" onClick={handleBackToOverview}>
          <ArrowLeft size={16} />
          <span>BACK TO OVERVIEW</span>
        </button>

        <div className="tp-footer-right-actions">
          {unlockMessage && <div className="tp-toast-msg success">{unlockMessage}</div>}
          {error && <div className="tp-toast-msg error">{error}</div>}
          
          <button
            type="button"
            className="tp-footer-continue-btn"
            onClick={handleContinue}
            disabled={isUnlocking}
          >
            <span>{isUnlocking ? "Unlocking..." : "CONTINUE TO PRACTICE"}</span>
            <ArrowLeft size={16} className="tp-arrow-right-icon" />
          </button>
        </div>
      </footer>

      <GuestModal isOpen={showGuestModal} onClose={() => setShowGuestModal(false)} />
    </div>
  );
};

export default TheoryPage;