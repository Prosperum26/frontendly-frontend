import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './workspace.css';
import { WorkspaceExerciseSection } from './WorkspaceExerciseSection';
import { WorkspaceFooter } from './WorkspaceFooter';
import { WorkspaceToast, type WorkspaceToastState } from './WorkspaceToast';
import { Toolbar } from '../../features/editor/components/Toolbar';
import { WorkspacePanels } from '../../features/editor/components/WorkspacePanels';
import type {
  EditorTab,
  EvaluationCriterion,
  ExerciseDefinition,
  WorkspaceFiles,
} from '../../features/editor/types/editor.types';
import { useDebounce } from '../../hooks/useDebounce';
import { useDraftPersistence } from '../../features/editor/hooks/useDraftPersistence';
import { useWorkspaceEditor } from '../../features/editor/hooks/useWorkspaceEditor';
import { getMockExercise } from '../../features/editor/mocks/exercises.mock';
import { editorService } from '../../features/editor/services/editor.service';
import { validatePreviewFiles } from '../../features/editor/utils/previewDocument';
import '../../features/editor/components/editor-ui.css';

export const WorkspacePage: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const exercise = useMemo(() => getMockExercise(exerciseId), [exerciseId]);

  return <WorkspacePageContent key={exercise.id} exercise={exercise} />;
};

interface WorkspacePageContentProps {
  exercise: ExerciseDefinition;
}

