/**
 * Party Store
 *
 * Manages the trainer's party of up to 5 Anímons.
 * Persisted to AsyncStorage so party survives app restarts.
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Animon } from '../types/animon';
import type { PartyAnimon, PartySlot } from '../types/party';

const STORAGE_KEY = 'party_slots';
export const PARTY_SIZE = 6;

interface PartyState {
  /** Six slots — null means the slot is empty. */
  slots: (PartySlot | null)[];

  /** Fill the first empty slot with an Anímon. No-op if party is full. */
  addToParty: (animon: Animon, nickname?: string) => void;

  /** Clear a slot by index. */
  removeFromParty: (slotIndex: number) => void;

  /** Update the nickname of a party member. */
  setNickname: (slotIndex: number, nickname: string) => void;

  /** Hydrate store from persisted storage. */
  hydrate: (slots: (PartySlot | null)[]) => void;
}

export const usePartyStore = create<PartyState>((set, get) => ({
  slots: Array(PARTY_SIZE).fill(null) as (PartySlot | null)[],

  addToParty: (animon: Animon, nickname?: string) => {
    const { slots } = get();
    const firstEmpty = slots.findIndex((s) => s === null);
    if (firstEmpty === -1) return; // party is full

    const partyAnimon: PartyAnimon = {
      ...animon,
      nickname: nickname ?? animon.species,
      level: 1,
    };

    const newSlots = [...slots];
    newSlots[firstEmpty] = { slotIndex: firstEmpty, animon: partyAnimon };
    set({ slots: newSlots });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSlots));
  },

  removeFromParty: (slotIndex: number) => {
    const newSlots = [...get().slots];
    newSlots[slotIndex] = null;
    set({ slots: newSlots });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSlots));
  },

  setNickname: (slotIndex: number, nickname: string) => {
    const newSlots = [...get().slots];
    const slot = newSlots[slotIndex];
    if (!slot) return;
    newSlots[slotIndex] = {
      ...slot,
      animon: { ...slot.animon, nickname },
    };
    set({ slots: newSlots });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSlots));
  },

  hydrate: (slots) => set({ slots }),
}));

// Hydrate from AsyncStorage on first import
AsyncStorage.getItem(STORAGE_KEY).then((val) => {
  if (!val) return;
  try {
    const loaded = JSON.parse(val) as (PartySlot | null)[];
    // Pad to current PARTY_SIZE in case the saved array is from an older build
    const slots: (PartySlot | null)[] = Array(PARTY_SIZE).fill(null);
    for (let i = 0; i < Math.min(loaded.length, PARTY_SIZE); i++) {
      slots[i] = loaded[i] ?? null;
    }
    usePartyStore.getState().hydrate(slots);
  } catch {
    // ignore malformed data
  }
});
