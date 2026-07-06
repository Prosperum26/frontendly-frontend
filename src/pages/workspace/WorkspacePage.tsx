import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import './workspace.css';
import { WorkspaceExerciseSection } from './WorkspaceExerciseSection';
import { WorkspaceFooter } from './WorkspaceFooter';
import { Toast, type ToastType } from '../../components/Toast';
import { Toolbar } from '../../features/editor/components/Toolbar';
import { WorkspacePanels } from '../../features/editor/components/WorkspacePanels';
import { EvaluationResultModal } from '../../features/editor/components/EvaluationResultModal';
import type {
  EditorTab,
  EvaluationCriterion,
  ExerciseDefinition,
  EditorFile,
  EvaluationResult as EditorEvaluationResult,
} from '../../features/editor/types/editor.types';
import { useDebounce } from '../../hooks/useDebounce';
import { useDraftPersistence } from '../../features/editor/hooks/useDraftPersistence';
import { useWorkspaceEditor } from '../../features/editor/hooks/useWorkspaceEditor';
import { editorService } from '../../features/editor/services/editor.service';
import { validatePreviewFiles } from '../../features/editor/utils/previewDocument';
import { pickDefaultTab, resolveEditorTabs } from '../../features/editor/utils/resolveEditorTabs';
import { useAuthStore } from '../../store/auth.store';
import { useGuestStore } from '../../store/guest.store';
import '../../features/editor/components/editor-ui.css';

// Import hook useRoadmap để lấy dữ liệu tiến trình học
import { useRoadmap } from '../../features/learning-path/hooks/useRoadmap';
import { DEFAULT_SKILL_ID } from '../../features/learning-path/utils/roadmapMappers';

export const WorkspacePage: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();

  const { data: exercise, isLoading, error } = useQuery<ExerciseDefinition>({
    queryKey: ['exercise', exerciseId],
    queryFn: () => editorService.getExercise(exerciseId!),
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
  const completeGuestLesson = useGuestStore((state) => state.completeLesson);

  const editorTabs = resolveEditorTabs(exercise);
  const defaultTab = pickDefaultTab(editorTabs);

  const queryParams = new URLSearchParams(window.location.search);
  const stageId = queryParams.get('stageId') || exercise.id.replace('exercise_', '');

  // Gọi API lấy thông tin lộ trình và tiến độ user
  const { data: roadmapData } = useRoadmap(DEFAULT_SKILL_ID);

  const { files, activeTab, isDirty, setActiveTab, setFile, replaceFiles, reset } =
    useWorkspaceEditor(exercise.starterFiles, { defaultTab, visibleTabs: editorTabs });

  const [consoleMessage, setConsoleMessage] = useState(
    'Run or submit your code to see results here.'
  );
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [criteria, setCriteria] = useState<EvaluationCriterion[] | undefined>();
  const [evaluationResult, setEvaluationResult] = useState<EditorEvaluationResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [toast, setToast] = useState<WorkspaceToastState | null>(null);
  const [editVersion, setEditVersion] = useState(0);
  const [previewRefreshKey, setPreviewRefreshKey] = useState(0);
  const lastSubmitAtRef = useRef(0);
  const [forcedPreview, setForcedPreview] = useState<{
    files: EditorFile[];
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

  useEffect(() => {
    // 1. Lấy mảng từ userProgress
    const unlockedStages = roadmapData?.userProgress?.unlockedStages;

    if (unlockedStages && unlockedStages.length > 0) {
      // 💡 LOG SỐ 1: Xem mảng thực tế có gì
      console.log("📦 [Debug] Mảng unlockedStages từ DB:", unlockedStages);
      
      // 💡 LOG SỐ 2: Xem ID trên URL đang là gì
      console.log("🔗 [Debug] stageId trên URL hiện tại đang là:", stageId);

      // Tìm đúng bài (stage) hiện tại đang mở
      const currentStageProgress = unlockedStages.find(
        (stage: any) => stage.stageId === stageId
      );

      // 💡 LOG SỐ 3: Kết quả sau khi tìm
      console.log("🎯 [Debug] Kết quả tìm kiếm currentStage:", currentStageProgress);

      // Nếu đã từng nộp bài thành công -> Bật sáng nút Next Lesson
      if (currentStageProgress?.hasSubmittedExercise) {
        setIsCompleted(true);
        console.log("✅ Đã bật isCompleted = true");
      }
    } else {
      console.log("⚠️ [Debug] unlockedStages vẫn đang trống hoặc undefined", unlockedStages);
    }
  }, [roadmapData, stageId]);

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
      const currentAuthState = useAuthStore.getState();
      const currentUser = currentAuthState.currentUser;
      const isUserAuthenticated = currentAuthState.isAuthenticated;
      
      let userId = 'guest';
      if (isUserAuthenticated) {
        if (currentUser?.id && currentUser.id !== '') {
          userId = currentUser.id;
        } 
        else if ((currentUser as any)?._id && (currentUser as any)._id !== '') {
          userId = (currentUser as any)._id;
        } 
        else {
          try {
            const rawData = localStorage.getItem('currentUser');
            if (rawData) {
              const parsedData = JSON.parse(rawData);
              userId = parsedData.id || parsedData._id || 'guest';
            }
          } catch (e) {
            console.error("Local Storage parsing error: ", e);
          }
        }
      }
      if (isUserAuthenticated && userId === 'guest') {
        showToast({
          type: 'error',
          title: 'Account Data Error',
          message: 'Cannot find the user ID for the authenticated account. Please log out and log in again!',
        });
        setIsSubmitting(false);
        return; 
      }

      const result = await editorService.submitWorkspace(
        userId,
        exercise.id,
        files,
        exercise.requirements
      );

      setCriteria(result.criteria);
      setEvaluationResult(result);
      setConsoleMessage(result.output);
      setIsModalOpen(true);
      
      if (result.passed && isCompleted === false) {
        setIsCompleted(true);
      };

      if (result.passed) {
        setIsPopupVisible(true);
        if (!isUserAuthenticated) {
          completeGuestLesson(stageId);
        }
      }
      
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
    } catch (err: unknown) {
      const error = err as { message?: string };
      setConsoleMessage(`Submission Error: ${error.message || 'Unknown backend error'}`);
      showToast({
        type: 'error',
        title: 'Submission Failed',
        message: 'Could not complete evaluation on backend. Verify your code and NestJS server.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    exercise.id, 
    exercise.requirements, 
    files, 
    showToast, 
    stageId, 
    completeGuestLesson
  ]);

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
            visibleTabs={editorTabs}
            isConsoleOpen={isConsoleOpen}
            previewRefreshKey={previewRefreshKey}
            consoleMessage={consoleMessage}
            onTabChange={setActiveTab}
            onFileChange={updateFile}
          />
        </section>
      </div>
      <WorkspaceFooter
        navigation={exercise.navigation}
        isCompleted={isCompleted}
      />
      {evaluationResult && (
        <EvaluationResultModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          evaluationResult={evaluationResult}
          exercise={exercise}
        />
      )}
      {isPopupVisible && (
        <div className="completion-popup" style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#10b981',
          color: '#fff',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <span style={{ fontSize: '24px' }}>🎉</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>Exercise Completed!</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Great work! You've passed all requirements.</div>
          </div>
          <button
            onClick={() => setIsPopupVisible(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px'
            }}
          >
            Dismiss
          </button>
          <style>{`
            @keyframes slideIn {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default WorkspacePage;