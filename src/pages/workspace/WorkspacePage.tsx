import React from 'react';
import './workspace.css';
import { WorkspaceExerciseSection } from './WorkspaceExerciseSection';
import { WorkspaceEditorPanel } from './WorkspaceEditorPanel';
import { WorkspacePreviewPanel } from './WorkspacePreviewPanel';
import { WorkspaceFooter } from './WorkspaceFooter';

export const WorkspacePage: React.FC = () => {
  return (
    <>
      <div className="workspace-main">
        <WorkspaceExerciseSection />
        <section className="workspace-coding" aria-label="Coding workspace">
          <div className="workspace-coding__panels">
            <WorkspaceEditorPanel />
            <WorkspacePreviewPanel />
          </div>
        </section>
      </div>
      <WorkspaceFooter />
    </>
  );
};

export default WorkspacePage;
