import type { User } from '../types/auth.types';

interface ProfileApiData {
  _id?: string;
  id?: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  avatar?: string;
  avatarUrl?: string;
  level?: number;
  xp?: number;
  role?: string;
  bio?: string;
  verified?: boolean;
  stats?: User['stats'];
  badges?: User['badges'];
  social_accounts?: User['social_accounts'];
  skills?: User['skills'];
  stage_progress?: User['stage_progress'];
}

export function normalizeUser(data: ProfileApiData): User {
  const avatarUrl = data.avatarUrl ?? data.avatar;

  return {
    id: String(data._id ?? data.id ?? ''),
    email: data.email ?? '',
    username: data.username ?? data.name ?? '',
    firstName: data.firstName,
    lastName: data.lastName,
    name: data.name,
    avatarUrl,
    avatar: avatarUrl,
    level: data.level ?? 1,
    xp: data.xp ?? 0,
    role: data.role,
    bio: data.bio,
    verified: data.verified,
    stats: data.stats,
    badges: data.badges,
    social_accounts: data.social_accounts,
    skills: data.skills,
    stage_progress: data.stage_progress,
  };
}
