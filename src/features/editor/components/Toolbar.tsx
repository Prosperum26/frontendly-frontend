import React from 'react';
import { Button } from '../../../components/Button';
import type { ExerciseDefinition } from '../types/editor.types';
import './editor-ui.css';

const LEVEL_LABELS: Record<ExerciseDefinition['level'], string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export interface ToolbarProps {
  title: string;
  level: ExerciseDefinition['level'];
  isDirty?: boolean;
  isConsoleOpen?: boolean;
  onReset?: () => void;
  onRun?: () => void;
  onSubmit?: () => void;
  onToggleConsole?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  title,
  level,
  isDirty = false,
  isConsoleOpen = false,
  onReset,
  onRun,
  onSubmit,
  onToggleConsole,
}) => {
  return (
    <div className="editor-toolbar">
      <div className="editor-toolbar__meta">
        <span className="editor-toolbar__level">{LEVEL_LABELS[level]}</span>
        <h2 className="editor-toolbar__title">{title}</h2>
        {isDirty && <span className="editor-toolbar__dirty">Unsaved changes</span>}
      </div>
      <div className="editor-toolbar__actions">
        <Button variant="outline" type="button" onClick={onReset}>
          Reset
        </Button>
        <Button variant="outline" type="button" onClick={onRun}>
          Run
        </Button>
        <Button
          variant="outline"
          type="button"
          className={isConsoleOpen ? 'editor-toolbar__console-toggle--active' : undefined}
          aria-pressed={isConsoleOpen}
          onClick={onToggleConsole}
        >
          Console
        </Button>
        <Button variant="primary" type="button" onClick={onSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
