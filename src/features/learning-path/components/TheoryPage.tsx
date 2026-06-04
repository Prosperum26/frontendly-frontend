import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Circle } from "lucide-react";
import api from "../../../services/api";
import { useRoadmapStore } from "../stores/roadmapStore";
import { useRoadmap } from "../hooks/useRoadmap";
import { DEFAULT_SKILL_ID } from "../utils/roadmapMappers";
import { ROUTES } from "../../../constants/routes";
import "./TheoryPage.css";

interface TheoryApiData {
  title?: string;
  contentHtml?: string;
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
  const getMilestoneDetailById = useRoadmapStore(
    (s) => s.getMilestoneDetailById,
  );
  const milestones = useRoadmapStore((s) => s.milestones);
  const { refetch, isLoading: roadmapLoading } = useRoadmap(DEFAULT_SKILL_ID);

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
        const response = await api.get(`/v1/stages/${stageId}/theory`);
        setTheoryData(response.data?.data || response.data);
      } catch (err: unknown) {
        console.error("Error fetching stage theory:", err);
        const message =
          err instanceof Error
            ? err.message
            : "Không thể tải nội dung lý thuyết.";
        setError(message);
        setTheoryData(null);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchTheory();
  }, [stageId]);

  const milestone = milestoneId
    ? getMilestoneDetailById(milestoneId)
    : undefined;

  const currentLesson = useMemo(
    () => milestone?.lessons.find((l) => l.id === lessonId),
    [milestone, lessonId],
  );

  if (!milestoneId || !lessonId) {
    return (
      <div className="tp-error-container">
        <h2>Thiếu thông tin bài học</h2>
        <button
          type="button"
          className="tp-back-btn"
          onClick={() => navigate(ROUTES.LEARNING_PATH)}
        >
          <ArrowLeft size={16} /> Về Learning Path
        </button>
      </div>
    );
  }

  if (!milestone && !roadmapLoading) {
    return (
      <div className="tp-error-container">
        <h2>Không tìm thấy milestone</h2>
        <button
          type="button"
          className="tp-back-btn"
          onClick={() => navigate(ROUTES.LEARNING_PATH)}
        >
          <ArrowLeft size={16} /> Về Learning Path
        </button>
      </div>
    );
  }

  const headerTitle =
    theoryData?.title || currentLesson?.title || "Theory Lesson";

  const handleBackToOverview = () => {
    navigate(`/learning-path/milestone/${milestoneId}`);
  };

  const handleLessonSelect = (id: string, status: string) => {
    if (status === "locked") return;
    if (id === lessonId) return;
    navigate(`/learning-path/milestone/${milestoneId}/lesson/${id}`);
  };

  const handleContinue = async () => {
    if (!stageId || !milestoneId) return;
    setIsUnlocking(true);
    setUnlockMessage(null);
    setError(null);

    try {
      const response = await api.patch(
        `/v1/stages/${stageId}/unlock-practice`,
        {},
      );
      const xpAwarded = response.data?.data?.xpAwarded || 0;

      if (xpAwarded > 0) {
        setUnlockMessage(`+${xpAwarded} XP được cộng cho lý thuyết!`);
        setTimeout(() => {
          navigate(`/workspace?stageId=${stageId}&milestoneId=${milestoneId}`, {
            state: { fromTheory: true },
          });
        }, 1500);
      } else {
        navigate(`/workspace?stageId=${stageId}&milestoneId=${milestoneId}`, {
          state: { fromTheory: true },
        });
      }
    } catch (err) {
      console.error("Error unlocking practice:", err);
      setError("Không thể mở khóa bài tập. Vui lòng thử lại.");
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div className="tp-page-container">
      <header className="tp-top-header">
        <button
          type="button"
          className="tp-header-left"
          onClick={handleBackToOverview}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
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
                    style={{
                      cursor: isLocked ? "not-allowed" : "pointer",
                      opacity: isLocked ? 0.5 : 1,
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle
                        size={18}
                        className="tp-lesson-icon completed"
                      />
                    ) : isActive ? (
                      <div className="tp-active-dot-container">
                        <div className="tp-active-dot" />
                      </div>
                    ) : (
                      <Circle size={18} className="tp-lesson-icon" />
                    )}
                    <span>
                      {lesson.order}. {lesson.title}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        <main className="tp-main-body">
          <div className="tp-body-grid">
            {isLoading ? (
              <div
                className="tp-body-left"
                style={{ padding: "40px", color: "#94a3b8" }}
              >
                Đang tải nội dung lý thuyết...
              </div>
            ) : error ? (
              <div
                className="tp-body-left"
                style={{ padding: "40px", color: "#ef4444" }}
              >
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  style={{ marginTop: 12 }}
                >
                  Thử lại
                </button>
              </div>
            ) : (
              <div className="tp-body-left">
                <span className="tp-badge">THEORY</span>
                <h1 className="tp-title">{headerTitle}</h1>

                {theoryData?.contentHtml ? (
                  <div
                    className="tp-theory-contentHtml"
                    dangerouslySetInnerHTML={{
                      __html: theoryData.contentHtml,
                    }}
                    style={{
                      lineHeight: "1.7",
                      color: "var(--color-body)",
                      fontSize: "15px",
                    }}
                  />
                ) : (
                  <p className="tp-description">
                    Chưa có nội dung lý thuyết cho bài học này.
                  </p>
                )}

                {theoryData?.proTips && (
                  <div
                    className="tp-pro-tips"
                    style={{
                      marginTop: "24px",
                      padding: "16px",
                      background: "#fef3c7",
                      borderRadius: "8px",
                      borderLeft: "4px solid #d97706",
                    }}
                  >
                    <h4
                      style={{
                        color: "#92400e",
                        fontWeight: "bold",
                        marginBottom: "4px",
                        fontSize: "14px",
                      }}
                    >
                      Pro Tip
                    </h4>
                    <p
                      style={{
                        color: "#78350f",
                        margin: 0,
                        fontSize: "13px",
                      }}
                    >
                      {theoryData.proTips}
                    </p>
                  </div>
                )}

                {theoryData?.referenceLinks &&
                  theoryData.referenceLinks.length > 0 && (
                    <div
                      className="tp-reference-links"
                      style={{
                        marginTop: "32px",
                        paddingTop: "20px",
                        borderTop: "1px solid #e2e8f0",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          marginBottom: "12px",
                        }}
                      >
                        Reference Links
                      </h3>
                      <ul
                        style={{
                          listStyleType: "disc",
                          paddingLeft: "20px",
                        }}
                      >
                        {theoryData.referenceLinks.map((link, index) => {
                          const url =
                            typeof link === "string"
                              ? link
                              : link.url || link.link;
                          const label =
                            typeof link === "string"
                              ? link
                              : link.title || link.name || url;
                          return (
                            <li key={index} style={{ marginBottom: "8px" }}>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "#2563eb",
                                  textDecoration: "underline",
                                }}
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
          </div>
        </main>
      </div>

      <footer className="tp-fixed-footer">
        <button
          type="button"
          className="tp-footer-back-link"
          onClick={handleBackToOverview}
        >
          <ArrowLeft size={16} />
          <span>BACK TO OVERVIEW</span>
        </button>

        <button
          type="button"
          className="tp-footer-continue-btn"
          onClick={handleContinue}
          disabled={isUnlocking}
          style={{ opacity: isUnlocking ? 0.6 : 1 }}
        >
          <span>
            {isUnlocking ? "Đang mở khóa..." : "CONTINUE TO PRACTICE"}
          </span>
          <ArrowLeft size={16} className="tp-arrow-right-icon" />
        </button>
        {unlockMessage && (
          <div
            style={{
              marginTop: "12px",
              padding: "12px",
              backgroundColor: "#d4edda",
              color: "#155724",
              borderRadius: "4px",
              textAlign: "center",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {unlockMessage}
          </div>
        )}
        {error && (
          <div
            style={{
              marginTop: "12px",
              padding: "12px",
              backgroundColor: "#f8d7da",
              color: "#721c24",
              borderRadius: "4px",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}
      </footer>
    </div>
  );
};

export default TheoryPage;
