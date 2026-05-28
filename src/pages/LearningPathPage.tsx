import React, { useState } from "react";
import "./LearningPathPage.css";
import { SideBar } from "../features/learning-path/components/SideBar";
import { VideoModule } from "../features/learning-path/components/VideoModule";
import { MilestoneCard } from "../features/learning-path/components/MilestoneCard";
import type {
  Milestone,
  ApiMilestone,
} from "../features/learning-path/types/learning-path.types";
import { learningService } from "../features/learning-path/services/learning.service";

//dummy data theo mẫu figma
//tạo tạm 3 milestone dummy để test 3 giai đoạn thôi nha: hoàn thành - đang diễn ra - bị khóa :v
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
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const skillId = "javascript";
  const [isModuleOpen, setIsModuleOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{ title: string; duration: string; url: string } | null>(null);
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

  return (
    <div className="learning-path-wrapper">
      <SideBar onWatchIntro={() => setIsModuleOpen(true)} />
      <div className="learning-path-content">
        <header className="learning-path-header">
          <div className="learning-path-badge">
            <img
              src="src\assets\learning-path\certificate_icon.svg"
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
          {DUMMY_MILESTONES.map((m) => (
            <MilestoneCard key={m.id} milestone={m} />
          ))}
          {isLoading && (
            <div style={{ textAlign: "center", padding: "40px" }}>
              Đang tải lộ trình học...
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
      <VideoModule isOpen={isModuleOpen} onClose={() => setIsModuleOpen(false)} />
    </div>
  );
};

export default LearningPathPage;
