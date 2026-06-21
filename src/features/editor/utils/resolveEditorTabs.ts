import type { EditorTab, ExerciseDefinition } from '../types/editor.types';

/** Tabs the learner should edit for this exercise (not boilerplate HTML shells). */
export function resolveEditorTabs(exercise: ExerciseDefinition): EditorTab[] {
  if (exercise.editorFiles?.length) {
    return exercise.editorFiles;
  }

  const { starterFiles, evaluationConfig, topicTags = [] } = exercise;
  const isReactExercise =
    evaluationConfig?.behavior === true ||
    topicTags.some((tag) => /react/i.test(tag));

  if (isReactExercise) {
    return ['jsx'];
  }

  const tabs: EditorTab[] = [];
  if (starterFiles.html.trim()) tabs.push('html');
  if (starterFiles.css.trim()) tabs.push('css');
  if (starterFiles.js.trim()) tabs.push('js');
  if ((starterFiles.jsx ?? '').trim()) tabs.push('jsx');

  if (tabs.length > 0) return tabs;

  if (evaluationConfig?.visual) {
    return ['jsx'];
  }

  return ['html', 'css', 'js'];
}

export function pickDefaultTab(tabs: EditorTab[]): EditorTab {
  return tabs[0] ?? 'html';
}
