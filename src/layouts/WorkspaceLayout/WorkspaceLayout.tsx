import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { WorkspaceNav } from '../../pages/workspace/WorkspaceNav';
import { ROUTES } from '../../constants/routes';
import '../../pages/workspace/workspace.css';

export const WorkspaceLayout: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <div className="text-6xl mb-6">📱</div>
          <h1 className="text-2xl font-bold text-heading mb-4">
            Coding workspace is not supported on mobile devices
          </h1>
          <p className="text-muted mb-8">
            Please switch to a tablet or desktop for the best experience.
          </p>
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="workspace-shell">
      <WorkspaceNav />
      <Outlet />
    </div>
  );
};

export default WorkspaceLayout;
