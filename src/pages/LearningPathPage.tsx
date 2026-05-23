import React from "react";
import { MilestoneCard } from "../features/learning-path/components/MilestoneCard";
import type { Milestone } from "../features/learning-path/types/learning-path.types";

//dummy data theo mẫu figma 
const DUMMY_MILESTONES: Milestone[] = [
  {
    id: "m1",
    order: 1,
    title: "Frontend Mastery Foundations",
    description: "The core fundamentals every web developer needs.",
    completed: true,
    lessons: [
      {
        id: "l1",
        title: "Semantic HTML",
        description: "desc",
        type: "theory",
        completed: true,
        xpReward: 100,
      },
      {
        id: "l2",
        title: "CSS Selectors",
        description: "desc",
        type: "practice",
        completed: true,
        xpReward: 150,
      },
      {
        id: "l3",
        title: "The Box Model",
        description: "desc",
        type: "theory",
        completed: true,
        xpReward: 100,
      },
      {
        id: "l4",
        title: "Layout Flexbox",
        description: "desc",
        type: "practice",
        completed: true,
        xpReward: 200,
      },
    ],
  },
  {
    id: "m2",
    order: 2,
    title: "Modern UI Architecture",
    description: "Advanced layout and design system patterns.",
    completed: false,
    lessons: [
      {
        id: "l5",
        title: "Advanced CSS Grid",
        description: "desc",
        type: "practice",
        completed: true,
        xpReward: 250,
      },
      {
        id: "l6",
        title: "Relative Layouts",
        description: "desc",
        type: "theory",
        completed: false,
        xpReward: 100,
      },
      {
        id: "l7",
        title: "Interaction Motion",
        description: "desc",
        type: "practice",
        completed: false,
        xpReward: 200,
      },
      {
        id: "l8",
        title: "Responsive Design",
        description: "desc",
        type: "theory",
        completed: false,
        xpReward: 100,
      },
    ],
  },
  {
    id: "m3",
    order: 3,
    title: "Dynamic DOM Manipulation",
    description: "Bringing interfaces to life with JavaScript.",
    completed: false,
    lessons: [
      {
        id: "l9",
        title: "DOM Tree Access",
        description: "desc",
        type: "theory",
        completed: false,
        xpReward: 100,
      },
      {
        id: "l10",
        title: "Event Handling",
        description: "desc",
        type: "practice",
        completed: false,
        xpReward: 200,
      },
      {
        id: "l11",
        title: "Element Creation",
        description: "desc",
        type: "theory",
        completed: false,
        xpReward: 100,
      },
      {
        id: "l12",
        title: "Async Data Logic",
        description: "desc",
        type: "practice",
        completed: false,
        xpReward: 300,
      },
    ],
  },
];

export const LearningPathPage: React.FC = () => {
  return (
    <div className="flex w-full min-h-screen bg-[#f8fafc]">
      <div className="flex-1 p-8 lg:p-12">
        <header className="mb-12 max-w-4xl">
          <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] mb-3 uppercase tracking-[0.25em]">
            <img src="/learning-path/certificate_icon.svg"></img>
            CERTIFICATION PATH
          </div>
          <h1 className="text-4xl font-[#191B23] text-h mb-4 tracking-tight leading-tight">
            Frontend Learning Path
          </h1>
          <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-2xl">
            Master the art of building modern interfaces from core fundamentals
            to advanced DOM manipulation and performance debugging.
          </p>
        </header>

        <section className="max-w-5xl">
          {DUMMY_MILESTONES.map((m) => (
            <MilestoneCard key={m.id} milestone={m} />
          ))}
        </section>
      </div>
    </div>
  );
};

export default LearningPathPage;
