import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Plus, X } from 'lucide-react';
import type { SandboxFile } from '../types/sandbox.types';
import { getDotInfo, getMonacoLanguage } from '../../editor/utils/editorHelpers';
import '../../editor/components/editor-ui.css';

export interface SandboxCodeEditorProps {
  activeFile: string;
  files: SandboxFile[];
  onFileChange: (fileName: string, content: string) => void;
  onActiveFileChange: (fileName: string) => void;
  onAddFile: () => void;
  onDeleteFile: (fileName: string) => void;
}

export const SandboxCodeEditor: React.FC<SandboxCodeEditorProps> = ({
  activeFile,
  files,
  onFileChange,
  onActiveFileChange,
  onAddFile,
  onDeleteFile,
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

  const activeFileData = files.find(f => f.name === activeFile);

  return (
    <div className="code-editor">
      <div 
        className="code-editor__tabs" 
        role="tablist" 
        aria-label="Source files"
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 #f1f5f9',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {files.map((file) => {
          const { dotClass, dot } = getDotInfo(file.name);
          return (
            <button
              key={file.name}
              type="button"
              role="tab"
              aria-selected={activeFile === file.name}
              className={
                activeFile === file.name ? 'code-editor__tab code-editor__tab--active' : 'code-editor__tab'
              }
              onClick={() => onActiveFileChange(file.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                minWidth: 'fit-content',
                position: 'relative',
              }}
            >
              <span className={`code-editor__tab-dot ${dotClass}`} aria-hidden>
                {dot}
              </span>
              {file.name}
              {files.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(file.name);
                  }}
                  className="code-editor__tab-delete"
                  aria-label={`Delete ${file.name}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: 'none',
                    background: 'transparent',
                    color: 'inherit',
                    opacity: '0.6',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.6';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </button>
          );
        })}
        <button
          type="button"
          onClick={onAddFile}
          className="code-editor__tab code-editor__tab--add"
          aria-label="Add new file"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '8px 12px',
            minWidth: 'fit-content',
            border: '1px dashed #cbd5e1',
            background: '#f8fafc',
            color: '#64748b',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f1f5f9';
            e.currentTarget.style.borderColor = '#94a3b8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f8fafc';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
        >
          <Plus className="w-3 h-3" />
          <span>Add File</span>
        </button>
      </div>
      <div className="code-editor__surface">
        <Editor
          height="100%"
          width="100%"
          language={getMonacoLanguage(activeFile)}
          theme="vs-dark"
          value={activeFileData?.content ?? ''}
          onChange={(value) => onFileChange(activeFile, value ?? '')}
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

export default SandboxCodeEditor;
