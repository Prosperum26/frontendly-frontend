export { CodeEditor } from './components/CodeEditor';
export { LivePreview } from './components/LivePreview';
export { ProblemPane } from './components/ProblemPane';
export { ResultConsole } from './components/ResultConsole';
export { Toolbar } from './components/Toolbar';
export { WorkspacePanels } from './components/WorkspacePanels';
export { useEditorState } from './hooks/useEditorState';
export { useWorkspaceEditor } from './hooks/useWorkspaceEditor';
export { useEvaluation } from './hooks/useEvaluation';
export { editorService } from './services/editor.service';
export { buildPreviewDocument } from './utils/previewDocument';
export type {
  EditorState,
  EditorTab,
  EvaluationResult,
  ExerciseDefinition,
  ExerciseRequirement,
  WorkspaceEditorState,
  WorkspaceFiles,
} from './types/editor.types';
