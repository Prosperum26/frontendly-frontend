import React from 'react';
import { Outlet } from 'react-router-dom';

export const WorkspaceLayout: React.FC = () => {
  return (
    <div className="workspace-layout">
      <header className="workspace-layout-header">
        <div className="workspace-layout-logo">Frontendly</div>
        <div className="workspace-layout-actions">
          <button className="workspace-layout-button">Reset</button>
          <button className="workspace-layout-button workspace-layout-button--primary">Submit</button>
        </div>
      </header>
      <main className="workspace-layout-content">
        <Outlet />
      </main>
    </div>
  );
};

export default WorkspaceLayout;
