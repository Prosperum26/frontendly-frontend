import React, { useEffect, useMemo, useState } from "react";
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
import { AuthRequiredModal } from "../components/AuthRequiredModal/AuthRequiredModal";
import { useAuthStore } from "../store/auth.store";

export const LearningPathPage: React.FC = () => {
  const [isModuleOpen, setIsModuleOpen] = React.useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { data, isLoading, error, refetch } = useRoadmap(DEFAULT_SKILL_ID);
  const milestones = useMemo(() => data?.milestones ?? [], [data?.milestones]);
  const skillTitle = data?.skillTitle;
  const storedPath = getPersonalizedPath();
  const studyPlan = data?.studyPlan?.length
    ? data.studyPlan
    : storedPath?.personalizedPath?.studyPlan ?? [];

  const handleEntranceTestClick = () => {
    if (isAuthenticated) {
      window.location.href = ROUTES.ENTRANCE_TEST;
    } else {
      setShowAuthModal(true);
    }
  };

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
      <AuthRequiredModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
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
            <button
              onClick={handleEntranceTestClick}
              className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
            >
              Take Entrance Test
            </button>
          </div>

          <p className="learning-path-desc">
            Master the art of building modern interfaces from core fundamentals to advanced DOM manipulation and performance debugging.
          </p>
        </header>

        <section className="learning-path-section">
          {isLoading && (
            <div className="flex flex-col gap-5">
              {[1, 2, 3].map((key) => (
                <div
                  key={key}
                  className="p-6 rounded-xl bg-slate-50 border border-slate-100 opacity-70 pointer-events-none"
                >
                  <div className="flex gap-4 items-center mb-5">
                    <div className="w-9 h-9 rounded-lg bg-slate-300" />
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="w-20 h-2.5 bg-slate-300 rounded" />
                      <div className="w-50 h-4 bg-slate-300 rounded" />
                    </div>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-14 rounded-lg bg-slate-200"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-red-700 p-5 bg-red-100 rounded-lg">
              <p className="mb-3">
                {error instanceof Error
                  ? error.message
                  : "Không thể tải lộ trình học."}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="px-4 py-2 rounded-md border-none bg-red-600 text-white cursor-pointer font-semibold hover:bg-red-700 transition-colors"
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
