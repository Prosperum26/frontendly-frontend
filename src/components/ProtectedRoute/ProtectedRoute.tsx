import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { useGuestStore } from '../../store/guest.store';
import { ROUTES } from '../../constants/routes';
import { Loader } from '../Loader/Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredStage?: string;
  allowGuest?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredStage, allowGuest }) => {
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
    if (allowGuest) {
      const match = location.pathname.match(/\/workspace\/([^/]+)/);
      const exerciseId = match ? match[1] : null;
      let stageId = exerciseId;
      if (stageId && stageId.startsWith('exercise_')) {
        stageId = stageId.replace('exercise_', '');
      }
      const guestStore = useGuestStore.getState();
      
      if (stageId && guestStore.canViewLesson(stageId)) {
        return <>{children}</>;
      }
    }
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Check progression if requiredStage is specified
  if (requiredStage && currentUser?.stage_progress) {
    const userStage = currentUser.stage_progress;
    
    // Extract stage numbers from stage IDs (format: "stage_1", "stage_2", etc.)
    const requiredStageNumber = parseInt(requiredStage.replace('stage_', ''), 10);
    const userStageNumber = parseInt(userStage.replace('stage_', ''), 10);
    
    // Check if user's stage is less than required stage
    if (!isNaN(requiredStageNumber) && !isNaN(userStageNumber) && userStageNumber < requiredStageNumber) {
      return <Navigate to={ROUTES.LEARNING_PATH} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
