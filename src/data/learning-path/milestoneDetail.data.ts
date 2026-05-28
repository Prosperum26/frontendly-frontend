import type {
  MilestoneDetail,
  LessonTheoryData,
} from "../../features/learning-path/types/learning-path.types";

export const MILESTONE_DETAILS_DATA: Record<string, MilestoneDetail> = {
  m1: {
    id: "m1",
    milestoneNumber: 1,
    title: "Front-end Fundamentals",
    description:
      "The core fundamentals every web developer needs. Master HTML structure, CSS selectors, Box Model, and Flexbox layouts.",
    totalLessons: 20,
    completedLessons: 20,
    progressPercent: 100,
    lessons: [
      {
        id: "dl6",
        title: "HTML Document Structure",
        description:
          "Semantic HTML5, document flow, and accessibility best practices.",
        type: "theory",
        status: "completed",
        duration: "20 min",
        tags: [],
        order: 1,
      },
      {
        id: "dl7",
        title: "CSS Selectors Mastery",
        description:
          "Specificity, combinators, pseudo-classes, and pseudo-elements.",
        type: "theory",
        status: "completed",
        duration: "25 min",
        tags: [],
        order: 2,
      },
      {
        id: "dl8",
        title: "The Box Model",
        description:
          "Content, padding, border, margin — and how box-sizing changes everything.",
        type: "liveClass",
        status: "completed",
        duration: "15 min",
        tags: ["box-sizing", "margin", "padding"],
        order: 3,
      },
      {
        id: "dl9",
        title: "Flexbox Layout System",
        description:
          "Master one-dimensional layouts with flex-direction, justify-content, and align-items.",
        type: "theory",
        status: "completed",
        duration: "30 min",
        tags: [],
        order: 4,
      },
      {
        id: "dl10",
        title: "Build a Landing Page",
        description:
          "Put everything together to create a responsive, semantic landing page.",
        type: "finalProject",
        status: "completed",
        duration: "",
        tags: [],
        order: 5,
      },
    ],
    proTip: {
      text: "Always start with semantic HTML before styling.",
      imageUrl: "src/assets/learning-path/sidebar/protip_bg.jpg",
    },
  },

  m2: {
    id: "m2",
    milestoneNumber: 2,
    title: "Building Complex Interfaces",
    description:
      "Go beyond basic CSS properties. In this path, you will learn how to control 2D space with Grid, handle depth with Positioning, and create smooth movements with CSS Animations.",
    totalLessons: 20,
    completedLessons: 9,
    progressPercent: 45,
    lessons: [
      {
        id: "dl1",
        title: "CSS Positioning Deep Dive",
        description:
          "Absolute, Relative, Fixed, and Sticky in production environments.",
        type: "theory",
        status: "completed",
        duration: "15 min",
        tags: [],
        order: 1,
      },
      {
        id: "dl2",
        title: "CSS Grid: The 2D Revolution",
        description:
          "Learn to use grid-template-areas, repeat(), and minmax() to build complex bento grids and dashboards without a framework.",
        type: "liveClass",
        status: "in_progress",
        duration: "20:00",
        tags: ["display: grid;", "grid-template-columns", "fr units"],
        codePreview: `.container {\n  display: grid;\n  grid-template-columns:\n    repeat(3, 1fr);\n  gap: 20px;\n}`,
        order: 2,
      },
      {
        id: "dl3",
        title: "Mastering CSS Animations",
        description:
          "Transitions, @keyframes, and cubic-bezier for high-end micro-interactions.",
        type: "theory",
        status: "locked",
        duration: "45 min",
        tags: [],
        order: 3,
      },
      {
        id: "dl4",
        title: "Responsive Design Strategy",
        description:
          "Beyond media queries: Container queries, Clamp(), and mobile-first logic.",
        type: "theory",
        status: "locked",
        duration: "30 min",
        tags: [],
        order: 4,
      },
      {
        id: "dl5",
        title: "Build a Portfolio with Glassmorphism",
        description:
          "Combine Grid, Animations, and Responsive design into a stunning showcase.",
        type: "finalProject",
        status: "locked",
        duration: "",
        tags: [],
        order: 5,
      },
    ],
    proTip: {
      text: "Master Grid before moving to Flexbox shortcuts.",
      imageUrl: "src/assets/learning-path/sidebar/protip_bg.jpg",
    },
  },

  m3: {
    id: "m3",
    milestoneNumber: 3,
    title: "Interactive DOM",
    description:
      "Bringing interfaces to life with JavaScript. Learn DOM access, events, manipulation, and error handling.",
    totalLessons: 20,
    completedLessons: 0,
    progressPercent: 0,
    lessons: [
      {
        id: "dl11",
        title: "JavaScript DOM Access",
        description:
          "querySelector, getElementById, and traversing the DOM tree efficiently.",
        type: "theory",
        status: "locked",
        duration: "20 min",
        tags: [],
        order: 1,
      },
      {
        id: "dl12",
        title: "DOM Events Deep Dive",
        description:
          "Event listeners, bubbling, capturing, and delegation patterns.",
        type: "liveClass",
        status: "locked",
        duration: "25 min",
        tags: [],
        order: 2,
      },
      {
        id: "dl13",
        title: "DOM Manipulation Techniques",
        description:
          "createElement, appendChild, innerHTML vs textContent, and template literals.",
        type: "theory",
        status: "locked",
        duration: "30 min",
        tags: [],
        order: 3,
      },
      {
        id: "dl14",
        title: "Error Handling in JS",
        description: "Try-catch, custom errors, and debugging DOM interactions.",
        type: "theory",
        status: "locked",
        duration: "20 min",
        tags: [],
        order: 4,
      },
      {
        id: "dl15",
        title: "Build an Interactive Todo App",
        description:
          "Create a full CRUD todo application with DOM manipulation.",
        type: "finalProject",
        status: "locked",
        duration: "",
        tags: [],
        order: 5,
      },
    ],
    proTip: {
      text: "Use event delegation for better performance.",
      imageUrl: "src/assets/learning-path/sidebar/protip_bg.jpg",
    },
  },
};

