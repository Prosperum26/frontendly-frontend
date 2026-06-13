import React from 'react';
import { Outlet } from 'react-router-dom';
import { WorkspaceNav } from '../../pages/workspace/WorkspaceNav';
import '../../pages/workspace/workspace.css';

export const WorkspaceLayout: React.FC = () => {
  return (
    <div className="workspace-shell">
      <WorkspaceNav />
      <Outlet />
    </div>
  );
};

export default WorkspaceLayout;
