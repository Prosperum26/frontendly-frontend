import { useQuery } from "@tanstack/react-query";
import { learningService } from "../services/learning.service";
import { useRoadmapStore } from "../stores/roadmapStore";
import { DEFAULT_SKILL_ID } from "../utils/roadmapMappers";

import type { RoadmapDto } from "../types/learning-path.types";

export function useRoadmap(skillId: string = DEFAULT_SKILL_ID): ReturnType<typeof useQuery<RoadmapDto>> {
  const setRoadmap = useRoadmapStore((s) => s.setRoadmap);

  return useQuery({
    queryKey: ["roadmap", skillId],
    queryFn: async () => {
      const response = await learningService.fetchFullRoadmap(skillId);
      const mapped = learningService.mapRoadmapResponse(response);
      if (!mapped) {
        throw new Error(response.message || "Cannot find roadmap.");
      }
      setRoadmap({
        skillId: mapped.skillId || skillId,
        skillTitle: mapped.skillTitle,
        milestones: mapped.milestones,
        userProgress: mapped.userProgress,
      });
      return mapped;
    },
  });
}

export default useRoadmap;
