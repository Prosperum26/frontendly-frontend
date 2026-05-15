import React from 'react';
import type { Milestone } from '../types/learning-path.types';

interface MilestoneCardProps {
  milestone: Milestone;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone }) => {
  return (
    <div className={`milestone-card ${milestone.completed ? 'completed' : ''}`}>
      <h3>{milestone.title}</h3>
      <p>{milestone.description}</p>
      <div className="lessons-count">
        {milestone.lessons.length} lessons
      </div>
    </div>
  );
};

export default MilestoneCard;
