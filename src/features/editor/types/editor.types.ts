export type EditorLanguage = 'html' | 'css' | 'js' | 'jsx';

export interface EditorFile {
  filename: string;
  language: EditorLanguage;
  content: string;
}

export type EditorTab = EditorLanguage | string; // Can be filename or language

export interface WorkspaceFiles {
  files: EditorFile[];
}

export interface WorkspaceEditorState {
  files: EditorFile[];
  activeTab: string; // filename
  isDirty: boolean;
}

/** @deprecated Use WorkspaceEditorState for the coding workspace */
export interface EditorState {
  code: string;
  language: string;
  isDirty: boolean;
}

// --- Frontend-only types ---

export interface ExerciseRequirement {
  id: string;
  label: string;
  done?: boolean;
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
  estimatedTime?: string;
  topicTags?: string[];
  targetImageUrl?: string;
  targetDesigns?: TargetDesign[];
  editorFiles?: string[]; // filenames
  evaluationConfig?: EvaluationConfig;
  requirements: ExerciseRequirement[];
  starterFiles: EditorFile[];
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
  level_of_complete: string;
  diffImageUrl: string | null;
}

export interface LintEvaluationResult {
  html_err?: { line: number; message: string }[];
  css_err?: { line: number; message: string }[];
  js_err?: { line: number; message: string }[];
  jsx_err?: { line: number; message: string }[];
}

export interface EvaluationResult {
  passed: boolean;
  output: string;
  executionTime: number;
  criteria?: EvaluationCriterion[];
  lint?: LintEvaluationResult;
  visual?: VisualEvaluationResult[];
  matchPercentage?: number;
}

export interface EvaluationConfig {
  lint: boolean;
  requirements: boolean;
  visual: boolean;
  behavior: boolean;
}

export interface TargetDesign {
  deviceType: string;
  width: number;
  height: number;
}

// --- Backend-matching types ---

export interface BackendExerciseRequirement {
  id: string;
  text: string;
  selector?: string;
  type?: 'exist' | 'count' | 'content' | 'attribute' | 'hook' | 'prop' | '';
  type_check?: 'behavior' | 'others';
  expectedValue?: string;
}

export interface BackendRestrictionDetail {
  rule: string;
  message: string;
}

export interface BackendTargetDesign {
  deviceType: string;
  width: number;
  height: number;
}

export interface BackendEvaluationConfig {
  lint: boolean;
  requirements: boolean;
  visual: boolean;
  behavior: boolean;
}

export interface BackendCodeTest {
  html: string;
  css: string;
  js: string;
  jsx: string;
  files?: EditorFile[];
}

export interface BackendNavigation {
  type: string;
  id: string;
  slug?: string;
}

export interface BackendExerciseResponse {
  id: string;
  module: string;
  title: string;
  level: 'easy' | 'medium' | 'hard';
  description: string;
  evaluation_config: BackendEvaluationConfig;
  restrictions: BackendRestrictionDetail[];
  tags: string[];
  html_content?: string; // Deprecated
  css_content?: string; // Deprecated
  js_content?: string; // Deprecated
  jsx_content?: string; // Deprecated
  starter_files: EditorFile[];
  target_design: BackendTargetDesign;
  target_url: string;
  code_test: (BackendCodeTest & { files?: EditorFile[] }) | null;
  test_script: string;
  requirements: BackendExerciseRequirement[];
  navigation: {
    prev: BackendNavigation | null;
    next: BackendNavigation | null;
  } | null;
  created_at: Date;
  updated_at: Date;
}

export interface BackendRequirementResult {
  requirementId: string;
  passed: boolean;
}

export interface BackendVisualResult {
  deviceType: string;
  passed: boolean;
  matchPercentage: number;
  level_of_complete: string;
  diffImageUrl: string | null;
}

export interface BackendBehaviorResult {
  passed: boolean;
  totalTests: number;
  passedTests: number;
  errors: string;
}

export interface BackendSubmitResponse {
  isCompleted: boolean;
  match_percentage: number;
  lint_errors: LintEvaluationResult;
  requirementResult: BackendRequirementResult[];
  visual_results?: BackendVisualResult[];
  behavior_results?: BackendBehaviorResult | null;
}
