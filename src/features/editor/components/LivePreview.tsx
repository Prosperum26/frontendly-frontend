import React from 'react';

export const LivePreview: React.FC = () => {
  return (
    <div className="live-preview">
      <h3>Live Preview</h3>
      <iframe title="preview" />
    </div>
  );
};

export default LivePreview;
