import { useCallback, useMemo, useState } from 'react';
import type { EditorTab, WorkspaceEditorState, WorkspaceFiles } from '../types/editor.types';

interface UseWorkspaceEditorOptions {
  defaultTab?: EditorTab;
  visibleTabs?: EditorTab[];
}

export function useWorkspaceEditor(
  initialFiles: WorkspaceFiles,
  options: UseWorkspaceEditorOptions = {},
) {
  const { defaultTab = 'html', visibleTabs } = options;
  const [files, setFiles] = useState<WorkspaceFiles>(initialFiles);
  const [activeTabInternal, setActiveTabState] = useState<EditorTab>(defaultTab);
  const [isDirty, setIsDirty] = useState(false);

  const activeTab = useMemo(() => {
    if (!visibleTabs?.length) return activeTabInternal;
    if (visibleTabs.includes(activeTabInternal)) return activeTabInternal;
    return visibleTabs[0];
  }, [activeTabInternal, visibleTabs]);

  const setActiveTab = useCallback((tab: EditorTab) => {
    setActiveTabState(tab);
  }, []);

  const setFile = useCallback((tab: EditorTab, value: string) => {
    setFiles((prev) => {
      if (prev[tab] === value) return prev;
      return { ...prev, [tab]: value };
    });
    setIsDirty(true);
  }, []);

  const reset = useCallback(() => {
    setFiles(initialFiles);
    setActiveTabState(defaultTab);
    setIsDirty(false);
  }, [defaultTab, initialFiles]);

  const replaceFiles = useCallback(
    (nextFiles: WorkspaceFiles, dirty = true) => {
      setFiles(nextFiles);
      setActiveTabState(defaultTab);
      setIsDirty(dirty);
    },
    [defaultTab],
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
