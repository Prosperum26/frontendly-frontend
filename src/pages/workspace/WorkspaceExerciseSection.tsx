import React from 'react';

const REQUIREMENTS = [
  { id: '1', label: 'Use CSS Grid with a 2-column asymmetric layout', done: true },
  { id: '2', label: 'Hero cell spans 2 rows on the left column', done: true },
  { id: '3', label: 'Maintain 16px gap between all grid items', done: false },
  { id: '4', label: 'Layout remains fluid on viewports under 768px', done: false },
];

export const WorkspaceExerciseSection: React.FC = () => {
  return (
    <section className="workspace-exercise" aria-labelledby="workspace-exercise-title">
      <div className="workspace-exercise__grid">
        <div className="workspace-exercise__intro">
          <div className="workspace-exercise__badge">
            <span className="workspace-exercise__badge-icon" aria-hidden />
            <span>Practice 1</span>
          </div>
          <h1 id="workspace-exercise-title" className="workspace-exercise__title">
            Building a Responsive Grid
          </h1>
          <p className="workspace-exercise__desc">
            In this exercise, you will implement a modern bento-style grid layout using CSS Grid.
            Your goal is to create an asymmetric layout that maintains visual hierarchy while
            remaining fully fluid. Pay close attention to the aspect ratios and padding between
            elements.
          </p>
        </div>

        <aside className="workspace-requirements">
          <h2 className="workspace-requirements__title">Requirements</h2>
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
            <div className="workspace-target__placeholder" role="img" aria-label="Target design preview">
              <div className="workspace-target__placeholder-bar" />
              <div className="workspace-target__placeholder-cell" />
              <div className="workspace-target__placeholder-cell" />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default WorkspaceExerciseSection;
