import { create } from 'zustand';

const GUEST_THEORY_KEY = 'guest_viewed_theories';
const MAX_GUEST_THEORIES = 2;

function loadViewedTheories(): string[] {
  try {
    const stored = localStorage.getItem(GUEST_THEORY_KEY);
    return stored ? (JSON.parse(stored) as string[]) : [];
  } catch {
    return [];
  }
}

interface GuestState {
  viewedTheoryIds: string[];
  canViewTheory: (stageId: string) => boolean;
  recordTheoryView: (stageId: string) => void;
}

export const useGuestStore = create<GuestState>((set, get) => ({
  viewedTheoryIds: loadViewedTheories(),
  canViewTheory: (stageId: string) => {
    const ids = get().viewedTheoryIds;
    return ids.includes(stageId) || ids.length < MAX_GUEST_THEORIES;
  },
  recordTheoryView: (stageId: string) => {
    const ids = get().viewedTheoryIds;
    if (!ids.includes(stageId)) {
      const updated = [...ids, stageId];
      localStorage.setItem(GUEST_THEORY_KEY, JSON.stringify(updated));
      set({ viewedTheoryIds: updated });
    }
  },
}));
