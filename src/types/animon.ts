/**
 * Anílog Core Types — Anímon
 *
 * These are the fundamental domain types for the Anímon collectible system.
 * All AI identification, storage, and display logic references these types.
 */

import type { AnimonTypeName } from '../constants/typeSystem';

export type AnimonRarity = 'common' | 'uncommon' | 'rare' | 'glossy';
export type AgeStage = 'juvenile' | 'adult';

/** Re-export for convenience */
export type AnimonType = AnimonTypeName;

// ─── Phase 1 Gemini Result Types ─────────────────────────────────────────────

/**
 * Gemini identified a real live animal with confidence >= 0.70.
 */
export interface GeminiIdentifiedResult {
  identified: true;
  isRealAnimal: true;
  screenDetected: false;
  commonName: string;
  ageStage: AgeStage;
  confidence: number;
}

/**
 * Gemini could not identify (screen detected, no animal, or low confidence).
 */
export interface GeminiFailedResult {
  identified: false;
  isRealAnimal: boolean;
  screenDetected: boolean;
  reason: 'screen_detected' | 'no_animal';
}

export type GeminiResult = GeminiIdentifiedResult | GeminiFailedResult;

// ─── Legacy AI Identification (pre-Phase 1) ───────────────────────────────────

/**
 * The structured result returned by the Gemini Vision AI service.
 * If confidenceScore < 0.7, alternativeCandidates will be populated
 * and the app will prompt the user to disambiguate.
 */
export interface AiIdentificationResult {
  species: string;
  breed: string | null;
  colour: string;
  gender: 'male' | 'female' | 'unknown';
  isGlossy: boolean;
  confidenceScore: number; // 0–1
  suggestedTypes: AnimonType[];
  alternativeCandidates?: Array<{
    species: string;
    confidence: number;
  }>;
}

// ─── Core Anímon Entity ───────────────────────────────────────────────────────

/**
 * A captured Anímon as stored in Supabase and displayed in the collection.
 *
 * Privacy note: `region` is ALWAYS city/region level.
 * Precise GPS coordinates are NEVER stored.
 */
export interface Animon {
  id: string;
  userId: string;
  species: string;
  breed: string | null;
  colour: string;
  gender: 'male' | 'female' | 'unknown';
  rarity: AnimonRarity;
  /** 'juvenile' | 'adult' — from Gemini response */
  ageStage: AgeStage;
  types: AnimonType[];
  /**
   * Storage path in the 'animon-photos' Supabase bucket.
   * e.g. '{userId}/{timestamp}.jpg'
   * Use getCapturePhotoUrl(photoUrl) to generate a signed display URL.
   */
  photoUrl: string;
  /** City/region only — e.g. "London, UK". NEVER precise GPS. */
  region: string;
  capturedAt: string; // ISO 8601
  confidenceScore: number;
}

// ─── Scan Result ─────────────────────────────────────────────────────────────

/**
 * The result of a completed camera scan, before the user confirms saving.
 * Combines the captured photo with the AI identification result and derived metadata.
 * Passed from the camera screen to the save flow.
 */
export interface AnimonScanResult {
  /** Local URI of the captured photo (from expo-camera) */
  photoUri: string;
  /** AI identification from Gemini */
  aiResult: AiIdentificationResult;
  /** Rarity derived from aiResult */
  rarity: AnimonRarity;
  /** ISO 8601 timestamp of the scan */
  scannedAt: string;
  /** City/region string from device location (optional — may be unavailable) */
  region?: string;
}

// ─── Collection Stats ─────────────────────────────────────────────────────────

export interface CollectionStats {
  total: number;
  byRarity: Record<AnimonRarity, number>;
  uniqueSpecies: number;
  uniqueRegions: number;
}
