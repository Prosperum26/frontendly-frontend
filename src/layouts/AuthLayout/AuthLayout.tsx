import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="auth-layout">
      <div className="auth-layout-container">
        <div className="auth-layout-logo">Frontendly</div>
        <div className="auth-layout-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
