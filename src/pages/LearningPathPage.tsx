import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "./LearningPathPage.css";
import { SideBar } from "../features/learning-path/components/SideBar";
import { VideoModule } from "../features/learning-path/components/VideoModule";
import { MilestoneCard } from "../features/learning-path/components/MilestoneCard";
import { useRoadmap } from "../features/learning-path/hooks/useRoadmap";
import { DEFAULT_SKILL_ID } from "../features/learning-path/utils/roadmapMappers";
import { StudyPlanPanel } from "../features/learning-path/components/StudyPlanPanel";
import { getPersonalizedPath } from "../features/entrance-test/utils/personalized-path.storage";
import { ROUTES } from "../constants/routes";
import certificateIcon from "../assets/learning-path/certificate_icon.svg";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";

export const LearningPathPage: React.FC = () => {
  const [isModuleOpen, setIsModuleOpen] = React.useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState<boolean>(false);
  const { data, isLoading, error, refetch } = useRoadmap(DEFAULT_SKILL_ID);
  const milestones = useMemo(() => data?.milestones ?? [], [data?.milestones]);
  const skillTitle = data?.skillTitle;
  const storedPath = getPersonalizedPath();
  const studyPlan = data?.studyPlan?.length
    ? data.studyPlan
    : storedPath?.personalizedPath?.studyPlan ?? [];

  useEffect(() => {
    if (!isLoading && milestones.length > 0) {
      const timer = setTimeout(() => {
        const target = document.querySelector(".milestone-card.is-in-progress");
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isLoading, milestones]);

  return (
    <div className={`learning-path-wrapper ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <SideBar className={isSidebarCollapsed ? "collapsed" : ""} />
      
      <button 
        className={`sidebar-toggle-btn ${isSidebarCollapsed ? "collapsed" : ""}`}
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      <div className="learning-path-content">
        <header className="learning-path-header">
          <div className="learning-path-badge">
            <img src={certificateIcon} alt="Certificate Icon" />
            CERTIFICATION PATH
          </div>

          <div className="learning-path-header-controls">
            <h1 className="learning-path-title">
              {skillTitle || "React.js Learning Path"}
            </h1>
            <Link 
              to={ROUTES.ENTRANCE_TEST} 
              className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
            >
              Take Entrance Test
            </Link>
          </div>

          <p className="learning-path-desc">
            Master the art of building modern interfaces from core fundamentals to advanced DOM manipulation and performance debugging.
          </p>
        </header>

        <section className="learning-path-section">
          {isLoading && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
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
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "12px",
                        backgroundColor: "#cbd5e1",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: "80px",
                          height: "10px",
                          backgroundColor: "#cbd5e1",
                          borderRadius: "4px",
                        }}
                      />
                      <div
                        style={{
                          width: "200px",
                          height: "16px",
                          backgroundColor: "#cbd5e1",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(180px, 1fr))",
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
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div
              style={{
                color: "#b91c1c",
                padding: "20px",
                background: "#fee2e2",
                borderRadius: "8px",
              }}
            >
              <p style={{ margin: "0 0 12px" }}>
                {error instanceof Error
                  ? error.message
                  : "Không thể tải lộ trình học."}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#dc2626",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Thử lại
              </button>
            </div>
          )}

          {!isLoading && !error && (
            <>
              <div className="learning-path-intro-banner">
                <div className="intro-banner-content">
                  <span className="intro-banner-tag">INTRODUCTION</span>
                  <h2 className="intro-banner-title">Getting Started</h2>
                  <p className="intro-banner-desc">
                    Learn how to navigate the expert mentor mode and utilize the
                    interactive workspace for maximum learning efficiency.
                  </p>
                  <button className="intro-banner-btn" onClick={() => setIsModuleOpen(true)}>
                    <PlayCircle size={16} /> Watch Intro
                  </button>
                </div>
                <div
                  className="intro-banner-video"
                  onClick={() => setIsModuleOpen(true)}
                >
                  <img
                    src="https://img.youtube.com/vi/SqcY0GlETPk/maxresdefault.jpg"
                    alt="Frontendly Getting Started Tutorial Thumbnail"
                  />
                  <div className="play-overlay">
                    <PlayCircle className="play-icon" />
                  </div>
                </div>
              </div>

              <StudyPlanPanel
                studyPlan={studyPlan}
                score={storedPath?.score}
                totalQuestions={storedPath?.totalQuestions}
                level={storedPath?.placementResult?.level}
              />

              {milestones.map((m) => (
                <MilestoneCard key={m.id} milestone={m} />
              ))}
            </>
          )}
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
