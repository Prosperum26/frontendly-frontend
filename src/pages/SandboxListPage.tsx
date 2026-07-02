import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Clock, FileCode } from 'lucide-react';
import { SandboxStorageService } from '../features/sandbox/services/sandboxStorage.service';
import type { Sandbox } from '../features/sandbox/types/sandbox.types';
import { Toast, type ToastType } from '../components/Toast';
import { ROUTES } from '../constants/routes';
import { useAuthStore } from '../store/auth.store';

interface ToastState {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

export const SandboxListPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [sandboxes, setSandboxes] = useState<Sandbox[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSandboxName, setNewSandboxName] = useState('');
  const [toast, setToast] = useState<ToastState | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const toastIdCounter = useRef(0);

  const loadSandboxes = () => {
    setSandboxes(SandboxStorageService.getAllSandboxes());
  };

  useEffect(() => {
    loadSandboxes();
  }, []);

  const showToast = (nextToast: Omit<ToastState, 'id'>) => {
    toastIdCounter.current += 1;
    setToast({ ...nextToast, id: toastIdCounter.current });
  };

  useEffect(() => {
    if (!toast) return;

    const closeTimer = window.setTimeout(() => {
      setToast(null);
    }, 4000);

    return () => {
      window.clearTimeout(closeTimer);
    };
  }, [toast]);

  const handleCreateSandbox = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    if (!newSandboxName.trim()) {
      showToast({
        type: 'error',
        title: 'Name Required',
        message: 'Please enter a name for your sandbox.',
      });
      return;
    }

    try {
      const newSandbox = SandboxStorageService.createSandbox(newSandboxName.trim());
      setSandboxes(SandboxStorageService.getAllSandboxes());
      setNewSandboxName('');
      setShowCreateModal(false);
      navigate(`/sandbox/${newSandbox.id}`);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create sandbox.',
      });
    }
  };

  const handleDeleteSandbox = (id: string) => {
    SandboxStorageService.deleteSandbox(id);
    setSandboxes(SandboxStorageService.getAllSandboxes());
    setShowDeleteConfirm(null);
    showToast({
      type: 'success',
      title: 'Deleted',
      message: 'Sandbox has been deleted.',
    });
  };

  const canCreateMore = SandboxStorageService.canCreateSandbox();
  const sandboxCount = SandboxStorageService.getSandboxCount();

  // Calculate time ago for all sandboxes once to avoid impure function in render
  const sandboxesWithTimeAgo = useMemo(() => {
    return sandboxes.map(sandbox => ({
      ...sandbox,
      timeAgo: (() => {
        const seconds = Math.floor((Date.now() - sandbox.updatedAt) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
      })()
    }));
  }, [sandboxes]);

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
      <div className="min-h-screen bg-surface flex flex-col">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-heading mb-2">Sandbox</h1>
              <p className="text-body">Experiment with code freely</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              disabled={!canCreateMore}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              New Sandbox
            </button>
          </div>

          <div className="mb-4 text-sm text-muted">
            {sandboxCount}/5 sandboxes used
          </div>

          {sandboxesWithTimeAgo.length === 0 ? (
            <div className="text-center py-16 bg-main-bg rounded-2xl border border-border border-dashed">
              <FileCode className="w-16 h-16 text-muted mx-auto mb-4" />
              <h3 className="text-xl font-bold text-heading mb-2">No sandboxes yet</h3>
              <p className="text-muted mb-6">Create your first sandbox to start experimenting with code.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-hover transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Sandbox
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sandboxesWithTimeAgo.map((sandbox) => (
                <div
                  key={sandbox.id}
                  className="bg-main-bg rounded-2xl border border-border p-6 hover:border-primary/50 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/sandbox/${sandbox.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-heading text-lg mb-1 group-hover:text-primary transition-colors">
                        {sandbox.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <Clock className="w-3 h-3" />
                        <span>Edited {sandbox.timeAgo}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(sandbox.id);
                      }}
                      className="p-2 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete sandbox"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {sandbox.files.slice(0, 3).map((file) => (
                      <span
                        key={file.name}
                        className="text-xs bg-surface-raised border border-border px-2 py-1 rounded"
                      >
                        {file.name}
                      </span>
                    ))}
                    {sandbox.files.length > 3 && (
                      <span className="text-xs bg-surface-raised border border-border px-2 py-1 rounded text-muted">
                        +{sandbox.files.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-main-bg dark:bg-surface rounded-2xl p-6 w-full max-w-md border border-border">
            <h2 className="text-xl font-bold text-heading mb-4">Create New Sandbox</h2>
            <input
              type="text"
              value={newSandboxName}
              onChange={(e) => setNewSandboxName(e.target.value)}
              placeholder="Enter sandbox name..."
              className="w-full px-4 py-2.5 border border-border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-surface dark:bg-surface-raised text-heading"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateSandbox();
                if (e.key === 'Escape') setShowCreateModal(false);
              }}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2.5 border border-border rounded-lg font-semibold text-heading hover:bg-surface-raised transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSandbox}
                className="px-4 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-main-bg dark:bg-surface rounded-2xl p-6 w-full max-w-md border border-border">
            <h2 className="text-xl font-bold text-heading mb-2">Delete Sandbox?</h2>
            <p className="text-muted mb-6">
              Are you sure you want to delete this sandbox? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2.5 border border-border rounded-lg font-semibold text-heading hover:bg-surface-raised transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSandbox(showDeleteConfirm)}
                className="px-4 py-2.5 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
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

export default SandboxListPage;
