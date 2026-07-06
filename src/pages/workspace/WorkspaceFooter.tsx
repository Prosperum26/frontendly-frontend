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
    const targetMilestoneId = navigation?.next?.milestoneId || navigation?.currentMilestoneId;
    if (navigation?.next?.id && targetMilestoneId) {
      navigate(`/learning-path/milestone/${targetMilestoneId}/lesson/${navigation.next.id}`);
    } else {
      console.warn('Cannot navigate to next lesson!', { navigation });
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
            style={{
              opacity: isCompleted ? 1 : 0.5, 
              cursor: isCompleted ? 'pointer' : 'not-allowed', 
              transition: 'all 0.3s ease'
            }}
          >
            Next Lesson →
          </button>
        )}
      </div>
    </footer>
  );
};

export default WorkspaceFooter;