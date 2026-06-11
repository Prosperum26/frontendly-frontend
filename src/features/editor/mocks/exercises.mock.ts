import type { ExerciseDefinition } from '../types/editor.types';

export const MOCK_EXERCISES: Record<string, ExerciseDefinition> = {
  'demo-grid-01': {
    id: 'demo-grid-01',
    practiceLabel: 'Practice 1',
    title: 'Building a Responsive Grid',
    level: 'medium',
    objective: 'Build a responsive bento layout with clear hierarchy.',
    estimatedTime: '20 min',
    topicTags: ['CSS Grid', 'Responsive', 'Layout'],
    description:
      'In this exercise, you will implement a modern bento-style grid layout using CSS Grid. Your goal is to create an asymmetric layout that maintains visual hierarchy while remaining fully fluid. Pay close attention to the aspect ratios and padding between elements.',
    requirements: [
      { id: 'grid-layout', label: 'Use CSS Grid with a 2-column asymmetric layout', done: false },
      { id: 'hero-span', label: 'Hero cell spans 2 rows on the left column', done: false },
      { id: '3', label: 'Maintain 16px gap between all grid items', done: false },
      { id: 'responsive', label: 'Layout remains fluid on viewports under 768px', done: false },
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
      js: '',
    },
  },
  'exercise_s1': {
    id: 'exercise_s1',
    practiceLabel: 'Module 1: Lesson 1',
    title: 'Create your first heading',
    level: 'easy',
    objective: 'Create an HTML page with an h1 heading',
    estimatedTime: '5 min',
    topicTags: ['HTML'],
    description: 'Add a heading tag to the page.',
    requirements: [
      { id: 'req-1', label: 'Page must have an h1 element', done: false },
    ],
    starterFiles: {
      html: `<h1>Hello World!</h1>`,
      css: '',
      js: '',
    },
  },
};

export const DEFAULT_EXERCISE_ID = 'exercise_s1';

export function getMockExercise(exerciseId: string | undefined): ExerciseDefinition {
  if (exerciseId && MOCK_EXERCISES[exerciseId]) {
    return MOCK_EXERCISES[exerciseId];
  }
  return MOCK_EXERCISES[DEFAULT_EXERCISE_ID];
}