const WorkspacePageContent: React.FC<WorkspacePageContentProps> = ({ exercise }) => {
  const { files, activeTab, isDirty, setActiveTab, setFile, replaceFiles, reset } =
    useWorkspaceEditor(exercise.starterFiles);

  const [consoleMessage, setConsoleMessage] = useState(
    'Run or submit your code to see results here.'
  );
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [criteria, setCriteria] = useState<EvaluationCriterion[] | undefined>();
  const [toast, setToast] = useState<WorkspaceToastState | null>(null);
  const [editVersion, setEditVersion] = useState(0);
  const [previewRefreshKey, setPreviewRefreshKey] = useState(0);
  const lastSubmitAtRef = useRef(0);
  const [forcedPreview, setForcedPreview] = useState<{
    files: WorkspaceFiles;
    editVersion: number;
  } | null>(null);
  const debouncedFiles = useDebounce(files, 350);
  const previewFiles =
    forcedPreview?.editVersion === editVersion ? forcedPreview.files : debouncedFiles;

  const {
    pendingDraft,
    hasPendingDraft,
    draftUpdatedAt,
    clearDraft,
    discardDraft,
    restoreDraft,
  } = useDraftPersistence(exercise.id, files, { isDirty });

  const updateFile = useCallback(
    (tab: EditorTab, value: string) => {
      setFile(tab, value);
      setEditVersion((version) => version + 1);
      setCriteria(undefined);
    },
    [setFile]
  );

  const showToast = useCallback((nextToast: Omit<WorkspaceToastState, 'id'>) => {
    setToast({ ...nextToast, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return;

    const closeTimer = window.setTimeout(() => {
      setToast(null);
    }, 4200);

    return () => {
      window.clearTimeout(closeTimer);
    };
  }, [toast]);

  const handleRun = useCallback(() => {
    const validationErrors = validatePreviewFiles(files);
    setForcedPreview({ files, editVersion });
    setPreviewRefreshKey((key) => key + 1);
    if (validationErrors.length > 0) {
      setIsConsoleOpen(true);
    }
    setConsoleMessage(
      validationErrors.length > 0
        ? validationErrors.join('\n')
        : 'Preview refreshed with your latest HTML and CSS.'
    );
    if (validationErrors.length > 0) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Your code cannot be empty. Please complete the task before running.',
      });
    }
  }, [editVersion, files, showToast]);

  const handleSubmit = useCallback(async () => {
    const now = Date.now();
    if (now - lastSubmitAtRef.current < 2500) {
      showToast({
        type: 'warning',
        title: 'Slow down!',
        message: 'You are submitting too fast. Please wait a moment before trying again.',
      });
      return;
    }

    const validationErrors = validatePreviewFiles(files);
    if (validationErrors.length > 0) {
      setIsConsoleOpen(true);
      setConsoleMessage(validationErrors.join('\n'));
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Your code cannot be empty. Please complete the task before submitting.',
      });
      return;
    }

    lastSubmitAtRef.current = now;
    setIsConsoleOpen(true);
    setIsSubmitting(true);
    setConsoleMessage('Submitting your solution...');

    try {
      const result = await editorService.submitWorkspace({
        exerciseId: exercise.id,
        files,
      });

      setCriteria(result.criteria);
      setConsoleMessage(result.output);
      showToast(
        result.passed
          ? {
              type: 'success',
              title: 'Submission passed!',
              message: 'Your solution meets all requirements.',
            }
          : {
              type: 'error',
              title: 'Validation Error',
              message: 'Some requirements are still failing. Review the checklist and try again.',
            }
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [exercise.id, files, showToast]);

  const handleReset = useCallback(() => {
    reset();
    clearDraft();
    setEditVersion((version) => version + 1);
    setForcedPreview(null);
    setCriteria(undefined);
    setPreviewRefreshKey((key) => key + 1);
    setConsoleMessage('Editor reset to starter code.');
  }, [clearDraft, reset]);

  const handleRestoreDraft = useCallback(() => {
    const draft = restoreDraft();
    if (!draft) return;

    replaceFiles(draft.files, true);
    setEditVersion((version) => version + 1);
    setForcedPreview({ files: draft.files, editVersion: editVersion + 1 });
    setCriteria(undefined);
    setPreviewRefreshKey((key) => key + 1);
    setConsoleMessage('Draft restored from this browser.');
  }, [editVersion, replaceFiles, restoreDraft]);

  const handleDiscardDraft = useCallback(() => {
    discardDraft();
    setConsoleMessage('Saved draft discarded. Starter code remains active.');
  }, [discardDraft]);

  return (
    <>
      {toast && <WorkspaceToast toast={toast} onClose={() => setToast(null)} />}
      <div className="workspace-main">
        <WorkspaceExerciseSection exercise={exercise} criteria={criteria} />
        <section className="workspace-coding workspace-coding--editor" aria-label="Coding workspace">
          {hasPendingDraft && pendingDraft && (
            <div className="editor-draft-banner" role="status">
              <div className="editor-draft-banner__copy">
                <strong>Saved draft found</strong>
                <span>
                  This browser has a draft from {draftUpdatedAt}. Restore it or keep the starter
                  code.
                </span>
              </div>
              <div className="editor-draft-banner__actions">
                <button
                  type="button"
                  className="editor-draft-banner__button editor-draft-banner__button--ghost"
                  onClick={handleDiscardDraft}
                >
                  Discard
                </button>
                <button
                  type="button"
                  className="editor-draft-banner__button"
                  onClick={handleRestoreDraft}
                >
                  Restore
                </button>
              </div>
            </div>
          )}
          <Toolbar
            title={exercise.title}
            level={exercise.level}
            isDirty={isDirty}
            isConsoleOpen={isConsoleOpen}
            onReset={handleReset}
            onRun={handleRun}
            onSubmit={handleSubmit}
            onToggleConsole={() => setIsConsoleOpen((open) => !open)}
            isSubmitting={isSubmitting}
          />
          <WorkspacePanels
            files={files}
            previewFiles={previewFiles}
            activeTab={activeTab}
            isConsoleOpen={isConsoleOpen}
            previewRefreshKey={previewRefreshKey}
            consoleMessage={consoleMessage}
            onTabChange={setActiveTab}
            onFileChange={updateFile}
          />
        </section>
      </div>
      <WorkspaceFooter />
    </>
  );
};

export default WorkspacePage;
