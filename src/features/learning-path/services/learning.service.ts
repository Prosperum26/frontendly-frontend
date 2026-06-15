import api from "../../../services/api";
import type { RoadmapResponse, RoadmapDto } from "../types/learning-path.types";
import { applyMilestoneUnlockRules, mapApiMilestonesToMilestones } from "../utils/roadmapMappers";
import { useAuthStore } from "../../../store/auth.store";
import { useGuestStore } from "../../../store/guest.store";

export const learningService = {
  async fetchRoadmap(
    skillId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<RoadmapResponse> {
    const response = await api.get<RoadmapResponse>(`/roadmaps/${skillId}`, {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  },

  async fetchFullRoadmap(skillId: string): Promise<RoadmapResponse> {
    const first = await this.fetchRoadmap(skillId, 1, 20);
    if (!first.success || !first.data) {
      return first;
    }

    const { pagination, milestones } = first.data;
    if (!pagination || pagination.totalPages <= 1) {
      return first;
    }

    const extraPages = await Promise.all(
      Array.from({ length: pagination.totalPages - 1 }, (_, i) =>
        this.fetchRoadmap(skillId, i + 2, pagination.limit || 20),
      ),
    );

    const allMilestones = [
      ...milestones,
      ...extraPages.flatMap((page) => page.data?.milestones ?? []),
    ];

    return {
      ...first,
      data: {
        ...first.data,
        milestones: allMilestones,
      },
    };
  },

  mapRoadmapResponse(response: RoadmapResponse): RoadmapDto | null {
    if (!response.success || !response.data?.milestones) {
      return null;
    }

    let milestones = mapApiMilestonesToMilestones(response.data.milestones);
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    let userProgress = response.data.userProgress;

    if (!isAuthenticated) {
      const guestStore = useGuestStore.getState();
      const completedIds = guestStore.completedLessonIds;

      // Map completed status locally
      milestones = milestones.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) => ({
          ...l,
          completed: completedIds.includes(l.id),
        })),
      }));

      // Map locked status for exceeding limits
      milestones = milestones.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) => ({
          ...l,
          isLocked: guestStore.isLessonLockedForGuest(l.id),
        })),
      }));

      userProgress = {
        currentXp: completedIds.length * 50,
        streakDays: 0,
      };
    }

    milestones = applyMilestoneUnlockRules(milestones);

    return {
      skillId: response.data.skillId,
      skillTitle: response.data.skillTitle,
      milestones,
      userProgress,
    };
  },
};

export default learningService;
