import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import '../../pages/workspace/workspace.css';

export const WorkspaceLayout: React.FC = () => {
  return (
    <div className="workspace-shell">
      <Header />
      <Outlet />
    </div>
  );
};

export default WorkspaceLayout;
