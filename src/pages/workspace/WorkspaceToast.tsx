import React from 'react';

export type WorkspaceToastType = 'success' | 'warning' | 'error';

export interface WorkspaceToastState {
  id: number;
  type: WorkspaceToastType;
  title: string;
  message: string;
}

export interface WorkspaceToastProps {
  toast: WorkspaceToastState;
  onClose: () => void;
}

const ICON_LABEL: Record<WorkspaceToastType, string> = {
  success: '✓',
  warning: '!',
  error: '!',
};

export const WorkspaceToast: React.FC<WorkspaceToastProps> = ({ toast, onClose }) => {
  return (
    <div className={`workspace-toast workspace-toast--${toast.type}`} role="status">
      <div className="workspace-toast__icon" aria-hidden>
        {ICON_LABEL[toast.type]}
      </div>
      <div className="workspace-toast__content">
        <strong>{toast.title}</strong>
        <span>{toast.message}</span>
      </div>
      <button
        type="button"
        className="workspace-toast__close"
        aria-label="Close notification"
        onClick={onClose}
      >
        x
      </button>
    </div>
  );
};

export default WorkspaceToast;
