import React from 'react';
import Editor from '@monaco-editor/react';
import type { EditorTab, WorkspaceFiles } from '../types/editor.types';
import './editor-ui.css';

const TAB_CONFIG: { id: EditorTab; label: string; dotClass: string; dot: string }[] = [
  { id: 'html', label: 'index.html', dotClass: 'code-editor__tab-dot--html', dot: '◆' },
  { id: 'css', label: 'style.css', dotClass: 'code-editor__tab-dot--css', dot: '#' },
  { id: 'js', label: 'script.js', dotClass: 'code-editor__tab-dot--js', dot: '⚡' },
  { id: 'jsx', label: 'App.jsx', dotClass: 'code-editor__tab-dot--jsx', dot: '⚛' },
];

const MONACO_LANGUAGE: Record<EditorTab, string> = {
  html: 'html',
  css: 'css',
  js: 'javascript',
  jsx: 'javascript',
};

export interface CodeEditorProps {
  activeTab: EditorTab;
  files: WorkspaceFiles;
  visibleTabs?: EditorTab[];
  onTabChange: (tab: EditorTab) => void;
  onChange: (tab: EditorTab, value: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  activeTab,
  files,
  visibleTabs,
  onTabChange,
  onChange,
}) => {
  const tabs = visibleTabs?.length
    ? TAB_CONFIG.filter((tab) => visibleTabs.includes(tab.id))
    : TAB_CONFIG;

  return (
    <div className="code-editor">
      <div className="code-editor__tabs" role="tablist" aria-label="Source files">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={
              activeTab === tab.id ? 'code-editor__tab code-editor__tab--active' : 'code-editor__tab'
            }
            onClick={() => onTabChange(tab.id)}
          >
            <span className={`code-editor__tab-dot ${tab.dotClass}`} aria-hidden>
              {tab.dot}
            </span>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="code-editor__surface">
        <Editor
          height="100%"
          width="100%"
          language={MONACO_LANGUAGE[activeTab]}
          theme="vs-dark"
          value={files[activeTab]}
          onChange={(value) => onChange(activeTab, value ?? '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            lineHeight: 28,
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: true,
            padding: { top: 16 },
            tabSize: 2,
            insertSpaces: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
