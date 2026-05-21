import React from 'react';

export const WorkspaceFooter: React.FC = () => {
  return (
    <footer className="workspace-footer">
      <div className="workspace-footer__inner">
        <button type="button" className="workspace-footer__back">
          ← Back
        </button>
        <button type="button" className="workspace-footer__next">
          Next Practice →
        </button>
      </div>
    </footer>
  );
};

export default WorkspaceFooter;
