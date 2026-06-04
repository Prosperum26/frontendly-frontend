import type {
  ApiMilestone,
  DetailLesson,
  Milestone,
  MilestoneDetail,
} from "../types/learning-path.types";

export const DEFAULT_SKILL_ID = "react";

export function mapApiMilestonesToMilestones(
  apiMilestones: ApiMilestone[],
): Milestone[] {
  return apiMilestones.map((apiMilestone, index) => ({
    id: apiMilestone.id,
    order: index + 1,
    title: apiMilestone.title,
    description: apiMilestone.description || "Chinh phục kỹ năng này...",
    completed: apiMilestone.status === "completed",
    status: apiMilestone.status,
    icon: apiMilestone.icon || "",
    lessons: (apiMilestone.stages || []).map((stage) => ({
      id: stage.id,
      title: stage.title,
      description: "",
      type: "theory" as const,
      completed: stage.isCompleted,
      xpReward: (stage.earnedStars || 0) * 50,
      isLocked: false,
    })),
  }));
}

export function applyMilestoneUnlockRules(
  milestones: Milestone[],
): Milestone[] {
  return milestones.map((milestone, index) => {
    if (milestone.status !== "locked" || index === 0) {
      return milestone;
    }

    const previous = milestones[index - 1];
    const previousDone =
      previous.status === "completed" ||
      previous.completed ||
      (previous.lessons.length > 0 &&
        previous.lessons.every((lesson) => lesson.completed));

    if (!previousDone) {
      return milestone;
    }

    return {
      ...milestone,
      status: "in_progress",
      completed: false,
    };
  });
}

export function deriveStageStatus(
  milestoneStatus: Milestone["status"],
  stageIndex: number,
  stages: { isCompleted: boolean }[],
): DetailLesson["status"] {
  const completed = stages[stageIndex]?.isCompleted ?? false;
  if (completed) return "completed";
  if (milestoneStatus === "locked") return "locked";
  if (milestoneStatus === "completed") return "completed";

  const firstIncomplete = stages.findIndex((s) => !s.isCompleted);
  if (firstIncomplete === -1) return "completed";
  if (stageIndex === firstIncomplete) return "in_progress";
  if (stageIndex < firstIncomplete) return "completed";
  return "locked";
}

export function milestoneToDetail(milestone: Milestone): MilestoneDetail {
  const stages = milestone.lessons.map((l) => ({
    isCompleted: l.completed,
  }));
  const completedLessons = milestone.lessons.filter((l) => l.completed).length;
  const totalLessons = milestone.lessons.length;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const lessons: DetailLesson[] = milestone.lessons.map((lesson, index) => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    type: "theory",
    status: deriveStageStatus(milestone.status, index, stages),
    duration: "",
    tags: [],
    order: index + 1,
  }));

  return {
    id: milestone.id,
    milestoneNumber: milestone.order,
    title: milestone.title,
    description: milestone.description,
    totalLessons,
    completedLessons,
    progressPercent,
    lessons,
    proTip: {
      text: "Hoàn thành từng bài theo thứ tự để mở khóa bài tiếp theo.",
      imageUrl: "",
    },
  };
}
