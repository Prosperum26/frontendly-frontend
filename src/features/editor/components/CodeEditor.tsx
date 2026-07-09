import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import type { EditorFile } from '../types/editor.types';
import { getDotInfo, getMonacoLanguage } from '../utils/editorHelpers';
import './editor-ui.css';

export interface CodeEditorProps {
  activeTab: string;
  files: EditorFile[];
  visibleTabs?: string[];
  onTabChange: (tab: string) => void;
  onChange: (filename: string, value: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  activeTab,
  files,
  visibleTabs,
  onTabChange,
  onChange,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const tabs = visibleTabs?.length ? visibleTabs : files.map(f => f.filename);
  const activeFile = files.find(f => f.filename === activeTab);

  return (
    <div className="code-editor">
      {tabs.length > 0 && (
        <div className="code-editor__tabs" role="tablist" aria-label="Source files">
          {tabs.map((filename) => {
            const { dotClass, dot } = getDotInfo(filename);
            return (
              <button
                key={filename}
                type="button"
                role="tab"
                aria-selected={activeTab === filename}
                className={
                  activeTab === filename ? 'code-editor__tab code-editor__tab--active' : 'code-editor__tab'
                }
                onClick={() => onTabChange(filename)}
              >
                <span className={`code-editor__tab-dot ${dotClass}`} aria-hidden>
                  {dot}
                </span>
                {filename}
              </button>
            );
          })}
        </div>
      )}
      <div className="code-editor__surface">
        <Editor
          height="100%"
          width="100%"
          language={getMonacoLanguage(activeTab)}
          theme="vs-dark"
          value={activeFile?.content ?? ''}
          onChange={(value) => onChange(activeTab, value ?? '')}
          options={{
            minimap: { enabled: false },
            fontSize: isMobile ? 12 : 14,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            lineHeight: isMobile ? 20 : 28,
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: true,
            padding: { top: isMobile ? 8 : 16 },
            tabSize: 2,
            insertSpaces: true,
            // Mobile-friendly options
            contextmenu: true,
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
