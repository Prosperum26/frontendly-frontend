import type { StoredPersonalizedPath } from '../types/entrance-test.types';

const STORAGE_KEY = 'frontendly-personalized-path';

export function savePersonalizedPath(data: StoredPersonalizedPath): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getPersonalizedPath(): StoredPersonalizedPath | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredPersonalizedPath) : null;
  } catch {
    return null;
  }
}

export function clearPersonalizedPath(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasCompletedEntranceTest(): boolean {
  return getPersonalizedPath() !== null;
}
