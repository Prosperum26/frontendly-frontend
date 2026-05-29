import { useCallback, useEffect, useMemo, useState } from 'react';
import type { WorkspaceFiles } from '../types/editor.types';

export interface WorkspaceDraft {
  version: 1;
  exerciseId: string;
  files: WorkspaceFiles;
  updatedAt: number;
}

const DRAFT_VERSION = 1;
const SAVE_DELAY_MS = 1000;

function getDraftKey(exerciseId: string): string {
  return `frontendly:draft:${exerciseId}`;
}

function safeReadDraft(exerciseId: string): WorkspaceDraft | null {
  try {
    const rawDraft = localStorage.getItem(getDraftKey(exerciseId));
    if (!rawDraft) return null;

    const draft = JSON.parse(rawDraft) as Partial<WorkspaceDraft>;
    if (
      draft.version !== DRAFT_VERSION ||
      draft.exerciseId !== exerciseId ||
      typeof draft.files?.html !== 'string' ||
      typeof draft.files?.css !== 'string'
    ) {
      return null;
    }

    return draft as WorkspaceDraft;
  } catch {
    return null;
  }
}

function safeWriteDraft(exerciseId: string, files: WorkspaceFiles): void {
  try {
    const draft: WorkspaceDraft = {
      version: DRAFT_VERSION,
      exerciseId,
      files,
      updatedAt: Date.now(),
    };

    localStorage.setItem(getDraftKey(exerciseId), JSON.stringify(draft));
  } catch {
    // Ignore quota/private-mode failures; the editor should still work.
  }
}

function safeClearDraft(exerciseId: string): void {
  try {
    localStorage.removeItem(getDraftKey(exerciseId));
  } catch {
    // localStorage may be unavailable in restricted browser modes.
  }
}

export function useDraftPersistence(
  exerciseId: string,
  files: WorkspaceFiles,
  options: { enabled?: boolean; isDirty?: boolean } = {}
) {
  const { enabled = true, isDirty = false } = options;
  const [pendingDraft, setPendingDraft] = useState<WorkspaceDraft | null>(() =>
    safeReadDraft(exerciseId)
  );

  const hasPendingDraft = pendingDraft !== null;

  useEffect(() => {
    if (!enabled || !isDirty || hasPendingDraft) return;

    const saveTimer = window.setTimeout(() => {
      safeWriteDraft(exerciseId, files);
    }, SAVE_DELAY_MS);

    return () => {
      window.clearTimeout(saveTimer);
    };
  }, [enabled, exerciseId, files, hasPendingDraft, isDirty]);

  const clearDraft = useCallback(() => {
    safeClearDraft(exerciseId);
    setPendingDraft(null);
  }, [exerciseId]);

  const discardDraft = useCallback(() => {
    safeClearDraft(exerciseId);
    setPendingDraft(null);
  }, [exerciseId]);

  const restoreDraft = useCallback(() => {
    const draft = pendingDraft;
    setPendingDraft(null);
    return draft;
  }, [pendingDraft]);

  const draftUpdatedAt = useMemo(() => {
    if (!pendingDraft) return null;
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    }).format(pendingDraft.updatedAt);
  }, [pendingDraft]);

  return {
    pendingDraft,
    hasPendingDraft,
    draftUpdatedAt,
    clearDraft,
    discardDraft,
    restoreDraft,
  };
}

export default useDraftPersistence;
