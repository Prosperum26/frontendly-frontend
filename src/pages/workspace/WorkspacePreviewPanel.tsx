import React from 'react';

export const WorkspacePreviewPanel: React.FC = () => {
  return (
    <section className="workspace-preview" aria-label="Live preview">
      <div className="workspace-preview__header">
        <div className="workspace-preview__title">
          <span className="workspace-preview__title-icon" aria-hidden />
          LIVE PREVIEW
        </div>
        <button type="button" className="workspace-preview__submit">
          Submit
          <span className="workspace-preview__submit-arrow" aria-hidden>
            →
          </span>
        </button>
      </div>
      <div className="workspace-preview__viewport-wrap">
        <div className="workspace-preview__viewport">
          <div className="workspace-preview__mock-grid" aria-hidden>
            <div className="workspace-preview__cell-hero">
              <div className="workspace-preview__cell-hero-bar" />
              <div className="workspace-preview__cell-hero-bar workspace-preview__cell-hero-bar--sm" />
            </div>
            <div className="workspace-preview__cell-accent">
              <div className="workspace-preview__cell-accent-icon" />
            </div>
            <div className="workspace-preview__cell-default">
              <div className="workspace-preview__cell-default-icon" />
            </div>
            <div className="workspace-preview__cell-default">
              <div className="workspace-preview__cell-bars">
                <div className="workspace-preview__bar workspace-preview__bar--lg" />
                <div className="workspace-preview__bar workspace-preview__bar--sm" />
              </div>
            </div>
          </div>
          <p className="workspace-preview__caption">Live render viewport</p>
        </div>
      </div>
    </section>
  );
};

export default WorkspacePreviewPanel;
