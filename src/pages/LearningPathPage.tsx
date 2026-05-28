import React, { useState, useEffect } from "react";
import "./LearningPathPage.css";
import { SideBar } from "../features/learning-path/components/SideBar";
import { VideoModule } from "../features/learning-path/components/VideoModule";
import { MilestoneCard } from "../features/learning-path/components/MilestoneCard";
import type {
  Milestone,
  ApiMilestone,
} from "../features/learning-path/types/learning-path.types";
import { learningService } from "../features/learning-path/services/learning.service";
export const LearningPathPage: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const skillId = "javascript";
  const [isModuleOpen, setIsModuleOpen] = useState(false);

  useEffect(() => {
    const loadRoadmapData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await learningService.fetchRoadmap(skillId, 1, 5);

        if (response.success && response.data) {
          const formattedMilestones: Milestone[] = response.data.milestones.map(
            (apiMilestone: ApiMilestone, index: number) => ({
              id: apiMilestone.id,
              order: index + 1,
              title: apiMilestone.title,
              description: "Mô tả nội dung chặng đường...",
              completed: apiMilestone.status === "completed",
              status: apiMilestone.status,
              lessons: apiMilestone.stages.map((stage) => ({
                id: stage.id,
                title: stage.title,
                description: "",
                type: "theory",
                completed: stage.isCompleted,
                xpReward: stage.earnedStars * 50,
              })),
            }),
          );

          setMilestones(formattedMilestones);
        } else {
          setError(response.message || "Có lỗi xảy ra khi lấy dữ liệu.");
        }
      } catch (err) {
        console.error("Lỗi khi fetch lộ trình:", err);
        setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    loadRoadmapData();
  }, [skillId]);

  useEffect(() => {
    if (!isLoading && milestones.length) {
      const timer = setTimeout(() => {
        const target = document.querySelector('.milestone-card.is-in-progress') as HTMLElement;
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isLoading, milestones]);
    <div className="learning-path-wrapper">
      <SideBar onWatchIntro={() => setIsModuleOpen(true)} />
      <div className="learning-path-content">
        <header className="learning-path-header">
          <div className="learning-path-badge">
            <img
              src="src/assets/learning-path/certificate_icon.svg"
              alt="Certificate Icon"
            />
            CERTIFICATION PATH
          </div>

          <h1 className="learning-path-title">Frontend Learning Path</h1>
          <p className="learning-path-desc">
            Master the art of building modern interfaces from core fundamentals
            to advanced DOM manipulation and performance debugging.
          </p>
        </header>

        <section className="learning-path-section">
          {isLoading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {[1, 2, 3].map((key) => (
                <div
                  key={key}
                  style={{
                    padding: "24px",
                    borderRadius: "12px",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #f1f5f9",
                    opacity: 0.7,
                    pointerEvents: "none",
                  }}
                >
                  <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "20px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "12px",
                        backgroundColor: "#cbd5e1",
                      }}
                    ></div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                      <div
                        style={{
                          width: "80px",
                          height: "10px",
                          backgroundColor: "#cbd5e1",
                          borderRadius: "4px",
                        }}
                      ></div>
                      <div
                        style={{
                          width: "200px",
                          height: "16px",
                          backgroundColor: "#cbd5e1",
                          borderRadius: "4px",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        style={{
                          height: "56px",
                          borderRadius: "8px",
                          backgroundColor: "#e2e8f0",
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div
              style={{
                color: "red",
                padding: "20px",
                background: "#fee2e2",
                borderRadius: "8px",
              }}
            >
              {error}
            </div>
          )}

          {!isLoading &&
            !error &&
            milestones.map((m) => <MilestoneCard key={m.id} milestone={m} />)}
        </section>
      </div>
      <VideoModule
        isOpen={isModuleOpen}
        onClose={() => setIsModuleOpen(false)}
      />
    </div>
  );
};

export default LearningPathPage;
