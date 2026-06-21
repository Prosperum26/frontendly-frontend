import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Group, Panel, useDefaultLayout } from 'react-resizable-panels';
import { CodeEditor } from './CodeEditor';
import { LivePreview } from './LivePreview';
import { ResultConsole } from './ResultConsole';
import { PanelResizeHandle } from './PanelResizeHandle';
import type { EditorTab, WorkspaceFiles } from '../types/editor.types';
import './editor-ui.css';

export interface WorkspacePanelsProps {
  files: WorkspaceFiles;
  previewFiles: WorkspaceFiles;
  activeTab: EditorTab;
  visibleTabs?: EditorTab[];
  isConsoleOpen?: boolean;
  previewRefreshKey?: number;
  consoleMessage?: string;
  onTabChange: (tab: EditorTab) => void;
  onFileChange: (tab: EditorTab, value: string) => void;
}

export const WorkspacePanels: React.FC<WorkspacePanelsProps> = ({
  files,
  previewFiles,
  activeTab,
  visibleTabs,
  isConsoleOpen = false,
  previewRefreshKey = 0,
  consoleMessage,
  onTabChange,
  onFileChange,
}) => {
  const [consoleHeight, setConsoleHeight] = useState(220);
  const dragStateRef = useRef<{ startY: number; startHeight: number } | null>(null);

  const horizontalLayout = useDefaultLayout({
    id: 'frontendly-workspace-horizontal',
    panelIds: ['editor', 'preview'],
    storage: localStorage,
  });

  const stopConsoleResize = useCallback(() => {
    dragStateRef.current = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  const startConsoleResize = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    dragStateRef.current = {
      startY: event.clientY,
      startHeight: consoleHeight,
    };
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
    event.currentTarget.setPointerCapture(event.pointerId);
  }, [consoleHeight]);

  const updateConsoleResize = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragStateRef.current) return;

    const nextHeight = dragStateRef.current.startHeight + event.clientY - dragStateRef.current.startY;
    setConsoleHeight(Math.min(420, Math.max(160, nextHeight)));
  }, []);

  useEffect(() => stopConsoleResize, [stopConsoleResize]);

  const mainRow = (
    <Group
      id="workspace-main-row"
      orientation="horizontal"
      className="editor-panels__main"
      defaultLayout={horizontalLayout.defaultLayout ?? { editor: 50, preview: 50 }}
      onLayoutChanged={horizontalLayout.onLayoutChanged}
    >
      <Panel id="editor" defaultSize={50} minSize={20}>
        <div className="editor-panel editor-panel--editor">
          <CodeEditor
            activeTab={activeTab}
            files={files}
            visibleTabs={visibleTabs}
            onTabChange={onTabChange}
            onChange={onFileChange}
          />
        </div>
      </Panel>
      <PanelResizeHandle direction="horizontal" id="split-editor-preview" />
      <Panel id="preview" defaultSize={50} minSize={20}>
        <div className="editor-panel editor-panel--preview">
          <LivePreview files={previewFiles} refreshKey={previewRefreshKey} />
        </div>
      </Panel>
    </Group>
  );

  if (!isConsoleOpen) {
    return <div className="editor-panels">{mainRow}</div>;
  }

  return (
    <div className="editor-panels editor-panels--with-console">
      <div className="editor-panels__main-wrap">{mainRow}</div>
      <div
        className="editor-console-drawer"
        aria-label="Console output"
        style={{ height: `${consoleHeight}px` }}
      >
        <div className="editor-panel editor-panel--console">
          <ResultConsole message={consoleMessage} />
        </div>
        <button
          type="button"
          className="editor-console-drawer__resize"
          aria-label="Resize console output"
          onPointerDown={startConsoleResize}
          onPointerMove={updateConsoleResize}
          onPointerUp={stopConsoleResize}
          onPointerCancel={stopConsoleResize}
          style={{ top: `${consoleHeight - 12}px` }}
        >
          <span aria-hidden />
        </button>
      </div>
    </div>
  );
};

export default WorkspacePanels;
