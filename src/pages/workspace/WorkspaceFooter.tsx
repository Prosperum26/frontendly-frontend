import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import type { ExerciseNavigation } from '../../features/editor/types/editor.types';

interface WorkspaceFooterProps {
  navigation?: {
    prev: ExerciseNavigation | null;
    next: ExerciseNavigation | null;
    currentMilestoneId?: string;
  };
  isCompleted?: boolean;
}

export const WorkspaceFooter: React.FC<WorkspaceFooterProps> = ({
  navigation,
  isCompleted,
}) => {
  const navigate = useNavigate();

  const handleNext = () => {
    if (navigation?.next?.id && navigation.next.milestoneId) {
      // Navigate to theory lesson
      navigate(`/learning-path/milestone/${navigation.next.milestoneId}/lesson/${navigation.next.id}`);
    }
  };

  return (
    <footer className="workspace-footer">
      <div className="workspace-footer__inner">
        <button
          type="button"
          className="workspace-footer__back"
          onClick={() => navigate(ROUTES.LEARNING_PATH)}
        >
          ← Back to Learning Path
        </button>
        {navigation?.next?.id && (
          <button
            type="button"
            className="workspace-footer__next"
            onClick={handleNext}
            disabled={!isCompleted}
          >
            Next Lesson →
          </button>
        )}
      </div>
    </footer>
  );
};

export default WorkspaceFooter;
