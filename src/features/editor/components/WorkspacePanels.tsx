import React from 'react';
import { Group, Panel, useDefaultLayout } from 'react-resizable-panels';
import { CodeEditor } from './CodeEditor';
import { LivePreview } from './LivePreview';
import { ResultConsole } from './ResultConsole';
import { PanelResizeHandle } from './PanelResizeHandle';
import type { EditorTab, WorkspaceFiles } from '../types/editor.types';
import './editor-ui.css';

export interface WorkspacePanelsProps {
  files: WorkspaceFiles;
  activeTab: EditorTab;
  consoleMessage?: string;
  onTabChange: (tab: EditorTab) => void;
  onFileChange: (tab: EditorTab, value: string) => void;
}

export const WorkspacePanels: React.FC<WorkspacePanelsProps> = ({
  files,
  activeTab,
  consoleMessage,
  onTabChange,
  onFileChange,
}) => {
  const verticalLayout = useDefaultLayout({
    id: 'frontendly-workspace-vertical',
    panelIds: ['main', 'console'],
    storage: localStorage,
  });

  const horizontalLayout = useDefaultLayout({
    id: 'frontendly-workspace-horizontal',
    panelIds: ['editor', 'preview'],
    storage: localStorage,
  });

  return (
    <div className="editor-panels">
      <Group
        id="workspace-layout"
        orientation="vertical"
        className="editor-panels__root"
        defaultLayout={verticalLayout.defaultLayout ?? { main: 75, console: 25 }}
        onLayoutChanged={verticalLayout.onLayoutChanged}
      >
        <Panel id="main" defaultSize={75} minSize={35}>
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
                  onTabChange={onTabChange}
                  onChange={onFileChange}
                />
              </div>
            </Panel>
            <PanelResizeHandle direction="horizontal" id="split-editor-preview" />
            <Panel id="preview" defaultSize={50} minSize={20}>
              <div className="editor-panel editor-panel--preview">
                <LivePreview files={files} />
              </div>
            </Panel>
          </Group>
        </Panel>
        <PanelResizeHandle direction="vertical" id="split-code-console" />
        <Panel id="console" defaultSize={25} minSize={15} maxSize={45}>
          <div className="editor-panel editor-panel--console">
            <ResultConsole message={consoleMessage} />
          </div>
        </Panel>
      </Group>
    </div>
  );
};

export default WorkspacePanels;
