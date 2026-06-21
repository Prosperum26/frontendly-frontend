import React from "react";
import { BookOpen, CheckCircle2, Lock, PlayCircle } from "lucide-react";

interface StudyPlanPanelProps {
  studyPlan: string[];
  score?: number;
  totalQuestions?: number;
  level?: string;
}

export const StudyPlanPanel: React.FC<StudyPlanPanelProps> = ({
  studyPlan,
  score,
  totalQuestions,
  level,
}) => {
  if (!studyPlan.length && score === undefined) return null;

  return (
    <section className="study-plan-panel">
      <div className="study-plan-header">
        <BookOpen size={18} />
        <h2>Your Personalized Study Plan</h2>
      </div>

      {(score !== undefined || level) && (
        <div className="study-plan-summary">
          {score !== undefined && totalQuestions !== undefined && (
            <span>
              Score: {score}/{totalQuestions}
            </span>
          )}
          {level && <span>Level: {level}</span>}
        </div>
      )}

      <ul className="study-plan-list">
        {studyPlan.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="study-plan-legend">
        <span>
          <CheckCircle2 size={14} /> Auto-passed
        </span>
        <span>
          <PlayCircle size={14} /> Required
        </span>
        <span>
          <Lock size={14} /> Locked
        </span>
      </div>
    </section>
  );
};

export default StudyPlanPanel;
