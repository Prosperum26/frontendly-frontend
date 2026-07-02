import type { ExerciseDefinition } from '../types/editor.types';

/** Tabs the learner should edit for this exercise (filenames). */
export function resolveEditorTabs(exercise: ExerciseDefinition): string[] {
  if (exercise.editorFiles?.length) {
    return exercise.editorFiles;
  }

  // Fall back to filenames from starterFiles
  return exercise.starterFiles.map(f => f.filename);
}

export function pickDefaultTab(tabs: string[]): string {
  return tabs[0] ?? 'App.jsx';
}
