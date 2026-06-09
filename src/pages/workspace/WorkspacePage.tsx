import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import './workspace.css';
import { WorkspaceExerciseSection } from './WorkspaceExerciseSection';
import { WorkspaceFooter } from './WorkspaceFooter';
import { Toast, type ToastType } from '../../components/Toast';
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
import { editorService } from '../../features/editor/services/editor.service';
import { validatePreviewFiles } from '../../features/editor/utils/previewDocument';
import '../../features/editor/components/editor-ui.css';

export const WorkspacePage: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const userId = 'user_01'; // Default dev user as specified in brainstorm_analysis

  const { data: exercise, isLoading, error } = useQuery<ExerciseDefinition>({
    queryKey: ['exercise', exerciseId, userId],
    queryFn: () => editorService.getExercise(exerciseId!, userId),
    enabled: !!exerciseId,
  });

  if (isLoading) {
    return (
      <div className="workspace-main-loading" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
        <div className="workspace-main-loading__spinner" style={{ width: '40px', height: '40px', border: '4px solid #cbd5e1', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '16px', color: '#475569', fontWeight: 500 }}>Loading exercise workspace...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="workspace-main-error" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif', padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h3 style={{ margin: '0 0 8px', color: '#0f172a', fontSize: '20px', fontWeight: 700 }}>Failed to load exercise</h3>
        <p style={{ margin: '0 0 24px', color: '#64748b', maxWidth: '400px' }}>Could not retrieve this exercise from the backend server. Please verify your connection.</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return <WorkspacePageContent key={exercise.id} exercise={exercise} />;
};

interface WorkspacePageContentProps {
  exercise: ExerciseDefinition;
}

interface WorkspaceToastState {
  id: number;
  type: ToastType;
  title: string;
  message: string;
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
        : 'Preview refreshed with your latest code.'
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
      const result = await editorService.submitWorkspace(
        exercise.id,
        'user_01',
        files,
        exercise.requirements
      );

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
    } catch (err: any) {
      setConsoleMessage(`Submission Error: ${err.message || 'Unknown backend error'}`);
      showToast({
        type: 'error',
        title: 'Submission Failed',
        message: 'Could not complete evaluation on backend. Verify your code and NestJS server.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [exercise.id, exercise.requirements, files, showToast]);

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
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
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
