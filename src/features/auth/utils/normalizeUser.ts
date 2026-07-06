import type { User } from '../types/auth.types';

interface MongoObjectId {
  $oid?: string;
}

interface ProfileApiData {
  _id?: string | MongoObjectId | { toString?: () => string };
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

  let realId = data.id || '';

  if (!realId && data._id) {
    const rawId = data._id;
    if (typeof rawId === 'string') {
      realId = rawId;
    } else if (typeof rawId === 'object') {
      if ('$oid' in rawId && rawId.$oid) {
        realId = rawId.$oid;
      } else if (rawId.toString && typeof rawId.toString === 'function') {
        const str = rawId.toString();
        if (str !== '[object Object]') realId = str;
      }
    }
  }

  return {
    id: realId, 
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