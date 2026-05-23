import { useCallback, useEffect, useState } from 'react';
import type { EditorTab, WorkspaceEditorState, WorkspaceFiles } from '../types/editor.types';

export function useWorkspaceEditor(initialFiles: WorkspaceFiles, exerciseId?: string) {
  const [files, setFiles] = useState<WorkspaceFiles>(initialFiles);
  const [activeTab, setActiveTab] = useState<EditorTab>('html');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setFiles(initialFiles);
    setActiveTab('html');
    setIsDirty(false);
  }, [exerciseId, initialFiles.html, initialFiles.css]);

  const setFile = useCallback((tab: EditorTab, value: string) => {
    setFiles((prev) => {
      if (prev[tab] === value) return prev;
      return { ...prev, [tab]: value };
    });
    setIsDirty(true);
  }, []);

  const reset = useCallback(() => {
    setFiles(initialFiles);
    setActiveTab('html');
    setIsDirty(false);
  }, [initialFiles]);

  const state: WorkspaceEditorState = { files, activeTab, isDirty };

  return {
    state,
    files,
    activeTab,
    isDirty,
    setActiveTab,
    setFile,
    reset,
  };
}

export default useWorkspaceEditor;
