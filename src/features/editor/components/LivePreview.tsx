import React, { useCallback, useMemo } from 'react';
import type { WorkspaceFiles } from '../types/editor.types';
import { buildPreviewDocument } from '../utils/previewDocument';
import './editor-ui.css';

export interface LivePreviewProps {
  files: WorkspaceFiles;
  refreshKey?: number;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ files, refreshKey = 0 }) => {
  const srcDoc = useMemo(() => buildPreviewDocument(files), [files]);
  const openPreviewWindow = useCallback(() => {
    const previewBlob = new Blob([srcDoc], { type: 'text/html' });
    const previewUrl = URL.createObjectURL(previewBlob);
    window.open(previewUrl, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => URL.revokeObjectURL(previewUrl), 60000);
  }, [srcDoc]);

  return (
    <div className="live-preview">
      <div className="live-preview__header">
        <span className="live-preview__label">&lt;&gt; LIVE PREVIEW</span>
        <button
          type="button"
          className="live-preview__open"
          aria-label="Open live preview in a new tab"
          title="Open live preview in a new tab"
          onClick={openPreviewWindow}
        >
          <span aria-hidden />
        </button>
      </div>
      <div className="live-preview__frame-wrap">
        <iframe
          key={refreshKey}
          className="live-preview__frame"
          title="Live preview"
          srcDoc={srcDoc}
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
};

export default LivePreview;
