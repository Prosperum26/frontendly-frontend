import type { ExerciseDefinition } from '../types/editor.types';

export const MOCK_EXERCISES: Record<string, ExerciseDefinition> = {
  'demo-grid-01': {
    id: 'demo-grid-01',
    practiceLabel: 'Practice 1',
    title: 'Building a Responsive Grid',
    level: 'medium',
    description:
      'In this exercise, you will implement a modern bento-style grid layout using CSS Grid. Your goal is to create an asymmetric layout that maintains visual hierarchy while remaining fully fluid. Pay close attention to the aspect ratios and padding between elements.',
    requirements: [
      { id: '1', label: 'Use CSS Grid with a 2-column asymmetric layout', done: true },
      { id: '2', label: 'Hero cell spans 2 rows on the left column', done: true },
      { id: '3', label: 'Maintain 16px gap between all grid items', done: false },
      { id: '4', label: 'Layout remains fluid on viewports under 768px', done: false },
    ],
    starterFiles: {
      html: `<div class="grid-container">
  <div class="hero-cell">
    <h2>Main Featured Content</h2>
  </div>
  <div class="stat-card">...</div>
  <div class="action-card">...</div>
  <div class="info-card">...</div>
</div>`,
      css: `/* TODO: Implement the grid layout */
.grid-container {
  display: block;
}
`,
    },
  },
};

export const DEFAULT_EXERCISE_ID = 'demo-grid-01';

export function getMockExercise(exerciseId: string | undefined): ExerciseDefinition {
  if (exerciseId && MOCK_EXERCISES[exerciseId]) {
    return MOCK_EXERCISES[exerciseId];
  }
  return MOCK_EXERCISES[DEFAULT_EXERCISE_ID];
}
