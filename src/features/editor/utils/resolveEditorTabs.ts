import type { ExerciseDefinition } from '../types/editor.types';

/** Tabs the learner should edit for this exercise (filenames). */
export function resolveEditorTabs(exercise: ExerciseDefinition): string[] {
  // Always use starterFiles as base to ensure all files are included
  const baseTabs = exercise.starterFiles.map(f => f.filename);
  
  // Add default files (html, css, js, jsx) if not already present
  const defaultFiles = ['index.html', 'index.css', 'index.js', 'App.jsx'];
  const allTabs = [...baseTabs];
  
  defaultFiles.forEach(defaultFile => {
    if (!allTabs.includes(defaultFile)) {
      allTabs.push(defaultFile);
    }
  });
  
  return allTabs;
}

export function pickDefaultTab(tabs: string[]): string {
  return tabs[0] ?? 'App.jsx';
}
