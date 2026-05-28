import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Loader,
  Lock,
  Rocket,
  ArrowLeft,
  Play,
  Calendar,
  Star,
} from "lucide-react";
import { DUMMY_MILESTONE_DETAILS } from "../../../data/dummy/milestoneDetail";
import type { DetailLesson } from "../types/learning-path.types";
import "./MilestoneDetail.css";

const CompletedCard: React.FC<{ lesson: DetailLesson }> = ({ lesson }) => (
  <div className="md-lesson-card card-completed">
    <div className="md-card-info">
      <h3>{lesson.title}</h3>
      <p>{lesson.description}</p>
    </div>
    <div className="md-card-meta">
      {lesson.duration && (
        <span className="md-card-duration">{lesson.duration}</span>
      )}
      <span className="md-card-status-badge completed">Completed</span>
    </div>
  </div>
);
const InProgressCard: React.FC<{
  lesson: DetailLesson;
  milestoneId: string;
}> = ({ lesson, milestoneId }) => {
  const navigate = useNavigate();
  return (
    <div className="md-lesson-card card-in-progress">
      <div className="md-card-expanded">
        <div className="md-card-expanded-header">
          <span className="md-card-type-badge">IN PROGRESS</span>
          <div className="md-card-type-info">
            <Calendar size={14} />
            <span>
              {lesson.type === "liveClass" ? "Live Class" : "Theory"} •{" "}
              {lesson.duration}
            </span>
          </div>
        </div>
        <h3>{lesson.title}</h3>
        <p>{lesson.description}</p>
        <div className="md-card-expanded-body">
          <div className="md-card-expanded-text">
            {lesson.tags.length > 0 && (
              <div className="md-card-tags">
                {lesson.tags.map((tag, i) => (
                  <span key={i} className="md-card-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <button
              className="md-continue-btn"
              onClick={() =>
                navigate(
                  `/learning-path/milestone/${milestoneId}/lesson/${lesson.id}`
                )
              }
            >
              Continue Lesson <Play size={16} fill="white" />
            </button>
          </div>
          {lesson.codePreview && (
            <div className="md-code-preview">
              <div className="md-code-preview-header">
                <span className="md-code-dot red" />
                <span className="md-code-dot yellow" />
                <span className="md-code-dot green" />
              </div>
              <div className="md-code-content">{lesson.codePreview}</div>
              <div className="md-code-grid-demo">
                <div className="md-code-grid-cell" />
                <div className="md-code-grid-cell" />
                <div className="md-code-grid-cell" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const LockedCard: React.FC<{ lesson: DetailLesson }> = ({ lesson }) => (
  <div className="md-lesson-card card-locked">
    <div className="md-card-info">
      <h3>{lesson.title}</h3>
      <p>{lesson.description}</p>
    </div>
    {lesson.duration && (
      <div className="md-card-meta">
        <span className="md-card-duration">{lesson.duration}</span>
      </div>
    )}
  </div>
);
const FinalProjectCard: React.FC<{ lesson: DetailLesson }> = ({ lesson }) => (
  <div className="md-lesson-card card-final-project">
    <span className="md-card-final-label">FINAL PROJECT</span>
    <h3>{lesson.title}</h3>
    <p>{lesson.description}</p>
    <button className="md-view-btn">View Requirements</button>
  </div>
);
const TimelineDot: React.FC<{ lesson: DetailLesson }> = ({ lesson }) => {
  if (lesson.type === "finalProject") {
    return (
      <div className="md-timeline-dot final-project">
        <Rocket size={16} />
      </div>
    );
  }
  if (lesson.status === "completed") {
    return (
      <div className="md-timeline-dot completed">
        <CheckCircle size={16} />
      </div>
    );
  }
  if (lesson.status === "in_progress") {
    return (
      <div className="md-timeline-dot in-progress">
        <Loader size={16} />
      </div>
    );
  }
  return (
    <div className="md-timeline-dot locked">
      <Lock size={14} />
    </div>
  );
};

export const MilestoneDetailPage: React.FC = () => {
  const { milestoneId } = useParams<{ milestoneId: string }>();
  const navigate = useNavigate();
  
  let milestone = milestoneId
    ? DUMMY_MILESTONE_DETAILS[milestoneId]
    : undefined;

  if (!milestone && milestoneId) {
    const cleanId = milestoneId.replace(/\D/g, "");
    const fallbackKey = `m${cleanId || "2"}`;
    milestone = DUMMY_MILESTONE_DETAILS[fallbackKey] || DUMMY_MILESTONE_DETAILS["m2"];
  }

  if (!milestone) {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        <h2>Milestone not found</h2>
        <button className="md-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Back to Learning Path
        </button>
      </div>
    );
  }

  return (
    <div className="milestone-detail-wrapper">
      <aside className="md-sidebar">
        <div className="md-progress-card">
          <div className="md-progress-label">Current Progress</div>
          <div className="md-progress-stats">
            <span className="md-progress-percent">
              {milestone.progressPercent}%
            </span>
            <span className="md-progress-count">
              {milestone.completedLessons}/{milestone.totalLessons} Lessons
            </span>
          </div>
          <div className="md-progress-bar">
            <div
              className="md-progress-bar-fill"
              style={{ width: `${milestone.progressPercent}%` }}
            />
          </div>
        </div>
        <div className="md-lesson-nav">
          <div className="md-lesson-nav-title">Lessons</div>
          <ul className="md-lesson-nav-list">
            {milestone.lessons.map((lesson) => (
              <li
                key={lesson.id}
                className={`md-lesson-nav-item ${
                  lesson.status === "in_progress" ? "is-active" : ""
                } ${lesson.status === "completed" ? "is-completed" : ""} ${
                  lesson.status === "locked" ? "is-locked" : ""
                }`}
                onClick={() => {
                  if (lesson.status !== "locked" && lesson.type !== "finalProject") {
                    navigate(
                      `/learning-path/milestone/${milestone.id}/lesson/${lesson.id}`
                    );
                  }
                }}
              >
                <span
                  className={`md-lesson-nav-icon ${lesson.status === "completed" ? "completed" : ""} ${lesson.status === "in_progress" ? "in-progress" : ""} ${lesson.status === "locked" ? "locked" : ""}`}
                >
                  {lesson.status === "completed" ? (
                    <CheckCircle size={16} />
                  ) : lesson.status === "in_progress" ? (
                    <Loader size={16} />
                  ) : (
                    <Lock size={14} />
                  )}
                </span>
                {lesson.order}. {lesson.title}
              </li>
            ))}
          </ul>
        </div>
        
        {milestone.proTip && (
          <div className="md-protip-card">
            <img src={milestone.proTip.imageUrl} alt="Pro Tip" />
            <div className="md-protip-overlay">
              <span className="md-protip-badge">PRO TIP</span>
              <p className="md-protip-text">{milestone.proTip.text}</p>
            </div>
          </div>
        )}
      </aside>
      <main className="md-main">
        <button className="md-back-btn" onClick={() => navigate("/learning-path")}>
          <ArrowLeft size={16} />
          Back to Learning Path
        </button>
        <div className="md-milestone-badge">
          <Star size={14} fill="#15803d" />
          Milestone {milestone.milestoneNumber}
        </div>
        <h1 className="md-milestone-title">{milestone.title}</h1>
        <p className="md-milestone-desc">{milestone.description}</p>
        <div className="md-timeline">
          {milestone.lessons.map((lesson) => (
            <div key={lesson.id} className="md-timeline-item">
              <TimelineDot lesson={lesson} />
              {lesson.type === "finalProject" ? (
                <FinalProjectCard lesson={lesson} />
              ) : lesson.status === "completed" ? (
                <CompletedCard lesson={lesson} />
              ) : lesson.status === "in_progress" ? (
                <InProgressCard lesson={lesson} milestoneId={milestone.id} />
              ) : (
                <LockedCard lesson={lesson} />
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
export default MilestoneDetailPage;