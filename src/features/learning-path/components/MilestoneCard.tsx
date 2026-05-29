import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
import completedMilestoneIcon from "../../../assets/learning-path/completed_milestone.svg";
import inProgressMilestoneIcon from "../../../assets/learning-path/InProgress_milestone.svg";

interface MilestoneCardProps {
  milestone: Milestone;
}

const getLessonIcon = (title: string, size: number = 14) => {
  const t = title.toLowerCase();
  if (t.includes("html")) return <FileCode2 size={size} />;
  if (t.includes("css")) return <Palette size={size} />;
  if (t.includes("layout") || t.includes("flexbox") || t.includes("grid"))
    return <LayoutGrid size={size} />;
  if (t.includes("position") || t.includes("event"))
    return <Globe size={size} />;
  if (
    t.includes("animation") ||
    t.includes("motion") ||
    t.includes("element") ||
    t.includes("manipulation")
  )
    return <Sparkles size={size} />;
  if (
    t.includes("responsive") ||
    t.includes("async") ||
    t.includes("data") ||
    t.includes("z-index") ||
    t.includes("fix")
  )
    return <Settings2 size={size} />;
  if (t.includes("dom") || t.includes("js")) return <Code2 size={size} />;
  if (t.includes("bug") || t.includes("error") || t.includes("interaction"))
    return <Bug size={size} />;
  if (t.includes("logic")) return <AlertTriangle size={size} />;
  return <Zap size={size} />;
};

function getLessonLockState(
  milestone: Milestone,
  lessonIndex: number,
): { isLocked: boolean; isActive: boolean } {
  const lessons = milestone.lessons || [];
  const lesson = lessons[lessonIndex];
  const isMilestoneLocked = milestone.status === "locked";
  const isMilestoneCompleted =
    milestone.status === "completed" || milestone.completed;
  const isMilestoneInProgress = milestone.status === "in_progress";

  if (isMilestoneLocked) {
    return { isLocked: true, isActive: false };
  }

  if (lesson.completed || isMilestoneCompleted) {
    return { isLocked: false, isActive: false };
  }

  if (isMilestoneInProgress) {
    const firstIncomplete = lessons.findIndex((l) => !l.completed);
    return {
      isLocked: firstIncomplete !== -1 && lessonIndex > firstIncomplete,
      isActive: lessonIndex === firstIncomplete,
    };
  }

  return { isLocked: true, isActive: false };
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone }) => {
  const navigate = useNavigate();
  const lessons = milestone.lessons || [];
  const completedLessons = lessons.filter((l) => l.completed).length;
  const totalLessons = lessons.length;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const completed = milestone.status === "completed" || milestone.completed;
  const isInProgress = milestone.status === "in_progress";
  const isLocked = milestone.status === "locked";

  const [activeTooltipLessonId, setActiveTooltipLessonId] = useState<
    string | null
  >(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setActiveTooltipLessonId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let statusClass = "is-locked";
  if (completed) statusClass = "is-completed";
  else if (isInProgress) statusClass = "is-in-progress";

  const handleScrollToActiveStage = () => {
    const activeElement =
      document.querySelector(".lesson-card.is-active") ||
      document.querySelector(".milestone-card.is-in-progress");
    activeElement?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isLocked || activeTooltipLessonId) {
      e.preventDefault();
      return;
    }
    navigate(`/learning-path/milestone/${milestone.id}`);
  };

  const handleLessonClick = (
    e: React.MouseEvent,
    lessonId: string,
    isLessonLocked: boolean,
  ) => {
    if (isLessonLocked) {
      e.preventDefault();
      e.stopPropagation();
      setActiveTooltipLessonId((prev) => (prev === lessonId ? null : lessonId));
      return;
    }
    e.stopPropagation();
    navigate(`/learning-path/milestone/${milestone.id}/lesson/${lessonId}`);
  };

  return (
    <div
      className={`milestone-card ${statusClass}`}
      onClick={handleCardClick}
      ref={cardRef}
      style={{
        cursor: isLocked ? "not-allowed" : "pointer",
        opacity: isLocked ? 0.6 : 1,
        borderColor: isInProgress ? "var(--color-primary, #2563eb)" : undefined,
        boxShadow: isInProgress
          ? "0 10px 15px -3px rgba(37, 99, 235, 0.15)"
          : undefined,
      }}
    >
      <div className="milestone-top-row">
        <div className="milestone-header-left">
          <div className="milestone-icon-box">
            {completed ? (
              <img src={completedMilestoneIcon} alt="Completed" />
            ) : isInProgress ? (
              <img src={inProgressMilestoneIcon} alt="In Progress" />
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
          <span
            className="milestone-badge badge-progress"
            style={{ backgroundColor: "#dbeafe", color: "#1e40af" }}
          >
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
        {lessons.map((lesson, index) => {
          const { isLocked: isLessonLocked, isActive: isLessonActive } =
            getLessonLockState(milestone, index);

          return (
            <motion.div
              key={lesson.id}
              className={`lesson-card ${isLessonActive ? "is-active" : ""} ${lesson.completed ? "is-completed" : ""} ${isLessonLocked ? "is-locked-stage" : ""}`}
              whileHover={!isLessonLocked ? { scale: 1.05, y: -2 } : {}}
              transition={{ duration: 0.2 }}
              onClick={(e) => handleLessonClick(e, lesson.id, isLessonLocked)}
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

              <AnimatePresence>
                {activeTooltipLessonId === lesson.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
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
                      cursor: "default",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      style={{
                        fontWeight: "600",
                        marginBottom: "8px",
                        lineHeight: "1.4",
                      }}
                    >
                      🔒 Bài học này đang khóa! Hãy hoàn thành các bài trước để
                      mở khóa nhé.
                    </div>
                    <button
                      type="button"
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
                      }}
                    >
                      Học tiếp bài hiện tại
                    </button>
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        marginLeft: "-6px",
                        width: "0",
                        height: "0",
                        borderLeft: "6px solid transparent",
                        borderRight: "6px solid transparent",
                        borderTop: "6px solid #1e293b",
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {isInProgress && (
        <div className="milestone-progress-section">
          <div className="milestone-progress-header">
            <span>Progress to next Milestone</span>
            <span
              className="milestone-progress-percent"
              style={{ color: "#2563eb" }}
            >
              {progressPercent}%
            </span>
          </div>
          <div className="milestone-progress-track">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="milestone-progress-fill"
              style={{
                background: "linear-gradient(90deg, #2563eb, #60a5fa)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneCard;
