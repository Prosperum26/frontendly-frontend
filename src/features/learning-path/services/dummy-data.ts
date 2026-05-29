import type {
  Milestone,
  Stage,
  RoadmapData,
  UserProgress,
  TheoryData,
  PracticesData,
  SubmitResultData,
} from '../types/learning-path.types';

// ============================================================
// Dummy Data matching API Contract V2.0 + Phase 2 extensions
// ============================================================

// --- Helper: convert Stage[] → Lesson[] for backward compat with MilestoneCard ---
function stagesToLessons(stages: Stage[]) {
  return stages.map((stage, index) => ({
    id: stage.id,
    title: stage.title,
    description: '',
    type: (index % 2 === 0 ? 'theory' : 'practice') as 'theory' | 'practice',
    completed: stage.isCompleted,
    xpReward: stage.earnedStars * 50,
  }));
}

// --- Helper: build a full Milestone with compat fields from raw API shape ---
function buildMilestone(
  raw: {
    id: string;
    title: string;
    icon: string;
    status: 'locked' | 'in_progress' | 'completed';
    stages: Stage[];
    progressPercentage: number;
  },
  order: number,
  description: string,
): Milestone {
  return {
    ...raw,
    order,
    description,
    completed: raw.status === 'completed',
    lessons: stagesToLessons(raw.stages),
  };
}

// --- Raw milestone data matching API 1 response shape ---
const RAW_MILESTONES: Array<{
  id: string;
  title: string;
  icon: string;
  status: 'locked' | 'in_progress' | 'completed';
  stages: Stage[];
  progressPercentage: number;
  description: string;
}> = [
  {
    id: 'm1',
    title: 'Frontend Mastery Foundations',
    icon: 'foundation',
    status: 'completed',
    progressPercentage: 100,
    description: 'The core fundamentals every web developer needs.',
    stages: [
      { id: 's1', title: '1. Semantic HTML', isCompleted: true, earnedStars: 3, isPracticeUnlocked: true, videoWatchPercentage: 100, stageProgressPercentage: 100 },
      { id: 's2', title: '2. CSS Selectors', isCompleted: true, earnedStars: 3, isPracticeUnlocked: true, videoWatchPercentage: 100, stageProgressPercentage: 100 },
      { id: 's3', title: '3. The Box Model', isCompleted: true, earnedStars: 3, isPracticeUnlocked: true, videoWatchPercentage: 100, stageProgressPercentage: 100 },
      { id: 's4', title: '4. Layout Flexbox', isCompleted: true, earnedStars: 3, isPracticeUnlocked: true, videoWatchPercentage: 100, stageProgressPercentage: 100 },
    ],
  },
  {
    id: 'm2',
    title: 'Modern UI Architecture',
    icon: 'architecture',
    status: 'in_progress',
    progressPercentage: 0,
    description: 'Advanced layout and design system patterns.',
    stages: [
      { id: 's5', title: '1. Advanced CSS Grid', isCompleted: false, earnedStars: 2, isPracticeUnlocked: true, videoWatchPercentage: 60, stageProgressPercentage: 67 },
      { id: 's6', title: '2. Relative Layouts', isCompleted: false, earnedStars: 0, isPracticeUnlocked: false, videoWatchPercentage: 0, stageProgressPercentage: 0 },
      { id: 's7', title: '3. Interaction Motion', isCompleted: false, earnedStars: 0, isPracticeUnlocked: false, videoWatchPercentage: 0, stageProgressPercentage: 0 },
      { id: 's8', title: '4. Responsive Design', isCompleted: false, earnedStars: 0, isPracticeUnlocked: false, videoWatchPercentage: 0, stageProgressPercentage: 0 },
    ],
  },
  {
    id: 'm3',
    title: 'Dynamic DOM Manipulation',
    icon: 'dom',
    status: 'locked',
    progressPercentage: 0,
    description: 'Bringing interfaces to life with JavaScript.',
    stages: [
      { id: 's9', title: '1. DOM Tree Access', isCompleted: false, earnedStars: 0, isPracticeUnlocked: false, videoWatchPercentage: 0, stageProgressPercentage: 0 },
      { id: 's10', title: '2. Event Handling', isCompleted: false, earnedStars: 0, isPracticeUnlocked: false, videoWatchPercentage: 0, stageProgressPercentage: 0 },
      { id: 's11', title: '3. Element Creation', isCompleted: false, earnedStars: 0, isPracticeUnlocked: false, videoWatchPercentage: 0, stageProgressPercentage: 0 },
      { id: 's12', title: '4. Async Data Logic', isCompleted: false, earnedStars: 0, isPracticeUnlocked: false, videoWatchPercentage: 0, stageProgressPercentage: 0 },
    ],
  },
];

// --- Exported dummy data ---

export const DUMMY_MILESTONES: Milestone[] = RAW_MILESTONES.map((raw, index) =>
  buildMilestone(raw, index + 1, raw.description),
);

