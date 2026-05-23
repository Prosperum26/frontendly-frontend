import React, { useMemo } from 'react';
import type { WorkspaceFiles } from '../types/editor.types';
import { buildPreviewDocument } from '../utils/previewDocument';
import './editor-ui.css';

export interface LivePreviewProps {
  files: WorkspaceFiles;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ files }) => {
  const srcDoc = useMemo(() => buildPreviewDocument(files), [files]);

  return (
    <div className="live-preview">
      <div className="live-preview__header">
        <span className="live-preview__label">&lt;&gt; LIVE PREVIEW</span>
      </div>
      <div className="live-preview__frame-wrap">
        <iframe
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
