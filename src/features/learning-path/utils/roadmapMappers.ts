import type {
  ApiMilestone,
  DetailLesson,
  Milestone,
  MilestoneDetail,
} from "../types/learning-path.types";
import type { StoredPersonalizedPath } from "../../entrance-test/types/entrance-test.types";
import { getPersonalizedPath } from "../../entrance-test/utils/personalized-path.storage";

export const DEFAULT_SKILL_ID = "frontend";

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
      completed: stage.isCompleted || stage.placementStatus === "auto_passed",
      xpReward: (stage.earnedStars || 0) * 50,
      isLocked: stage.placementStatus === "locked",
      placementStatus: stage.placementStatus ?? null,
    })),
  }));
}

export function applyPersonalizedPathOverlay(
  milestones: Milestone[],
  storedPath?: StoredPersonalizedPath | null,
): Milestone[] {
  const pathData = storedPath ?? getPersonalizedPath();
  const learningPath = pathData?.personalizedPath?.learningPath;
  if (!learningPath?.length) return milestones;

  const statusMap = new Map(
    learningPath.map((lesson) => [
      lesson.stageId || lesson.canonicalLessonId,
      lesson.status,
    ]),
  );

  return milestones.map((milestone) => ({
    ...milestone,
    lessons: milestone.lessons.map((lesson) => {
      const placementStatus = statusMap.get(lesson.id);
      if (!placementStatus) return lesson;

      if (placementStatus === "auto_passed") {
        return { ...lesson, completed: true, placementStatus, isLocked: false };
      }
      if (placementStatus === "locked") {
        return { ...lesson, isLocked: true, placementStatus };
      }
      return { ...lesson, placementStatus, isLocked: false };
    }),
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
  stages: { isCompleted: boolean; placementStatus?: string | null }[],
): DetailLesson["status"] {
  const stage = stages[stageIndex];
  const completed = stage?.isCompleted ?? false;
  const placementStatus = stage?.placementStatus;

  if (placementStatus === "auto_passed" || completed) return "auto_passed";
  if (placementStatus === "locked" || milestoneStatus === "locked") return "locked";
  if (milestoneStatus === "completed") return "completed";

  const firstIncomplete = stages.findIndex(
    (s) => !s.isCompleted && s.placementStatus !== "auto_passed",
  );
  if (firstIncomplete === -1) return "completed";
  if (stageIndex === firstIncomplete) return "in_progress";
  if (stageIndex < firstIncomplete) return "completed";
  return "locked";
}

export function milestoneToDetail(milestone: Milestone): MilestoneDetail {
  const stages = milestone.lessons.map((l) => ({
    isCompleted: l.completed,
    placementStatus: l.placementStatus,
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
    status: lesson.placementStatus === "auto_passed"
      ? "auto_passed"
      : lesson.isLocked
        ? "locked"
        : deriveStageStatus(milestone.status, index, stages),
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

export function resolveStudyPlan(
  apiStudyPlan?: string[],
): string[] {
  if (apiStudyPlan?.length) return apiStudyPlan;
  return getPersonalizedPath()?.personalizedPath?.studyPlan ?? [];
}
