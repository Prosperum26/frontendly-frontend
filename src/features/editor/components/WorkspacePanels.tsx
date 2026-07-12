import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Group, Panel, useDefaultLayout } from 'react-resizable-panels';
import { CodeEditor } from './CodeEditor';
import { LivePreview } from './LivePreview';
import { ResultConsole } from './ResultConsole';
import { PanelResizeHandle } from './PanelResizeHandle';
import type { EditorFile } from '../types/editor.types';
import './editor-ui.css';

const TABLET_BREAKPOINT = 1024;

export interface WorkspacePanelsProps {
  files: EditorFile[];
  previewFiles: EditorFile[];
  activeTab: string;
  visibleTabs?: string[];
  isConsoleOpen?: boolean;
  previewRefreshKey?: number;
  consoleMessage?: string;
  onTabChange: (tab: string) => void;
  onFileChange: (filename: string, value: string) => void;
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
  const [isMobile, setIsMobile] = useState(false);
  const dragStateRef = useRef<{ startY: number; startHeight: number } | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= TABLET_BREAKPOINT);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      orientation={isMobile ? 'vertical' : 'horizontal'}
      className="editor-panels__main"
      defaultLayout={isMobile ? undefined : (horizontalLayout.defaultLayout ?? { editor: 50, preview: 50 })}
      onLayoutChanged={isMobile ? undefined : horizontalLayout.onLayoutChanged}
    >
      <Panel id="editor" defaultSize={isMobile ? 33 : 50} minSize={isMobile ? 20 : 20}>
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
      {isMobile ? (
        <PanelResizeHandle direction="vertical" id="split-editor-preview" />
      ) : (
        <PanelResizeHandle direction="horizontal" id="split-editor-preview" />
      )}
      <Panel id="preview" defaultSize={isMobile ? 33 : 50} minSize={isMobile ? 20 : 20}>
        <div className="editor-panel editor-panel--preview">
          <LivePreview files={previewFiles} refreshKey={previewRefreshKey} />
        </div>
      </Panel>
    </Group>
  );

  if (!isConsoleOpen) {
    return <div className="editor-panels">{mainRow}</div>;
  }

  // Mobile layout: all 3 panels in one vertical group
  if (isMobile) {
    return (
      <div className="editor-panels editor-panels--with-console">
        <Group
          id="workspace-mobile-full"
          orientation="vertical"
          className="editor-panels__main"
        >
          <Panel id="editor" defaultSize={33} minSize={20}>
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
          <PanelResizeHandle direction="vertical" id="split-editor-preview-mobile" />
          <Panel id="preview" defaultSize={33} minSize={20}>
            <div className="editor-panel editor-panel--preview">
              <LivePreview files={previewFiles} refreshKey={previewRefreshKey} />
            </div>
          </Panel>
          {isConsoleOpen && (
            <>
              <PanelResizeHandle direction="vertical" id="split-preview-console-mobile" />
              <Panel id="console" defaultSize={34} minSize={20}>
                <div className="editor-panel editor-panel--console">
                  <ResultConsole message={consoleMessage} />
                </div>
              </Panel>
            </>
          )}
          <PanelResizeHandle direction="vertical" id="split-bottom-spacer-mobile" />
          <Panel id="bottom-spacer" defaultSize={0} minSize={0} maxSize={50}>
            <div className="editor-panel editor-panel--spacer" />
          </Panel>
        </Group>
      </div>
    );
  }

  // Desktop layout: console at bottom
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
