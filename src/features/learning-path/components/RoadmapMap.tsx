import React from 'react';
import { useLoadMilestones } from '../hooks/useLoadMilestones';

export const RoadmapMap: React.FC = () => {
  const { milestones, loading } = useLoadMilestones();

  if (loading) return <div>Loading roadmap...</div>;

  return (
    <div className="roadmap-map">
      {milestones.map((milestone) => (
        <div key={milestone.id} className="milestone">
          <h3>{milestone.title}</h3>
          <p>{milestone.description}</p>
        </div>
      ))}
    </div>
  );
};

export default RoadmapMap;