export const DUMMY_USER_PROGRESS: UserProgress = {
  currentXp: 2450,
  streakDays: 12,
  badges: ['s1', 's2', 's3', 's4'],
  lastActiveStageId: 's5',
  lastActiveMilestoneId: 'm2',
};

export const DUMMY_ROADMAP: RoadmapData = {
  skillId: 'frontend',
  skillTitle: 'Frontend Learning Path',
  courseProgressPercentage: 33,
  userProgress: DUMMY_USER_PROGRESS,
  milestones: DUMMY_MILESTONES,
  pagination: {
    currentPage: 1,
    limit: 5,
    totalItems: 3,
    totalPages: 1,
  },
};

// --- API 2: Theory data per stage ---
export const DUMMY_THEORY: Record<string, TheoryData> = {
  s5: {
    stageId: 's5',
    title: 'Advanced CSS Grid',
    videoUrl: '',
    contentHtml: '<h1>Advanced CSS Grid</h1><p>CSS Grid Layout is a two-dimensional layout system for the web.</p><h2>Key Concepts</h2><ul><li>Grid Container & Grid Items</li><li>grid-template-columns / grid-template-rows</li><li>grid-area & named grid lines</li></ul>',
    proTips: 'Use grid-template-areas for complex layouts — it makes your CSS much more readable.',
    referenceLinks: [
      { title: 'MDN: CSS Grid Layout', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout', type: 'doc' },
      { title: 'CSS Grid Garden (Interactive)', url: 'https://cssgridgarden.com/', type: 'doc' },
    ],
  },
  s6: {
    stageId: 's6',
    title: 'Relative Layouts',
    videoUrl: '',
    contentHtml: '<h1>Relative Layouts</h1><p>Understanding position: relative, absolute, fixed and sticky is crucial for precise element placement.</p>',
    proTips: 'Always set position: relative on a parent container before using position: absolute on child elements.',
    referenceLinks: [
      { title: 'MDN: CSS Position', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/position', type: 'doc' },
    ],
  },
  s9: {
    stageId: 's9',
    title: 'DOM Tree Access',
    videoUrl: '',
    contentHtml: '<h1>DOM Selector</h1><p>The Document Object Model (DOM) is a programming interface for web documents.</p>',
    proTips: 'Use querySelectorAll instead of getElementsByClassName for more flexibility.',
    referenceLinks: [
      { title: 'MDN: Introduction to the DOM', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction', type: 'doc' },
    ],
  },
};

// --- API 3: Unlock practice state ---
export const DUMMY_UNLOCK_STATE: Record<string, boolean> = {
  s1: true, s2: true, s3: true, s4: true,
  s5: true,
  s6: false, s7: false, s8: false,
  s9: false, s10: false, s11: false, s12: false,
};

// --- API 4: Practice exercises per stage ---
export const DUMMY_PRACTICES: Record<string, PracticesData> = {
  s5: {
    stageId: 's5',
    exercises: [
      {
        id: 'ex_s5_1',
        level: 'easy',
        title: 'Create a simple grid',
        instruction: 'Use display: grid and grid-template-columns to create a 3-column layout.',
        boilerplateCode: {
          html: '<div class="grid-container">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n</div>',
          js: '// No JS needed for this exercise',
        },
      },
      {
        id: 'ex_s5_2',
        level: 'medium',
        title: 'Grid with named areas',
        instruction: 'Create a page layout using grid-template-areas with header, sidebar, main, and footer.',
        boilerplateCode: {
          html: '<div class="page">\n  <header>Header</header>\n  <nav>Sidebar</nav>\n  <main>Main</main>\n  <footer>Footer</footer>\n</div>',
          js: '// No JS needed for this exercise',
        },
      },
      {
        id: 'ex_s5_3',
        level: 'hard',
        title: 'Responsive grid gallery',
        instruction: 'Build a responsive image gallery using CSS Grid with auto-fill and minmax().',
        boilerplateCode: {
          html: '<div class="gallery">\n  <!-- Add gallery items -->\n</div>',
          js: '// Generate gallery items dynamically\nconst gallery = document.querySelector(".gallery");\n// Your code here',
        },
      },
    ],
  },
};

// --- API 5: Submit result stubs ---
export const DUMMY_SUBMIT_PASSED: SubmitResultData = {
  status: 'passed',
  feedback: 'Chính xác! Test case đã vượt qua.',
  xpEarned: 50,
  streakIncremented: true,
  badgeEarned: null,
  stageUpdates: {
    stageId: 's5',
    totalEarnedStars: 1,
    isStageCompleted: false,
  },
};

export const DUMMY_SUBMIT_FAILED: SubmitResultData = {
  status: 'failed',
  feedback: 'Lỗi: Output không khớp với expected. Vui lòng kiểm tra lại.',
  xpEarned: 0,
  streakIncremented: false,
  badgeEarned: null,
  stageUpdates: {
    stageId: 's5',
    totalEarnedStars: 0,
    isStageCompleted: false,
  },
};
