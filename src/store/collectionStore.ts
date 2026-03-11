/**
 * Anílog Collection Store — Zustand
 *
 * Manages the local Anímon collection state.
 * React Query handles server sync; this store manages UI state and cache.
 * Local animons are persisted to AsyncStorage so starters survive refresh.
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Animon } from '../types/animon';

const COLLECTION_KEY = 'collection_animons';

interface CollectionState {
  animons: Animon[];
  selectedAnimon: Animon | null;
  isCapturing: boolean;
  lastCaptured: Animon | null;

  // Actions
  setAnimons: (animons: Animon[]) => void;
  addAnimon: (animon: Animon) => void;
  removeAnimon: (id: string) => void;
  setSelectedAnimon: (animon: Animon | null) => void;
  setCapturing: (isCapturing: boolean) => void;
  setLastCaptured: (animon: Animon | null) => void;
  hydrate: (animons: Animon[]) => void;
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
  animons: [],
  selectedAnimon: null,
  isCapturing: false,
  lastCaptured: null,

  setAnimons: (animons) => set({ animons }),

  addAnimon: (animon) => {
    // Avoid duplicates (restart-safe)
    if (get().animons.find((a) => a.id === animon.id)) return;
    const updated = [animon, ...get().animons];
    set({ animons: updated });
    AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(updated));
  },

  removeAnimon: (id) => {
    const updated = get().animons.filter((a) => a.id !== id);
    set({ animons: updated });
    AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(updated));
  },

  setSelectedAnimon: (selectedAnimon) => set({ selectedAnimon }),
  setCapturing: (isCapturing) => set({ isCapturing }),
  setLastCaptured: (lastCaptured) => set({ lastCaptured }),
  hydrate: (animons) => set({ animons }),
}));

// Hydrate local collection from AsyncStorage on first import
AsyncStorage.getItem(COLLECTION_KEY).then((val) => {
  if (!val) return;
  try {
    const loaded = JSON.parse(val) as Animon[];
    useCollectionStore.getState().hydrate(loaded);
  } catch {
    // ignore malformed data
  }
});
