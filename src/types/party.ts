/**
 * Party Types
 *
 * A Trainer's Party holds up to 5 Anímons they have chosen to travel with.
 * Party Anímons carry a user-given nickname and a level that grows over time.
 */

import type { Animon } from './animon';

/** An Anímon that lives in the player's party — extends base Animon with party-only fields. */
export interface PartyAnimon extends Animon {
  /** The name the trainer gave this Anímon (defaults to species on capture/selection). */
  nickname: string;
  /** Starts at 1, increases through play. */
  level: number;
}

/** One of the 5 party slots (0-indexed). May be empty (null in the store). */
export interface PartySlot {
  slotIndex: number; // 0–4
  animon: PartyAnimon;
}
