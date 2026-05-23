import React, { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import './workspace.css';
import { WorkspaceExerciseSection } from './WorkspaceExerciseSection';
import { WorkspaceFooter } from './WorkspaceFooter';
import { Toolbar } from '../../features/editor/components/Toolbar';
import { WorkspacePanels } from '../../features/editor/components/WorkspacePanels';
import { useWorkspaceEditor } from '../../features/editor/hooks/useWorkspaceEditor';
import { getMockExercise } from '../../features/editor/mocks/exercises.mock';
import '../../features/editor/components/editor-ui.css';

export const WorkspacePage: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const exercise = useMemo(() => getMockExercise(exerciseId), [exerciseId]);

  const { files, activeTab, isDirty, setActiveTab, setFile, reset } = useWorkspaceEditor(
    exercise.starterFiles,
    exercise.id
  );

  const [consoleMessage, setConsoleMessage] = useState(
    'Run or submit your code to see results here.'
  );

  const handleRun = useCallback(() => {
    setConsoleMessage('Preview updated with your latest HTML and CSS.');
  }, []);

  const handleSubmit = useCallback(() => {
    setConsoleMessage('Submit will connect to the evaluation API in a later phase.');
  }, []);

  const handleReset = useCallback(() => {
    reset();
    setConsoleMessage('Editor reset to starter code.');
  }, [reset]);

  return (
    <>
      <div className="workspace-main">
        <WorkspaceExerciseSection exercise={exercise} />
        <section className="workspace-coding workspace-coding--editor" aria-label="Coding workspace">
          <Toolbar
            title={exercise.title}
            level={exercise.level}
            isDirty={isDirty}
            onReset={handleReset}
            onRun={handleRun}
            onSubmit={handleSubmit}
          />
          <WorkspacePanels
            files={files}
            activeTab={activeTab}
            consoleMessage={consoleMessage}
            onTabChange={setActiveTab}
            onFileChange={setFile}
          />
        </section>
      </div>
      <WorkspaceFooter />
    </>
  );
};

export default WorkspacePage;
