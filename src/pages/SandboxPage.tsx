import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, RotateCcw, Trash2, Save } from 'lucide-react';
import { SandboxPanels } from '../features/sandbox/components/SandboxPanels';
import { SandboxStorageService } from '../features/sandbox/services/sandboxStorage.service';
import type { SandboxFile, Sandbox } from '../features/sandbox/types/sandbox.types';
import { DEFAULT_SANDBOX_FILES } from '../features/sandbox/types/sandbox.types';
import { useDebounce } from '../hooks/useDebounce';
import { Toast, type ToastType } from '../components/Toast';
import './workspace/workspace.css';

interface ToastState {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

export const SandboxPage: React.FC = () => {
  const { sandboxId } = useParams<{ sandboxId: string }>();
  const navigate = useNavigate();
  const [sandbox, setSandbox] = useState<Sandbox | null>(null);
  const [files, setFiles] = useState<SandboxFile[]>([]);
  const [activeFile, setActiveFile] = useState('index.html');
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [consoleMessage, setConsoleMessage] = useState('Run your code to see results here.');
  const [previewRefreshKey, setPreviewRefreshKey] = useState(0);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const debouncedFiles = useDebounce(files, 500);

  useEffect(() => {
    if (!sandboxId) {
      navigate('/sandbox');
      return;
    }

    const loadedSandbox = SandboxStorageService.getSandboxById(sandboxId);
    if (!loadedSandbox) {
      navigate('/sandbox');
      return;
    }

    setSandbox(loadedSandbox);
    setFiles(loadedSandbox.files);
    setActiveFile(loadedSandbox.files[0]?.name || 'index.html');
  }, [sandboxId, navigate]);

  // Auto-save debounced files
  useEffect(() => {
    if (!sandbox || !isSaving) return;

    const saveTimer = setTimeout(() => {
      SandboxStorageService.updateSandboxFiles(sandbox.id, debouncedFiles);
      setSandbox(prev => prev ? { ...prev, files: debouncedFiles, updatedAt: Date.now() } : null);
      setIsSaving(false);
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [debouncedFiles, sandbox, isSaving]);

  const showToast = useCallback((nextToast: Omit<ToastState, 'id'>) => {
    setToast({ ...nextToast, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return;

    const closeTimer = window.setTimeout(() => {
      setToast(null);
    }, 4000);

    return () => {
      window.clearTimeout(closeTimer);
    };
  }, [toast]);

  const handleFileChange = useCallback((fileName: string, content: string) => {
    setFiles(prev => prev.map(file => 
      file.name === fileName ? { ...file, content } : file
    ));
    setIsSaving(true);
  }, []);

  const handleActiveFileChange = useCallback((fileName: string) => {
    setActiveFile(fileName);
  }, []);

  const handleRun = useCallback(() => {
    setPreviewRefreshKey(key => key + 1);
    setConsoleMessage('Preview refreshed with your latest code.');
    setIsConsoleOpen(true);
  }, []);

  const handleReset = useCallback(() => {
    if (!sandbox) return;
    
    if (confirm('Reset all files to default code? This cannot be undone.')) {
      setFiles(DEFAULT_SANDBOX_FILES.map(file => ({ ...file })));
      setIsSaving(true);
      showToast({
        type: 'success',
        title: 'Reset Complete',
        message: 'All files have been reset to default code.',
      });
    }
  }, [sandbox, showToast]);

  const handleSave = useCallback(() => {
    if (!sandbox) return;
    
    SandboxStorageService.updateSandboxFiles(sandbox.id, files);
    setSandbox(prev => prev ? { ...prev, files, updatedAt: Date.now() } : null);
    setIsSaving(false);
    showToast({
      type: 'success',
      title: 'Saved',
      message: 'Your sandbox has been saved successfully.',
    });
  }, [sandbox, files, showToast]);

  const handleDelete = useCallback(() => {
    if (!sandbox) return;
    
    SandboxStorageService.deleteSandbox(sandbox.id);
    navigate('/sandbox');
  }, [sandbox, navigate]);

  const handleAddFile = useCallback(() => {
    const fileName = prompt('Enter file name (e.g., component.js or component.jsx):');
    if (!fileName) return;

    const extension = fileName.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, 'html' | 'css' | 'javascript' | 'jsx'> = {
      html: 'html',
      htm: 'html',
      css: 'css',
      js: 'javascript',
      javascript: 'javascript',
      jsx: 'jsx',
    };
    const language = languageMap[extension || ''] || 'javascript';

    if (files.some(f => f.name === fileName)) {
      showToast({
        type: 'error',
        title: 'File Exists',
        message: 'A file with this name already exists.',
      });
      return;
    }

    setFiles(prev => [...prev, { name: fileName, content: '', language }]);
    setActiveFile(fileName);
    setIsSaving(true);
  }, [files, showToast]);

  const handleDeleteFile = useCallback((fileName: string) => {
    if (files.length <= 1) {
      showToast({
        type: 'error',
        title: 'Cannot Delete',
        message: 'You must have at least one file in the sandbox.',
      });
      return;
    }

    if (confirm(`Delete ${fileName}? This action cannot be undone.`)) {
      const newFiles = files.filter(f => f.name !== fileName);
      setFiles(newFiles);
      if (activeFile === fileName) {
        setActiveFile(newFiles[0]?.name || 'index.html');
      }
      setIsSaving(true);
    }
  }, [files, activeFile, showToast]);


  if (!sandbox) {
    return (
      <div className="workspace-main-loading" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
        <div className="workspace-main-loading__spinner" style={{ width: '40px', height: '40px', border: '4px solid #cbd5e1', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '16px', color: '#475569', fontWeight: 500 }}>Loading sandbox...</p>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      <div className="workspace-main">
        <section className="workspace-coding workspace-coding--editor" aria-label="Sandbox coding workspace">
          <div className="editor-toolbar">
            <div className="editor-toolbar__left">
              <h1 className="editor-toolbar__title">{sandbox.name}</h1>
              {isSaving && <span className="editor-toolbar__status">Saving...</span>}
            </div>
            <div className="editor-toolbar__right" style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="editor-toolbar__button editor-toolbar__button--secondary"
                onClick={handleRun}
                title="Run code"
              >
                <Play className="w-4 h-4" />
                <span>Run</span>
              </button>
              <button
                type="button"
                className="editor-toolbar__button editor-toolbar__button--secondary"
                onClick={handleSave}
                title="Save sandbox"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                type="button"
                className="editor-toolbar__button editor-toolbar__button--secondary"
                onClick={handleReset}
                title="Reset to default"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                className="editor-toolbar__button editor-toolbar__button--danger"
                onClick={() => setShowDeleteConfirm(true)}
                title="Delete sandbox"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
          <SandboxPanels
            files={files}
            activeFile={activeFile}
            isConsoleOpen={isConsoleOpen}
            previewRefreshKey={previewRefreshKey}
            consoleMessage={consoleMessage}
            onFileChange={handleFileChange}
            onActiveFileChange={handleActiveFileChange}
            onAddFile={handleAddFile}
            onDeleteFile={handleDeleteFile}
          />
        </section>
      </div>
      {showDeleteConfirm && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className="modal-content" style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '90%',
          }}>
            <h2 style={{ margin: '0 0 12px', fontSize: '20px', fontWeight: 700 }}>Delete Sandbox?</h2>
            <p style={{ margin: '0 0 24px', color: '#64748b' }}>
              Are you sure you want to delete "{sandbox.name}"? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: '10px 20px',
                  background: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: '10px 20px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SandboxPage;
