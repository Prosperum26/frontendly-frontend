import type {
  MilestoneDetail,
  LessonTheoryData,
} from "../../features/learning-path/types/learning-path.types";
export const DUMMY_MILESTONE_DETAILS: Record<string, MilestoneDetail> = {
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
        codePreview: `.container
  display grid
  grid-template-columns
    repeat 3 1fr
  gap 20px`,
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
export const DUMMY_THEORY_DATA: LessonTheoryData = {
  dl1: {
    lessonId: "dl1",
    title: "CSS Positioning Deep Dive",
    sections: [
      {
        heading: "Understanding Position Property",
        content:
          "The CSS `position` property specifies the type of positioning method used for an element. There are five different position values: `static`, `relative`, `fixed`, `absolute`, and `sticky`. Each value changes how the element is placed in the document flow and how it interacts with other elements.",
      },
      {
        heading: "Static Positioning",
        content:
          "HTML elements are positioned static by default. Static positioned elements are not affected by the top, bottom, left, and right properties. An element with `position: static;` is not positioned in any special way; it is always positioned according to the normal flow of the page.",
      },
      {
        heading: "Relative Positioning",
        content:
          "An element with `position: relative;` is positioned relative to its normal position. Setting the top, right, bottom, and left properties of a relatively-positioned element will cause it to be adjusted away from its normal position. Other content will not be adjusted to fit into any gap left by the element.",
      },
      {
        heading: "Absolute Positioning",
        content:
          "An element with `position: absolute;` is positioned relative to the nearest positioned ancestor (instead of positioned relative to the viewport, like fixed). However, if an absolute positioned element has no positioned ancestors, it uses the document body, and moves along with page scrolling.",
      },
      {
        heading: "Fixed Positioning",
        content:
          "An element with `position: fixed;` is positioned relative to the viewport, which means it always stays in the same place even if the page is scrolled. The top, right, bottom, and left properties are used to position the element. A fixed element does not leave a gap in the page where it would normally have been located.",
      },
      {
        heading: "Sticky Positioning",
        content:
          "An element with `position: sticky;` is positioned based on the user's scroll position. A sticky element toggles between `relative` and `fixed`, depending on the scroll position. It is positioned relative until a given offset position is met in the viewport — then it 'sticks' in place (like position: fixed).",
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
          "CSS Grid Layout is the most powerful layout system available in CSS. It is a 2-dimensional system, meaning it can handle both columns and rows, unlike Flexbox which is largely a 1-dimensional system. You work with Grid Layout by applying CSS rules both to a parent element (Grid Container) and to that element's children (Grid Items).",
      },
      {
        heading: "Grid Container Properties",
        content:
          "To define a grid container, use `display: grid` or `display: inline-grid`. The `grid-template-columns` and `grid-template-rows` properties define the columns and rows of the grid with a space-separated list of values. The values represent the track size, and the space between them represents the grid line.",
      },
      {
        heading: "The fr Unit",
        content:
          "The `fr` unit represents a fraction of the available space in the grid container. For example, `grid-template-columns: 1fr 2fr` will create two columns where the second column is twice the size of the first. This is incredibly powerful for creating responsive layouts without media queries.",
      },
      {
        heading: "Grid Template Areas",
        content:
          "The `grid-template-areas` property specifies named grid areas, establishing the cells in the grid and assigning them names. This provides a visualization of the structure of the grid, making the overall layout of the grid container easy to understand.",
      },
      {
        heading: "repeat() and minmax()",
        content:
          "The `repeat()` function represents a repeated fragment of the track list, allowing a large number of columns or rows that exhibit a recurring pattern to be written in a more compact form. The `minmax()` function defines a size range greater than or equal to min and less than or equal to max.",
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
          "CSS transitions provide a way to control animation speed when changing CSS properties. Instead of having property changes take effect immediately, you can cause the changes to take place over a period of time. The `transition` shorthand property combines `transition-property`, `transition-duration`, `transition-timing-function`, and `transition-delay`.",
      },
      {
        heading: "@keyframes Rule",
        content:
          "The `@keyframes` CSS at-rule controls the intermediate steps in a CSS animation sequence by defining styles for keyframes along the animation sequence. This gives more control over the intermediate steps of the animation sequence than transitions. You can specify keyframes using percentages or the keywords `from` and `to`.",
      },
      {
        heading: "Cubic Bezier Timing Functions",
        content:
          "The `cubic-bezier()` function defines a Cubic Bézier curve. A Cubic Bézier curve is defined by four points P0, P1, P2, and P3. This function can be used with the `transition-timing-function` and `animation-timing-function` properties to create custom easing effects for your animations.",
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
          "Semantic HTML elements clearly describe their meaning in a human- and machine-readable way. Elements such as `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, and `<footer>` all convey meaning about the content they contain.",
      },
      {
        heading: "Document Flow",
        content:
          "Normal document flow is the way that elements lay out on a page if you haven't changed their layout with CSS. Understanding normal flow is key to understanding how to move elements away from normal flow. Block-level elements stack vertically, while inline elements flow horizontally.",
      },
    ],
  },
};