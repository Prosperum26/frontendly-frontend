import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Group, Panel, useDefaultLayout } from 'react-resizable-panels';
import { SandboxCodeEditor } from './SandboxCodeEditor';
import { LivePreview } from '../../editor/components/LivePreview';
import { PanelResizeHandle } from '../../editor/components/PanelResizeHandle';
import type { SandboxFile } from '../types/sandbox.types';
import type { EditorLanguage } from '../../editor/types/editor.types';
import '../../editor/components/editor-ui.css';

export interface SandboxPanelsProps {
  files: SandboxFile[];
  activeFile: string;
  isConsoleOpen?: boolean;
  previewRefreshKey?: number;
  consoleMessage?: string;
  onFileChange: (fileName: string, content: string) => void;
  onActiveFileChange: (fileName: string) => void;
  onAddFile: () => void;
  onDeleteFile: (fileName: string) => void;
}

export const SandboxPanels: React.FC<SandboxPanelsProps> = ({
  files,
  activeFile,
  isConsoleOpen = false,
  previewRefreshKey = 0,
  consoleMessage,
  onFileChange,
  onActiveFileChange,
  onAddFile,
  onDeleteFile,
}) => {
  const [consoleHeight, setConsoleHeight] = useState(220);
  const dragStateRef = useRef<{ startY: number; startHeight: number } | null>(null);

  const horizontalLayout = useDefaultLayout({
    id: 'frontendly-sandbox-horizontal',
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

  // Convert SandboxFile[] to EditorFile[] format for LivePreview
  const previewFiles = files.map(file => ({
    filename: file.name,
    language: (file.language === 'javascript' ? 'js' : file.language === 'jsx' ? 'jsx' : file.language) as EditorLanguage,
    content: file.content,
  }));

  const mainRow = (
    <Group
      id="sandbox-main-row"
      orientation="horizontal"
      className="editor-panels__main"
      defaultLayout={horizontalLayout.defaultLayout ?? { editor: 50, preview: 50 }}
      onLayoutChanged={horizontalLayout.onLayoutChanged}
    >
      <Panel id="editor" defaultSize={50} minSize={20}>
        <div className="editor-panel editor-panel--editor">
          <SandboxCodeEditor
            activeFile={activeFile}
            files={files}
            onFileChange={onFileChange}
            onActiveFileChange={onActiveFileChange}
            onAddFile={onAddFile}
            onDeleteFile={onDeleteFile}
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

  return (
    <div className="editor-panels">
      <div className="editor-panels__main-wrap">{mainRow}</div>
      {isConsoleOpen && (
        <div
          className="editor-console-drawer"
          aria-label="Console output"
          style={{ height: `${consoleHeight}px` }}
        >
          <div className="editor-panel editor-panel--console">
            <div className="result-console">
              <pre className="result-console__output">{consoleMessage || 'No output'}</pre>
            </div>
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
      )}
    </div>
  );
};

export default SandboxPanels;
