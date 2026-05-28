import React from "react";
import type { Milestone } from "../types/learning-path.types";
import "./MilestoneCard.css";

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
