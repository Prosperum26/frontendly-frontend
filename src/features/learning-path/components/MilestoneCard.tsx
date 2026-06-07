<<<<<<< HEAD
import React from 'react';
import type { Milestone } from '../types/learning-path.types';
=======
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
import { useAuthStore } from "../../../store/auth.store";
import { useGuestStore } from "../../../store/guest.store";
import { GuestModal } from "./GuestModal";
>>>>>>> origin/feature/learning-path/minhkola

interface MilestoneCardProps {
  milestone: Milestone;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone }) => {
<<<<<<< HEAD
=======
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
  const [showGuestModal, setShowGuestModal] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuthStore();
  const { canViewTheory, recordTheoryView } = useGuestStore();

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

    if (!isAuthenticated) {
      const lesson = lessons.find((l) => l.id === lessonId);
      if (lesson?.type === "practice" || !canViewTheory(lessonId)) {
        setShowGuestModal(true);
        return;
      }
      recordTheoryView(lessonId);
    }

    navigate(`/learning-path/milestone/${milestone.id}/lesson/${lessonId}`);
  };

>>>>>>> origin/feature/learning-path/minhkola
  return (
    <div className={`milestone-card ${milestone.completed ? 'completed' : ''}`}>
      <h3>{milestone.title}</h3>
      <p>{milestone.description}</p>
      <div className="lessons-count">
        {milestone.lessons.length} lessons
      </div>
<<<<<<< HEAD
=======

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
      <GuestModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
      />
>>>>>>> origin/feature/learning-path/minhkola
    </div>
  );
};

export default MilestoneCard;