export const LESSON_THEORY_DATA: LessonTheoryData = {
  dl1: {
    lessonId: "dl1",
    title: "CSS Positioning Deep Dive",
    sections: [
      {
        heading: "Understanding Position Property",
        content:
          "The CSS `position` property specifies how an element is placed in the document. Five values are supported: static, relative, fixed, absolute, and sticky.",
      },
      {
        heading: "Static Positioning",
        content:
          "HTML elements are positioned static by default. Static positioned elements are not affected by the top, bottom, left, and right properties.",
      },
      {
        heading: "Relative Positioning",
        content:
          "An element with `position: relative` is positioned relative to its normal position. The element retains its space in normal flow.",
      },
      {
        heading: "Absolute Positioning",
        content:
          "An element with `position: absolute` is positioned relative to the nearest positioned ancestor. If none, it uses the document body.",
      },
      {
        heading: "Fixed Positioning",
        content:
          "An element with `position: fixed` stays in the same viewport position even when the page is scrolled.",
      },
      {
        heading: "Sticky Positioning",
        content:
          "An element with `position: sticky` toggles between relative and fixed based on the scroll position.",
      },
    ],
  },
  dl2: {
    lessonId: "dl2",
    title: "CSS Grid: The 2D Revolution",
    sections: [
      {
        heading: "Introduction to CSS Grid",
        content:
          "CSS Grid Layout is a 2-dimensional layout system. It can handle both columns and rows simultaneously, unlike Flexbox which is primarily 1-dimensional.",
      },
      {
        heading: "Grid Container Properties",
        content:
          "Use `display: grid` or `display: inline-grid` to define a grid container. Then use `grid-template-columns` and `grid-template-rows` to define tracks.",
      },
      {
        heading: "The fr Unit",
        content:
          "The `fr` unit represents a fraction of available space. `grid-template-columns: 1fr 2fr` creates two columns where the second is twice the first.",
      },
      {
        heading: "Grid Template Areas",
        content:
          "The `grid-template-areas` property lets you name grid regions and place items using `grid-area`, making complex layouts readable and maintainable.",
      },
      {
        heading: "repeat() and minmax()",
        content:
          "`repeat()` simplifies repeating track definitions. `minmax()` sets a size range for a track, enabling flexible, responsive grids without media queries.",
      },
    ],
  },
  dl3: {
    lessonId: "dl3",
    title: "Mastering CSS Animations",
    sections: [
      {
        heading: "CSS Transitions",
        content:
          "CSS transitions allow property changes to animate over a duration. Use `transition-property`, `transition-duration`, `transition-timing-function`, and `transition-delay`.",
      },
      {
        heading: "@keyframes Rule",
        content:
          "The `@keyframes` at-rule defines intermediate animation steps. You can use percentage breakpoints or the keywords `from` and `to`.",
      },
      {
        heading: "Cubic Bezier Timing Functions",
        content:
          "`cubic-bezier()` creates custom easing curves defined by four control points, giving you precise control over animation acceleration and deceleration.",
      },
    ],
  },
  dl6: {
    lessonId: "dl6",
    title: "HTML Document Structure",
    sections: [
      {
        heading: "HTML5 Semantic Elements",
        content:
          "Semantic elements like `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, and `<footer>` convey meaning about the content they contain.",
      },
      {
        heading: "Document Flow",
        content:
          "Normal document flow defines how block-level elements stack vertically and inline elements flow horizontally. Understanding this is fundamental to CSS layout.",
      },
    ],
  },
};
