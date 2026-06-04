import { create } from "zustand";
import type {
  Milestone,
  MilestoneDetail,
  UserProgress,
} from "../types/learning-path.types";
import { milestoneToDetail } from "../utils/roadmapMappers";

interface RoadmapState {
  skillId: string;
  skillTitle: string;
  milestones: Milestone[];
  userProgress: UserProgress | null;
  setRoadmap: (payload: {
    skillId: string;
    skillTitle: string;
    milestones: Milestone[];
    userProgress?: UserProgress | null;
  }) => void;
  getMilestoneById: (id: string) => Milestone | undefined;
  getMilestoneDetailById: (id: string) => MilestoneDetail | undefined;
  getNextLessonId: (
    milestoneId: string,
    currentLessonId: string,
  ) => { milestoneId: string; lessonId: string } | null;
}

export const useRoadmapStore = create<RoadmapState>((set, get) => ({
  skillId: "react",
  skillTitle: "",
  milestones: [],
  userProgress: null,

  setRoadmap: ({ skillId, skillTitle, milestones, userProgress }) =>
    set({
      skillId,
      skillTitle,
      milestones,
      userProgress: userProgress ?? null,
    }),

  getMilestoneById: (id) => get().milestones.find((m) => m.id === id),

  getMilestoneDetailById: (id) => {
    const milestone = get().getMilestoneById(id);
    return milestone ? milestoneToDetail(milestone) : undefined;
  },

  getNextLessonId: (milestoneId, currentLessonId) => {
    const milestone = get().getMilestoneById(milestoneId);
    if (!milestone) return null;

    const currentIndex = milestone.lessons.findIndex(
      (l) => l.id === currentLessonId,
    );
    if (currentIndex >= 0 && currentIndex < milestone.lessons.length - 1) {
      return {
        milestoneId,
        lessonId: milestone.lessons[currentIndex + 1].id,
      };
    }

    const milestoneIndex = get().milestones.findIndex(
      (m) => m.id === milestoneId,
    );
    const nextMilestone = get().milestones[milestoneIndex + 1];
    if (
      nextMilestone &&
      nextMilestone.status !== "locked" &&
      nextMilestone.lessons[0]
    ) {
      return {
        milestoneId: nextMilestone.id,
        lessonId: nextMilestone.lessons[0].id,
      };
    }

    return null;
  },
}));
