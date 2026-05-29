import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { ROUTES } from '../../constants/routes';
import { Loader } from '../Loader/Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredStage?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredStage }) => {
  const { isAuthenticated, currentUser, isAuthChecking, setPreviousRoute } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Save the current route for redirect after login
    if (!isAuthenticated && !isAuthChecking) {
      setPreviousRoute(location.pathname);
    }
  }, [isAuthenticated, isAuthChecking, location.pathname, setPreviousRoute]);

  // Show loading screen while checking authentication
  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FF]">
        <Loader />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Check progression if requiredStage is specified
  if (requiredStage && currentUser?.stage_progress) {
    // Simple progression check - can be enhanced based on actual stage logic
    // For now, we'll allow access if user has any stage progress
    // You can implement more complex logic here based on your stage system
    const currentStage = currentUser.stage_progress;
    console.log(`Current stage: ${currentStage}, Required stage: ${requiredStage}`);
  }

  return <>{children}</>;
};

export default ProtectedRoute;
