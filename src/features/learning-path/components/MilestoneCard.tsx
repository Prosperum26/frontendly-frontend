import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  FileCode2,
  Palette,
  Zap,
  Lock,
  Code2,
  Globe,
  Sparkles,
  Settings2,
  Bug,
  AlertTriangle,
} from "lucide-react";
import "./MilestoneCard.css";
import type { Milestone } from "../types/learning-path.types";

interface MilestoneCardProps {
  milestone: Milestone;
}

const getLessonIcon = (title: string, size: number = 14) => {
  const t = title.toLowerCase();
  if (t.includes("html")) return <FileCode2 size={size} />;
  if (t.includes("css")) return <Palette size={size} />;
  if (t.includes("layout") || t.includes("flexbox") || t.includes("grid"))
    return <LayoutGrid size={size} />;
  if (t.includes("box")) return <LayoutGrid size={size} />;
  if (t.includes("position")) return <Globe size={size} />;
  if (t.includes("animation") || t.includes("motion"))
    return <Sparkles size={size} />;
  if (t.includes("responsive")) return <Settings2 size={size} />;
  if (t.includes("dom") || t.includes("js")) return <Code2 size={size} />;
  if (t.includes("event")) return <Globe size={size} />;
  if (t.includes("element") || t.includes("manipulation"))
    return <Sparkles size={size} />;
  if (t.includes("async") || t.includes("data"))
    return <Settings2 size={size} />;
  if (t.includes("bug") || t.includes("error")) return <Bug size={size} />;
  if (t.includes("z-index") || t.includes("fix"))
    return <Settings2 size={size} />;
  if (t.includes("render") || t.includes("performance"))
    return <Zap size={size} />;
  if (t.includes("logic")) return <AlertTriangle size={size} />;
  if (t.includes("interaction")) return <Bug size={size} />;
  return <Zap size={size} />;
};

export const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone }) => {
  const navigate = useNavigate();
  const completedLessons = milestone.lessons.filter((l) => l.completed).length;
  const totalLessons = milestone.lessons.length;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const completed = milestone.status === "completed" || milestone.completed;
  const isInProgress = milestone.status === "in_progress";
  const isLocked = milestone.status === "locked";

  const [activeTooltipLessonId, setActiveTooltipLessonId] = useState<string | null>(null);

  let statusClass = "is-locked";
  if (completed) {
    statusClass = "is-completed";
  } 
  else if (isInProgress) {
    statusClass = "is-in-progress";
  }

  const handleScrollToActiveStage = () => {
    const activeElement = document.querySelector(".lesson-card.is-active") || document.querySelector(".milestone-card.is-in-progress");
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isLocked) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    navigate(`/learning-path/milestone/${milestone.id}`);
  };

  return (
    <div
      className={`milestone-card ${statusClass}`}
      onClick={handleCardClick}
      style={{
        cursor: isLocked ? "not-allowed" : "pointer",
        opacity: isLocked ? 0.5 : 1,
        borderColor: isInProgress ? "var(--color-primary, #2563eb)" : undefined,
        boxShadow: isInProgress ? "0 10px 15px -3px rgba(37, 99, 235, 0.15)" : undefined,
      }}
    >
      <div className="milestone-top-row">
        <div className="milestone-header-left">
          <div className="milestone-icon-box">
            {completed ? (
              <img
                src="src/assets/learning-path/completed_milestone.svg"
                alt="Completed"
              />
            ) : isInProgress ? (
              <img
                src="src/assets/learning-path/InProgress_milestone.svg"
                alt="In Progress"
              />
            ) : (
              <Lock size={24} />
            )}
          </div>
          <div>
            <span className="milestone-subtitle">
              Milestone {milestone.order}
            </span>
            <h3 className="milestone-title">{milestone.title}</h3>
          </div>
        </div>

        {completed && (
          <span className="milestone-badge badge-completed">
            100% Completed
          </span>
        )}
        {isInProgress && (
          <span className="milestone-badge badge-progress" style={{ backgroundColor: "#dbeafe", color: "#1e40af" }}>
            In Progress
          </span>
        )}
        {isLocked && (
          <span className="milestone-badge badge-locked">
            <Lock size={12} /> Locked
          </span>
        )}
      </div>

      <div className="lessons-grid">
        {milestone.lessons.map((lesson, index) => {
          const isLessonActive =
            isInProgress && !lesson.completed && index === completedLessons;
          const isLessonLocked = isLocked || (!lesson.completed && !isLessonActive);

          return (
            <div
              key={lesson.id}
              className={`lesson-card ${isLessonActive ? "is-active" : ""} ${lesson.completed ? "is-completed" : ""} ${isLessonLocked ? "is-locked-stage" : ""}`}
              onClick={(e) => {
                if (isLessonLocked) {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveTooltipLessonId(activeTooltipLessonId === lesson.id ? null : lesson.id);
                }
              }}
              style={{
                position: "relative",
                cursor: isLessonLocked ? "not-allowed" : "pointer",
                opacity: isLessonLocked ? 0.6 : 1,
              }}
            >
              <div className="lesson-type">
                {getLessonIcon(lesson.title, 14)}
                {lesson.title.split(" ")[0] || "LESSON"}
              </div>
              <div className="lesson-title">
                {index + 1}. {lesson.title}
              </div>

              {/* Tooltip Popup for locked stages */}
              {activeTooltipLessonId === lesson.id && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "125%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "240px",
                    backgroundColor: "#1e293b",
                    color: "#ffffff",
                    padding: "12px",
                    borderRadius: "8px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                    fontSize: "12px",
                    zIndex: 100,
                    textAlign: "center",
                    border: "1px solid #334155",
                    cursor: "default"
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ fontWeight: "600", marginBottom: "8px", lineHeight: "1.4" }}>
                    🔒 Chặng này đang khóa! Hãy hoàn thành các bài học trước để mở khóa nhé.
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveTooltipLessonId(null);
                      handleScrollToActiveStage();
                    }}
                    style={{
                      backgroundColor: "#0284c7",
                      color: "#ffffff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: "700",
                      cursor: "pointer",
                      marginTop: "6px",
                      width: "100%",
                      transition: "background-color 0.2s"
                    }}
                  >
                    Học tiếp bài hiện tại
                  </button>
                  {/* Arrow element */}
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "0",
                      height: "0",
                      borderLeft: "6px solid transparent",
                      borderRight: "6px solid transparent",
                      borderTop: "6px solid #1e293b",
                    }}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isInProgress && (
        <div className="milestone-progress-section">
          <div className="milestone-progress-header">
            <span>Progress to next Milestone</span>
            <span className="milestone-progress-percent" style={{ color: "#2563eb" }}>
              {progressPercent}%
            </span>
          </div>
          <div className="milestone-progress-track">
            <div
              className="milestone-progress-fill"
              style={{
                width: `${progressPercent}%`,
                background: "linear-gradient(90deg, #2563eb, #60a5fa)",
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneCard;
