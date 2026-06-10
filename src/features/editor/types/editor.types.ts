export type EditorTab = 'html' | 'css' | 'js';

export interface WorkspaceFiles {
  html: string;
  css: string;
  js: string;
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
  objective?: string;
  estimatedTime?: string;
  topicTags?: string[];
  targetImageUrl?: string;
  requirements: ExerciseRequirement[];
  starterFiles: WorkspaceFiles;
}

export interface EvaluationCriterion {
  id: string;
  label: string;
  passed: boolean;
  message?: string;
}

export interface EvaluationResult {
  passed: boolean;
  output: string;
  error?: string;
  executionTime: number;
  criteria?: EvaluationCriterion[];
}

export interface WorkspaceSubmitRequest {
  exerciseId: string;
  files: WorkspaceFiles;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
}

export interface BackendExerciseResponse {
  id: string;
  module: string;
  title: string;
  level?: 'easy' | 'medium' | 'hard';
  description: string;
  target_design_url?: string;
  requirements?: Array<{
    id: string;
    text: string;
  }>;
  html_content?: string;
  css_content?: string;
  js_content?: string;
}

export interface BackendRequirementResult {
  requirementId: string;
  passed: boolean;
  message?: string;
}

export interface BackendSubmitResponse {
  lint_errors?: {
    html_err?: Array<{ line: number; message: string }>;
    css_err?: Array<{ line: number; message: string }>;
    js_err?: Array<{ line: number; message: string }>;
  };
  requirementResult?: BackendRequirementResult[];
  evaluationResults?: BackendRequirementResult[];
  match_percentage?: number;
  isCompleted: boolean;
}
