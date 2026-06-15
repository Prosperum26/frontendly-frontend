import { create } from 'zustand';
import { guestProgressStorage, type StorageType } from '../utils/storage';
import api from '../services/api';

const GUEST_THEORY_KEY = 'guest_viewed_theories';
const GUEST_COMPLETED_KEY = 'guest_completed_lessons';
const GUEST_STORAGE_TYPE_KEY = 'guest_storage_type';
export const MAX_GUEST_LESSONS = 2;

function getStoredStorageType(): StorageType {
  try {
    const stored = localStorage.getItem(GUEST_STORAGE_TYPE_KEY);
    return (stored as StorageType) || 'localStorage';
  } catch {
    return 'localStorage';
  }
}

interface GuestState {
  storageType: StorageType;
  viewedTheoryIds: string[];
  completedLessonIds: string[];
  setStorageType: (type: StorageType) => void;
  canViewTheory: (stageId: string) => boolean;
  canViewLesson: (stageId: string) => boolean;
  recordTheoryView: (stageId: string) => void;
  completeLesson: (stageId: string) => void;
  clearProgress: () => void;
  isLessonLockedForGuest: (stageId: string) => boolean;
}

export const useGuestStore = create<GuestState>((set, get) => {
  const initialStorageType = getStoredStorageType();
  
  return {
    storageType: initialStorageType,
    viewedTheoryIds: guestProgressStorage.get(GUEST_THEORY_KEY, initialStorageType) || [],
    completedLessonIds: guestProgressStorage.get(GUEST_COMPLETED_KEY, initialStorageType) || [],

    setStorageType: (type: StorageType) => {
      try {
        localStorage.setItem(GUEST_STORAGE_TYPE_KEY, type);
      } catch (e) {
        console.error(e);
      }
      
      const currentViewed = get().viewedTheoryIds;
      const currentCompleted = get().completedLessonIds;
      
      guestProgressStorage.set(GUEST_THEORY_KEY, currentViewed, type);
      guestProgressStorage.set(GUEST_COMPLETED_KEY, currentCompleted, type);
      
      set({
        storageType: type,
        viewedTheoryIds: currentViewed,
        completedLessonIds: currentCompleted,
      });
    },

    canViewTheory: (stageId: string) => {
      const { viewedTheoryIds, completedLessonIds } = get();
      if (viewedTheoryIds.includes(stageId) || completedLessonIds.includes(stageId)) {
        return true;
      }
      const uniqueAccessed = Array.from(new Set([...viewedTheoryIds, ...completedLessonIds]));
      return uniqueAccessed.length < MAX_GUEST_LESSONS;
    },

    canViewLesson: (stageId: string) => {
      return get().canViewTheory(stageId);
    },

    recordTheoryView: (stageId: string) => {
      const { viewedTheoryIds, storageType, completedLessonIds } = get();
      if (!viewedTheoryIds.includes(stageId)) {
        const uniqueAccessed = Array.from(new Set([...viewedTheoryIds, ...completedLessonIds]));
        if (!uniqueAccessed.includes(stageId) && uniqueAccessed.length >= MAX_GUEST_LESSONS) {
          return;
        }
        const updated = [...viewedTheoryIds, stageId];
        guestProgressStorage.set(GUEST_THEORY_KEY, updated, storageType);
        set({ viewedTheoryIds: updated });
      }
    },

    completeLesson: (stageId: string) => {
      const { completedLessonIds, storageType, viewedTheoryIds } = get();
      if (!completedLessonIds.includes(stageId)) {
        const uniqueAccessed = Array.from(new Set([...viewedTheoryIds, ...completedLessonIds]));
        if (!uniqueAccessed.includes(stageId) && uniqueAccessed.length >= MAX_GUEST_LESSONS) {
          return;
        }
        const updated = [...completedLessonIds, stageId];
        guestProgressStorage.set(GUEST_COMPLETED_KEY, updated, storageType);
        set({ completedLessonIds: updated });
      }
    },

    clearProgress: () => {
      const { storageType } = get();
      guestProgressStorage.remove(GUEST_THEORY_KEY, storageType);
      guestProgressStorage.remove(GUEST_COMPLETED_KEY, storageType);
      set({ viewedTheoryIds: [], completedLessonIds: [] });
    },

    isLessonLockedForGuest: (stageId: string) => {
      const { viewedTheoryIds, completedLessonIds } = get();
      if (viewedTheoryIds.includes(stageId) || completedLessonIds.includes(stageId)) {
        return false;
      }
      const uniqueAccessed = Array.from(new Set([...viewedTheoryIds, ...completedLessonIds]));
      return uniqueAccessed.length >= MAX_GUEST_LESSONS;
    }
  };
});

export const syncGuestProgress = async () => {
  const guestStore = useGuestStore.getState();
  const completedIds = guestStore.completedLessonIds;
  if (completedIds.length === 0) return;

  console.log('Syncing guest completed lessons:', completedIds);
  for (const lessonId of completedIds) {
    try {
      await api.patch(`/stages/${lessonId}/complete`, {});
    } catch (err) {
      console.error(`Failed to sync lesson ${lessonId}:`, err);
    }
  }

  guestStore.clearProgress();
};
