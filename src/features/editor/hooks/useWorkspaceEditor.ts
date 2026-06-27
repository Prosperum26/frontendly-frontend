import { useCallback, useMemo, useState } from 'react';
import type { EditorTab, WorkspaceEditorState, EditorFile } from '../types/editor.types';

interface UseWorkspaceEditorOptions {
  defaultTab?: string; // filename
  visibleTabs?: string[]; // filenames
}

export function useWorkspaceEditor(
  initialFiles: EditorFile[],
  options: UseWorkspaceEditorOptions = {},
) {
  const { defaultTab = initialFiles[0]?.filename || 'App.jsx', visibleTabs } = options;
  const [files, setFiles] = useState<EditorFile[]>(initialFiles);
  const [activeTabInternal, setActiveTabState] = useState<string>(defaultTab);
  const [isDirty, setIsDirty] = useState(false);

  const activeTab = useMemo(() => {
    if (!visibleTabs?.length) return activeTabInternal;
    if (visibleTabs.includes(activeTabInternal)) return activeTabInternal;
    return visibleTabs[0];
  }, [activeTabInternal, visibleTabs]);

  const setActiveTab = useCallback((tab: string) => {
    setActiveTabState(tab);
  }, []);

  const setFile = useCallback((filename: string, value: string) => {
    setFiles((prev) => {
      const index = prev.findIndex(f => f.filename === filename);
      if (index === -1) return prev;
      if (prev[index].content === value) return prev;
      const newFiles = [...prev];
      newFiles[index] = { ...newFiles[index], content: value };
      return newFiles;
    };
    setIsDirty(true);
  }, []);

  const reset = useCallback(() => {
    setFiles(initialFiles);
    setActiveTabState(initialFiles[0]?.filename || 'App.jsx');
    setIsDirty(false);
  }, [initialFiles]);

  const replaceFiles = useCallback(
    (nextFiles: EditorFile[], dirty = true) => {
      setFiles(nextFiles);
      setActiveTabState(nextFiles[0]?.filename || 'App.jsx');
      setIsDirty(dirty);
    },
    [],
  );

  const state: WorkspaceEditorState = { files, activeTab, isDirty };

  return {
    state,
    files,
    activeTab,
    isDirty,
    setActiveTab,
    setFile,
    replaceFiles,
    reset,
  };
}

export default useWorkspaceEditor;
