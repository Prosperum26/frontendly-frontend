export type EditorTab = 'html' | 'css';

export interface WorkspaceFiles {
  html: string;
  css: string;
}

export interface WorkspaceEditorState {
  files: WorkspaceFiles;
  activeTab: EditorTab;
  isDirty: boolean;
}

/** @deprecated Use WorkspaceEditorState for the coding workspace */
export interface EditorState {
  code: string;
  language: string;
  isDirty: boolean;
}

export interface ExerciseRequirement {
  id: string;
  label: string;
  done?: boolean;
}

export interface ExerciseDefinition {
  id: string;
  practiceLabel: string;
  title: string;
  level: 'easy' | 'medium' | 'hard';
  description: string;
  requirements: ExerciseRequirement[];
  starterFiles: WorkspaceFiles;
}

export interface EvaluationResult {
  passed: boolean;
  output: string;
  error?: string;
  executionTime: number;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
}
