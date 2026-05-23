import React from 'react';
import type { ExerciseRequirement } from '../types/editor.types';
import './editor-ui.css';

export interface ProblemPaneProps {
  practiceLabel: string;
  title: string;
  description: string;
  requirements: ExerciseRequirement[];
}

export const ProblemPane: React.FC<ProblemPaneProps> = ({
  practiceLabel,
  title,
  description,
  requirements,
}) => {
  return (
    <div className="problem-pane">
      <div className="problem-pane__badge">
        <span className="problem-pane__badge-icon" aria-hidden />
        <span>{practiceLabel}</span>
      </div>
      <h2 className="problem-pane__title">{title}</h2>
      <p className="problem-pane__desc">{description}</p>
      <h3 className="problem-pane__requirements-title">Requirements</h3>
      <ul className="problem-pane__list">
        {requirements.map((item) => (
          <li key={item.id} className="problem-pane__item">
            <span
              className={
                item.done
                  ? 'problem-pane__check problem-pane__check--done'
                  : 'problem-pane__check'
              }
              aria-hidden
            >
              {item.done && (
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M5 10l3 3 7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProblemPane;
