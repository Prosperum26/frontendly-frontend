import React from 'react';
import type { ActivityLog } from '../types/profile.types';

interface ActivityFeedProps {
  activities: ActivityLog[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div className="activity-feed">
      <h3>Recent Activity</h3>
      <ul>
        {activities.map((activity, index) => (
          <li key={typeof activity.id === 'string' ? activity.id : `activity-${index}`}>
            <p>{activity.description}</p>
            <span>{new Date(activity.timestamp).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;
