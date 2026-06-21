export type EditorTab = 'html' | 'css' | 'js' | 'jsx';

export interface WorkspaceFiles {
  html: string;
  css: string;
  js: string;
  jsx?: string;
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

export interface ExerciseRestriction {
  rule: string;
  message: string;
}

export interface ExerciseNavigation {
  type: string;
  id: string;
  slug?: string;
  milestoneId?: string;
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
  targetDesigns?: TargetDesign[];
  editorFiles?: EditorTab[];
  evaluationConfig?: EvaluationConfig;
  restrictions?: ExerciseRestriction[];
  requirements: ExerciseRequirement[];
  starterFiles: WorkspaceFiles;
  navigation?: {
    prev: ExerciseNavigation | null;
    next: ExerciseNavigation | null;
    currentMilestoneId?: string;
  };
}

export interface EvaluationCriterion {
  id: string;
  label: string;
  passed: boolean;
  message?: string;
}

export interface VisualEvaluationResult {
  deviceType: string;
  passed: boolean;
  matchPercentage: number;
  diffImageUrl?: string;
}

export interface LintEvaluationResult {
  html: Array<{ line: number; message: string }>;
  css: Array<{ line: number; message: string }>;
  js: Array<{ line: number; message: string }>;
  jsx: Array<{ line: number; message: string }>;
}

export interface EvaluationResult {
  passed: boolean;
  output: string;
  error?: string;
  executionTime: number;
  criteria?: EvaluationCriterion[];
  lint?: LintEvaluationResult;
  visual?: VisualEvaluationResult[];
  matchPercentage?: number;
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

export interface EvaluationConfig {
  lint: boolean;
  requirements: boolean;
  visual: boolean;
  behavior?: boolean;
}

export interface TargetDesign {
  deviceType: string;
  width: number;
  height: number;
  url?: string;
}

export interface BackendNavigation {
  type: string;
  id: string;
  slug?: string;
  milestoneId?: string;
}

export interface BackendExerciseResponse {
  id: string;
  module: string;
  title: string;
  level?: 'easy' | 'medium' | 'hard';
  description: string;
  target_design?: TargetDesign;
  target_designs?: TargetDesign[];
  evaluation_config?: EvaluationConfig;
  restrictions?: ExerciseRestriction[];
  requirements?: Array<{
    id: string;
    text: string;
  }>;
  html_content?: string;
  css_content?: string;
  js_content?: string;
  jsx_content?: string;
  tags?: string[];
  code_test?: {
    html?: string;
    css?: string;
    js?: string;
    jsx?: string;
  };
  navigation?: {
    prev: BackendNavigation | null;
    next: BackendNavigation | null;
    currentMilestoneId?: string;
  };
}

export interface BackendRequirementResult {
  requirementId: string;
  passed: boolean;
  message?: string;
}

export interface BackendVisualResult {
  deviceType: string;
  passed: boolean;
  matchPercentage: number;
  diffImageUrl?: string;
}

export interface BackendBehaviorResult {
  passed: boolean;
  totalTests: number;
  passedTests: number;
  errors?: string;
}

export interface BackendSubmitResponse {
  lint_errors?: {
    html_err?: Array<{ line: number; message: string }>;
    css_err?: Array<{ line: number; message: string }>;
    js_err?: Array<{ line: number; message: string }>;
    jsx_err?: Array<{ line: number; message: string }>;
  };
  requirementResult?: BackendRequirementResult[];
  evaluationResults?: BackendRequirementResult[];
  visual_results?: BackendVisualResult[];
  behavior_results?: BackendBehaviorResult | null;
  match_percentage?: number;
  isCompleted: boolean;
}
