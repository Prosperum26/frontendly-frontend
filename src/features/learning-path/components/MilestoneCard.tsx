import React from "react";
import { LayoutGrid, FileCode2, Palette, Zap } from "lucide-react";
import "./MilestoneCard.css";
import type { Milestone } from "../types/learning-path.types";

interface MilestoneCardProps {
  milestone: Milestone;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone }) => {
  const completedLessons = milestone.lessons.filter((l) => l.completed).length;
  const totalLessons = milestone.lessons.length;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const isInProgress = !milestone.completed && progressPercent > 0;

  let statusClass = "is-locked";
  if (milestone.completed) {
    statusClass = "is-completed";
  } else if (isInProgress) {
    statusClass = "is-in-progress";
  }

  return (
    <div className={`milestone-card ${statusClass}`}>
      {/* Milestone Header */}
      <div className="milestone-header">
        <div className="milestone-info">
          <div className="milestone-icon">
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
              <img
                src="src/assets/learning-path/Locked_milestone.svg"
                alt="Locked"
              />
            )}
          </div>
          <div>
            <div className="milestone-meta">
              <span className="milestone-order">
                Milestone {milestone.order}
              </span>

              {milestone.completed && (
                <span className="milestone-badge badge-completed">
                  100% Completed
                </span>
              )}
              {isInProgress && (
                <span className="milestone-badge badge-progress">
                  In Progress
                </span>
              )}
            </div>
            <h3 className="milestone-title">{milestone.title}</h3>
          </div>
        </div>
      </div>
      
      {/* Lessons Grid */}
      {(!milestone.completed || milestone.lessons.length > 0) && (
        <div className="lessons-grid">
          {milestone.lessons.map((lesson, index) => {
            const isLessonActive = isInProgress && !lesson.completed && index === completedLessons;
            return (
              <div 
                key={lesson.id} 
                className={`lesson-card ${isLessonActive ? 'is-active' : ''} ${lesson.completed ? 'is-completed' : ''}`}
              >
                <div className="lesson-type">
                  {lesson.title.includes('HTML') ? <FileCode2 size={12} /> : 
                   lesson.title.includes('CSS') ? <Palette size={12} /> : 
                   lesson.title.includes('Layout') ? <LayoutGrid size={12} /> : <Zap size={12} />}
                  {lesson.title.split(' ')[0] || "LESSON"}
                </div>
                <div className="lesson-title">
                  {index + 1}. {lesson.title}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Thanh tiến độ */}
      {isInProgress && (
        <div className="milestone-progress-section">
          <div className="milestone-progress-header">
            <span>Progress to next Milestone</span>
            <span>{progressPercent}%</span>
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
