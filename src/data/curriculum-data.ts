// Curriculum data extracted from backend JSON files
export const curriculumData = {
  course: "DevCamp 2026 - React Fundamentals",
  totalMilestones: 3,
  totalLessons: 12,
  totalExercises: 12,
  totalTopics: 20, // entrance test questions
  estimatedHours: 40, // estimated learning time
  
  milestones: [
    {
      id: "m1",
      title: "Milestone 1: Introduction to React and JSX",
      lessons: 4,
      difficulty: "Beginner",
      topics: ["React Intro", "Rendering HTML", "JSX Basics", "JSX Expressions"],
      color: "#3b82f6",
      description: "Learn React fundamentals, JSX syntax, and component basics"
    },
    {
      id: "m2",
      title: "Milestone 2: Building React Interfaces",
      lessons: 4,
      difficulty: "Intermediate",
      topics: ["JSX Attributes", "CSS Styling", "CSS Modules", "Conditional Rendering"],
      color: "#8b5cf6",
      description: "Master styling, events, and conditional UI patterns"
    },
    {
      id: "m3",
      title: "Milestone 3: Component and State",
      lessons: 4,
      difficulty: "Advanced",
      topics: ["Components", "Props", "Destructuring", "useState Hook"],
      color: "#10b981",
      description: "Deep dive into components, props, and React state"
    }
  ],

  sampleLessons: [
    {
      id: "exercise_s1",
      title: "My First React Component",
      level: "easy",
      milestone: "Milestone 1",
      description: "Create a React component named Welcome with a heading and paragraph",
      tags: ["reactjs", "components", "jsx"]
    },
    {
      id: "exercise_s2",
      title: "Rendering HTML in React",
      level: "easy",
      milestone: "Milestone 1",
      description: "Use createRoot() to render a container into the root node",
      tags: ["reactjs", "createRoot"]
    },
    {
      id: "exercise_s5",
      title: "Interactive Profile Card",
      level: "medium",
      milestone: "Milestone 2",
      description: "Create a profile card with buttons and event handlers",
      tags: ["reactjs", "events", "interactivity"]
    },
    {
      id: "exercise_s7",
      title: "React CSS Modules",
      level: "medium",
      milestone: "Milestone 2",
      description: "Practice real CSS Modules with scoped styling",
      tags: ["reactjs", "css-modules", "styling"]
    },
    {
      id: "exercise_s8",
      title: "JSX Conditional Statements",
      level: "hard",
      milestone: "Milestone 2",
      description: "Use ternary operators for conditional rendering",
      tags: ["reactjs", "conditional-rendering", "ternary"]
    }
  ],

  competencies: [
    { name: "Foundation", percentage: 100, color: "#3b82f6" },
    { name: "Styling", percentage: 80, color: "#8b5cf6" },
    { name: "Components", percentage: 67, color: "#10b981" },
    { name: "State", percentage: 33, color: "#f59e0b" }
  ]
};

export const gamificationFeatures = [
  {
    icon: "XP",
    title: "XP System",
    description: "Earn experience points for completing lessons and challenges",
    color: "#3b82f6"
  },
  {
    icon: "Level",
    title: "Level Progression",
    description: "Level up as you advance through the curriculum",
    color: "#8b5cf6"
  },
  {
    icon: "Streak",
    title: "Daily Streaks",
    description: "Maintain consistency with daily learning streaks",
    color: "#f59e0b"
  },
  {
    icon: "Badge",
    title: "Achievements",
    description: "Unlock badges for completing milestones and challenges",
    color: "#10b981"
  },
  {
    icon: "Challenge",
    title: "Daily Challenges",
    description: "Take on daily coding challenges for bonus XP",
    color: "#ef4444"
  },
  {
    icon: "Progress",
    title: "Progress Tracking",
    description: "Visual progress bars and detailed learning analytics",
    color: "#06b6d4"
  },
  {
    icon: "Path",
    title: "Learning Paths",
    description: "Structured curriculum with clear milestones",
    color: "#ec4899"
  },
  {
    icon: "Playground",
    title: "Code Playground",
    description: "Interactive coding environment with instant feedback",
    color: "#6366f1"
  }
];

export const testimonials = [
  {
    name: "Sarah Chen",
    username: "@sarahcodes",
    level: 15,
    avatar: "SC",
    xp: 2500,
    review: "FrontEndly made learning React so much easier than tutorials. The hands-on exercises really helped me understand the concepts.",
    color: "#3b82f6"
  },
  {
    name: "Alex Rivera",
    username: "@alexdev",
    level: 22,
    avatar: "AR",
    xp: 4200,
    review: "The structured curriculum and instant feedback are game-changers. I went from beginner to job-ready in 3 months!",
    color: "#10b981"
  },
  {
    name: "Jordan Kim",
    username: "@jkim",
    level: 8,
    avatar: "JK",
    xp: 1200,
    review: "Love the gamification aspect! The XP system and badges keep me motivated to learn every day.",
    color: "#8b5cf6"
  }
];

export const whyLearnHere = [
  {
    title: "Structured Curriculum",
    description: "Carefully designed learning path from basics to advanced React concepts",
    icon: "BookOpen"
  },
  {
    title: "Interactive Coding",
    description: "Write code directly in the browser with live preview and instant feedback",
    icon: "Code2"
  },
  {
    title: "Instant Feedback",
    description: "Real-time validation with detailed error messages and hints",
    icon: "Zap"
  },
  {
    title: "Visual Progress",
    description: "Track your journey with XP, levels, badges, and detailed analytics",
    icon: "Trophy"
  },
  {
    title: "Practical Projects",
    description: "Build real projects while learning, not just theoretical exercises",
    icon: "FolderOpen"
  },
  {
    title: "React-Focused",
    description: "Specialized curriculum for modern React development",
    icon: "Cpu"
  },
  {
    title: "Modern Ecosystem",
    description: "Learn with latest React features and best practices",
    icon: "Sparkles"
  },
  {
    title: "Beginner Friendly",
    description: "Start with no prior experience, progress at your own pace",
    icon: "Heart"
  }
];
