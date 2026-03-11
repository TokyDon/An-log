/**
 * Anílog Achievement Store — Zustand
 *
 * Tracks unlocked achievements and persists them to AsyncStorage.
 * Hydrates from storage on import.
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'achievements';

interface AchievementState {
  unlockedIds: string[];

  unlockAchievement: (id: string) => void;
  isUnlocked: (id: string) => boolean;
  hydrate: (ids: string[]) => void;
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
  unlockedIds: [],

  unlockAchievement: (id) => {
    const { unlockedIds } = get();
    if (unlockedIds.includes(id)) return;
    const next = [...unlockedIds, id];
    set({ unlockedIds: next });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  },

  isUnlocked: (id) => get().unlockedIds.includes(id),

  hydrate: (ids) => set({ unlockedIds: ids }),
}));

// Hydrate from AsyncStorage on first import
AsyncStorage.getItem(STORAGE_KEY).then((val) => {
  if (!val) return;
  try {
    const ids = JSON.parse(val) as string[];
    useAchievementStore.getState().hydrate(ids);
  } catch {
    // ignore malformed data
  }
});
