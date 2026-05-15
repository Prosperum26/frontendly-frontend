export interface EditorState {
  code: string;
  language: string;
  isDirty: boolean;
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
