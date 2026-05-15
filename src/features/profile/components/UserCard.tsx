import React from 'react';
import type { UserProfile } from '../types/profile.types';

interface UserCardProps {
  profile: UserProfile;
}

export const UserCard: React.FC<UserCardProps> = ({ profile }) => {
  return (
    <div className="user-card">
      <div className="user-avatar">
        {profile.avatar ? (
          <img src={profile.avatar} alt={profile.username} />
        ) : (
          <div className="avatar-placeholder">{profile.username[0]}</div>
        )}
      </div>
      <h3>{profile.username}</h3>
      <p>Level {profile.level}</p>
      <p>{profile.xp} XP</p>
    </div>
  );
};

export default UserCard;
