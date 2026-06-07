import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { useRoadmapStore } from "../features/learning-path/stores/roadmapStore";
import { useRoadmap } from "../features/learning-path/hooks/useRoadmap";
import { DEFAULT_SKILL_ID } from "../features/learning-path/utils/roadmapMappers";
import { ROUTES } from "../constants/routes";

export const WorkspacePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(true);
  const [nextStage, setNextStage] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const stageId = searchParams.get("stageId") ?? "";
  const milestoneId = searchParams.get("milestoneId") ?? "";

  const queryClient = useQueryClient();
  const milestones = useRoadmapStore((s) => s.milestones);
  const getMilestoneDetailById = useRoadmapStore(
    (s) => s.getMilestoneDetailById,
  );
  const { refetch } = useRoadmap(DEFAULT_SKILL_ID);

  useEffect(() => {
    const loadData = async () => {
      if (milestones.length === 0) {
        await refetch();
      }
      setIsLoadingRoadmap(false);
    };
    void loadData();
  }, [milestones.length, refetch]);

  const milestone = useMemo(() => {
    if (milestoneId) {
      return getMilestoneDetailById(milestoneId);
    }

    return milestones
      .map((m) => getMilestoneDetailById(m.id))
      .find((detail) =>
        detail?.lessons.some((lesson) => lesson.id === stageId),
      );
  }, [milestoneId, stageId, milestones, getMilestoneDetailById]);

  const currentLesson = milestone?.lessons.find(
    (lesson) => lesson.id === stageId,
  );

  // Find next stage when milestone loads
  useEffect(() => {
    if (milestone && stageId) {
      const currentIndex = milestone.lessons.findIndex((l) => l.id === stageId);
      if (currentIndex >= 0 && currentIndex < milestone.lessons.length - 1) {
        setNextStage(milestone.lessons[currentIndex + 1]);
      } else {
        setNextStage(null); // No more stages in this milestone
      }
    }
  }, [milestone, stageId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stageId]);

  const handleCompletePractice = async () => {
    if (!stageId || !milestone) return;
    setError(null);
    setIsCompleting(true);

    try {
      await api.patch(`/stages/${stageId}/complete`, {});
      await queryClient.invalidateQueries({ queryKey: ["roadmap"] });
      await refetch();

      // Auto-navigate to next theory or milestone complete
      if (nextStage) {
        navigate(
          `/learning-path/milestone/${milestone.id}/lesson/${nextStage.id}`,
        );
      } else {
        // No more stages - navigate to milestone complete page
        navigate(`/learning-path/milestone/${milestone.id}/complete`);
      }
    } catch (err: unknown) {
      console.error("Error completing practice stage:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Không thể hoàn thành bài tập. Vui lòng thử lại.",
      );
    } finally {
      setIsCompleting(false);
    }
  };

  const handleBackToLesson = () => {
    if (milestone && currentLesson) {
      navigate(
        `/learning-path/milestone/${milestone.id}/lesson/${currentLesson.id}`,
      );
      return;
    }
    navigate(ROUTES.LEARNING_PATH);
  };

  if (isLoadingRoadmap) {
    return (
      <div className="workspace-page" style={{ padding: 24 }}>
        <h1>Đang tải bài học...</h1>
      </div>
    );
  }

  if (!stageId || !milestone || !currentLesson) {
    return (
      <div className="workspace-page" style={{ padding: 24 }}>
        <h1>Workspace nội dung thực hành</h1>
        <p>Không tìm thấy thông tin bài học để thực hành.</p>
        <button type="button" onClick={() => navigate(ROUTES.LEARNING_PATH)}>
          Trở về Learning Path
        </button>
      </div>
    );
  }

  return (
    <div className="workspace-page" style={{ padding: 24 }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>{currentLesson.title}</h1>
        <p style={{ margin: "8px 0 0", color: "#64748b" }}>{milestone.title}</p>
      </header>

      <section
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 16,
          padding: 24,
          maxWidth: 940,
          background: "#ffffff",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Practice Workspace</h2>
        <p style={{ lineHeight: 1.7, color: "#334155" }}>
          Đây là trang thực hành cho bài học này. Khi bạn đã hoàn thành phần
          thực hành, nhấn nút “Hoàn thành Practice” để chuyển sang màn hình
          Lesson Complete.
        </p>

        <div
          style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}
        >
          <button
            type="button"
            onClick={handleBackToLesson}
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              border: "1px solid #94a3b8",
              background: "transparent",
              color: "#0f172a",
              cursor: "pointer",
            }}
          >
            Quay lại nội dung lý thuyết
          </button>

          <button
            type="button"
            onClick={handleCompletePractice}
            disabled={isCompleting}
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              border: "none",
              background: "#10b981",
              color: "#ffffff",
              cursor: "pointer",
            }}
          >
            {isCompleting
              ? "Đang hoàn thành..."
              : nextStage
                ? "Hoàn thành và tiếp tục bài tiếp theo"
                : "Hoàn thành Milestone"}
          </button>
        </div>

        {error && <p style={{ marginTop: 18, color: "#dc2626" }}>{error}</p>}
      </section>
    </div>
  );
};

export default WorkspacePage;
