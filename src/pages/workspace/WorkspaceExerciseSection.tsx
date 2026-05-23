import React, { useState } from 'react';

const REQUIREMENTS = [
  { id: '1', label: 'Use CSS Grid with a 2-column asymmetric layout', done: true },
  { id: '2', label: 'Hero cell spans 2 rows on the left column', done: true },
  { id: '3', label: 'Maintain 16px gap between all grid items', done: false },
  { id: '4', label: 'Layout remains fluid on viewports under 768px', done: false },
];

export const WorkspaceExerciseSection: React.FC = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className="workspace-exercise" aria-labelledby="workspace-exercise-title">
      <div
        className={
          expanded
            ? 'workspace-exercise-panel'
            : 'workspace-exercise-panel workspace-exercise-panel--collapsed'
        }
      >
        <div className="workspace-exercise-panel__header">
          <div className="workspace-exercise-panel__summary">
            <span className="workspace-exercise-panel__summary-badge">
              <span className="workspace-exercise__badge-icon" aria-hidden />
              Practice 1
            </span>
            <h2 id="workspace-exercise-title" className="workspace-exercise-panel__summary-title">
              Building a Responsive Grid
            </h2>
          </div>
          <button
            type="button"
            className="workspace-exercise-panel__toggle"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            aria-controls="workspace-exercise-panel-body"
          >
            <span className="workspace-exercise-panel__toggle-label">
              {expanded ? 'Thu gọn' : 'Mở rộng'}
            </span>
            <svg
              className="workspace-exercise-panel__toggle-icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <path
                d="M4 10L8 6L12 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div id="workspace-exercise-panel-body" className="workspace-exercise-panel__body">
          <div className="workspace-exercise__grid">
            <div className="workspace-exercise__intro">
              <p className="workspace-exercise__desc">
                In this exercise, you will implement a modern bento-style grid layout using CSS Grid.
                Your goal is to create an asymmetric layout that maintains visual hierarchy while
                remaining fully fluid. Pay close attention to the aspect ratios and padding between
                elements.
              </p>
            </div>

            <aside className="workspace-requirements">
              <h3 className="workspace-requirements__title">Requirements</h3>
              <ul className="workspace-requirements__list">
                {REQUIREMENTS.map((item) => (
                  <li key={item.id} className="workspace-requirements__item">
                    <span
                      className={
                        item.done
                          ? 'workspace-requirements__check workspace-requirements__check--done'
                          : 'workspace-requirements__check'
                      }
                      aria-hidden
                    >
                      {item.done && (
                        <svg viewBox="0 0 20 20" fill="none">
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
            </aside>

            <aside className="workspace-target">
              <div className="workspace-target__head">
                <span className="workspace-target__label">TARGET DESIGN</span>
                <span className="workspace-target__expand" aria-hidden />
              </div>
              <div className="workspace-target__image-wrap">
                <div
                  className="workspace-target__placeholder"
                  role="img"
                  aria-label="Target design preview"
                >
                  <div className="workspace-target__placeholder-bar" />
                  <div className="workspace-target__placeholder-cell" />
                  <div className="workspace-target__placeholder-cell" />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkspaceExerciseSection;
