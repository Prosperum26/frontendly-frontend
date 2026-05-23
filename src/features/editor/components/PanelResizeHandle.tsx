import React from 'react';
import { Separator } from 'react-resizable-panels';

export interface PanelResizeHandleProps {
  /** Direction of the resize drag (horizontal = between left/right panels) */
  direction: 'horizontal' | 'vertical';
  id?: string;
}

export const PanelResizeHandle: React.FC<PanelResizeHandleProps> = ({ direction, id }) => {
  return (
    <Separator
      id={id}
      className={`editor-resize-handle editor-resize-handle--${direction}`}
      aria-label={direction === 'horizontal' ? 'Resize editor and preview' : 'Resize code and console'}
    />
  );
};

export default PanelResizeHandle;
