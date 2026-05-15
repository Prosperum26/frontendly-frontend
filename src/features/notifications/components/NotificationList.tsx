import React from 'react';
import type { Notification } from '../types/notifications.types';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({ notifications, onMarkAsRead }) => {
  return (
    <div className="notification-list">
      {notifications.length === 0 ? (
        <p className="no-notifications">No notifications</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            onClick={() => onMarkAsRead(notification.id)}
          >
            <div className={`notification-icon notification-icon--${notification.type}`}>
              {notification.type === 'success' && '✓'}
              {notification.type === 'error' && '✕'}
              {notification.type === 'warning' && '⚠'}
              {notification.type === 'info' && 'ℹ'}
            </div>
            <div className="notification-content">
              <h4>{notification.title}</h4>
              <p>{notification.message}</p>
              <span className="notification-time">
                {new Date(notification.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationList;
