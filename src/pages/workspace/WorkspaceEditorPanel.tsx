import React from 'react';

const MOCK_LINES: { n: number; code: string; kind?: 'comment' }[] = [
  { n: 1, code: '<div class="grid-container">' },
  { n: 2, code: '  <div class="hero-cell">' },
  { n: 3, code: '    <h2>Main Featured Content</h2>' },
  { n: 4, code: '  </div>' },
  { n: 5, code: '  <div class="stat-card">...</div>' },
  { n: 6, code: '  <div class="action-card">...</div>' },
  { n: 7, code: '  <div class="info-card">...</div>' },
  { n: 8, code: '</div>' },
  { n: 9, code: '' },
  { n: 10, code: '// TODO: Implement the grid logic in style.css', kind: 'comment' },
];

export const WorkspaceEditorPanel: React.FC = () => {
  return (
    <section className="workspace-editor" aria-label="Code editor">
      <div className="workspace-editor__tabs" role="tablist">
        <button
          type="button"
          className="workspace-editor__tab workspace-editor__tab--active"
          role="tab"
          aria-selected
        >
          <span className="workspace-editor__tab-icon workspace-editor__tab-icon--html" aria-hidden>
            ◆
          </span>
          index.html
        </button>
        <button type="button" className="workspace-editor__tab" role="tab" aria-selected={false}>
          <span className="workspace-editor__tab-icon workspace-editor__tab-icon--css" aria-hidden>
            #
          </span>
          style.css
        </button>
        <button type="button" className="workspace-editor__tab" role="tab" aria-selected={false}>
          <span className="workspace-editor__tab-icon workspace-editor__tab-icon--js" aria-hidden>
            JS
          </span>
          script.js
        </button>
      </div>
      <pre className="workspace-editor__body">
        {MOCK_LINES.map((line) => (
          <div key={line.n} className="workspace-editor__line">
            <span className="workspace-editor__ln">{line.n || ''}</span>
            <code
              className={
                line.kind === 'comment'
                  ? 'workspace-editor__code workspace-editor__code--comment'
                  : 'workspace-editor__code'
              }
            >
              {line.code}
            </code>
          </div>
        ))}
      </pre>
    </section>
  );
};

export default WorkspaceEditorPanel;
