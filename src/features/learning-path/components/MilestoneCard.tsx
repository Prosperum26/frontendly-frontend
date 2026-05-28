import React from "react";
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

  const isInProgress = !milestone.completed && progressPercent > 0;
  const isLocked = !milestone.completed && progressPercent === 0;

  let statusClass = "is-locked";
  if (milestone.completed) {
    statusClass = "is-completed";
  } else if (isInProgress) {
    statusClass = "is-in-progress";
  }

  const handleCardClick = () => {
    navigate(`/learning-path/milestone/${milestone.id}`);
  };

  return (
    <div className={`milestone-card ${statusClass}`} onClick={handleCardClick} style={{ cursor: "pointer" }}>
      {/* Milestone Header */}
      <div className="milestone-top-row">
        <div className="milestone-header-left">
          <div className="milestone-icon-box">
            {milestone.completed ? (
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

        {milestone.completed && (
          <span className="milestone-badge badge-completed">
            100% Completed
          </span>
        )}
        {isInProgress && (
          <span className="milestone-badge badge-progress">In Progress</span>
        )}
        {isLocked && (
          <span className="milestone-badge badge-locked">
            <Lock size={12} /> Locked
          </span>
        )}
      </div>

      {/* Lessons Grid */}
      <div className="lessons-grid">
        {milestone.lessons.map((lesson, index) => {
          const isLessonActive =
            isInProgress && !lesson.completed && index === completedLessons;
          return (
            <div
              key={lesson.id}
              className={`lesson-card ${isLessonActive ? "is-active" : ""} ${lesson.completed ? "is-completed" : ""}`}
            >
              <div className="lesson-type">
                {getLessonIcon(lesson.title, 14)}
                {lesson.title.split(" ")[0] || "LESSON"}
              </div>
              <div className="lesson-title">
                {index + 1}. {lesson.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress bar - only for in-progress milestones */}
      {isInProgress && (
        <div className="milestone-progress-section">
          <div className="milestone-progress-header">
            <span>Progress to next Milestone</span>
            <span className="milestone-progress-percent">
              {progressPercent}%
            </span>
          </div>
          <div className="milestone-progress-track">
            <div
              className="milestone-progress-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneCard;
