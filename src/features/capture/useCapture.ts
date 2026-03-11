/**
 * useCapture — Phase 1 Camera + AI Identification Hook
 *
 * Orchestrates the full Phase 1 capture flow:
 * 1. Consume one daily scan (server-authoritative limit check)
 * 2. Send frame to Gemini Vision (real or mock)
 * 3. Check screen-detection and animal-present guards
 * 4. Look up species in the speciesRegistry (commonName + ageStage)
 * 5. Roll glossy (1-in-50 chance)
 * 6. Get fuzzy location (city/region only — no precise GPS stored)
 * 7. Upload capture photo baseline64 → Supabase Storage animon-photos bucket
 * 8. Insert row into public.animons
 * 9. Refresh local collection store
 * 10. Evaluate achievement unlocks
 */

import { useState, useCallback } from 'react';
import { analyseFrame } from '../../services/ai/geminiVision';
import { getCaptureRegion } from '../../services/location/fuzzyLocation';
import { uploadCapturePhoto } from '../../services/supabase/storage';
import { consumeScan } from '../../services/supabase/scans';
import { createAnimon } from '../../services/supabase/animons';
import {
  SPECIES_REGISTRY,
  findSpeciesByName,
  getJuvenileVariant,
} from '../../data/speciesRegistry';
import type { SpeciesEntry } from '../../data/speciesRegistry';
import { useCollectionStore } from '../../store/collectionStore';
import { useAuthStore } from '../../store/authStore';
import { useAchievementStore } from '../../store/achievementStore';
import { ACHIEVEMENTS } from '../../constants/achievements';
import type { Animon, AgeStage } from '../../types/animon';
import type { Achievement } from '../../constants/achievements';

// ─── Local helpers ────────────────────────────────────────────────────────────

/**
 * Look up the correct SpeciesEntry given a common name (from Gemini) and an age stage.
 * Gemini always returns adult common names even for juveniles — so we find by
 * adult commonName first, then switch to the juvenile variant if one exists and
 * Gemini indicated juvenile.
 */
function lookupSpeciesEntry(commonName: string, ageStage: AgeStage): SpeciesEntry | null {
  // Find any entry with this common name (usually the adult)
  const anyMatch = findSpeciesByName(commonName);
  if (!anyMatch) return null;

  if (ageStage === 'juvenile') {
    const juvenile = getJuvenileVariant(anyMatch.speciesId);
    if (juvenile) return juvenile;
  }

  return anyMatch;
}

/** Roll glossy: 1-in-50 chance at the point of capture. */
function rollGlossy(): boolean {
  return Math.random() < 0.02;
}

// ─── State ────────────────────────────────────────────────────────────────────

interface CaptureState {
  isIdentifying: boolean;
  isRevealing: boolean;
  /** The saved Animon — populated after successful capture + DB insert */
  captured: Animon | null;
  /**
   * Local file URI of the captured photo, for immediate display in the camera
   * result card BEFORE the upload completes.
   * (captured.photoUrl is the Supabase storage path, not a display URI.)
   */
  capturedPhotoUri: string | null;
  error: string | null;
  /** Always false in Phase 1 — no disambiguation flow */
  needsDisambiguation: false;
  /** Daily scan limit reached — show limit overlay */
  scanLimitReached: boolean;
  pendingAchievement: Achievement | null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCapture() {
  const user = useAuthStore((s) => s.user);
  const addAnimon = useCollectionStore((s) => s.addAnimon);

  const [state, setState] = useState<CaptureState>({
    isIdentifying:    false,
    isRevealing:      false,
    captured:         null,
    capturedPhotoUri: null,
    error:            null,
    needsDisambiguation: false,
    scanLimitReached: false,
    pendingAchievement: null,
  });

  /**
   * capture() — called by the camera screen when a photo frame is ready.
   *
   * @param base64Jpeg — base64 JPEG from expo-camera (no data URL prefix)
   * @param photoUri   — local file URI for immediate display in the result card
   */
  const capture = useCallback(
    async (base64Jpeg: string, photoUri: string) => {
      if (!user) return;

      setState((s) => ({ ...s, isIdentifying: true, error: null, capturedPhotoUri: photoUri }));

      try {
        // ── Step 1: Consume one daily scan ──────────────────────────────────
        const scanResult = await consumeScan(user.id);
        if (scanResult.limitReached) {
          setState((s) => ({
            ...s,
            isIdentifying: false,
            scanLimitReached: true,
          }));
          return;
        }

        // ── Step 2: Analyse frame with Gemini ────────────────────────────────
        const geminiResult = await analyseFrame(base64Jpeg);

        if (geminiResult.screenDetected) {
          setState((s) => ({
            ...s,
            isIdentifying: false,
            error: "That looks like a photo of a screen — point the camera at a real animal!",
          }));
          return;
        }

        if (!geminiResult.identified) {
          setState((s) => ({
            ...s,
            isIdentifying: false,
            error: "No animal detected. Try moving closer or waiting for the animal to stay still.",
          }));
          return;
        }

        // ── Step 3: Species registry lookup ──────────────────────────────────
        const speciesEntry = lookupSpeciesEntry(
          geminiResult.commonName,
          geminiResult.ageStage,
        );

        if (!speciesEntry) {
          setState((s) => ({
            ...s,
            isIdentifying: false,
            error: "This creature isn't in the Anímon registry yet — keep exploring!",
          }));
          return;
        }

        // ── Step 4: Roll glossy ──────────────────────────────────────────────
        const isGlossy = rollGlossy();
        const rarity = isGlossy ? 'glossy' : speciesEntry.rarity;

        // ── Step 5: Location ──────────────────────────────────────────────────
        const region = await getCaptureRegion();

        // ── Step 6: Upload photo to Supabase Storage ─────────────────────────
        const photoStoragePath = await uploadCapturePhoto(user.id, base64Jpeg);

        // ── Step 7: Insert animon row ─────────────────────────────────────────
        const animon = await createAnimon({
          userId:          user.id,
          species:         speciesEntry.id,
          breed:           null,
          colour:          'N/A',
          gender:          'unknown',
          rarity,
          ageStage:        speciesEntry.ageStage,
          types:           speciesEntry.types as Animon['types'],
          photoUrl:        photoStoragePath,
          region,
          confidenceScore: geminiResult.confidence,
        });

        addAnimon(animon);

        // ── Step 8: Achievement checks ────────────────────────────────────────
        const allAnimons = useCollectionStore.getState().animons;
        const total = allAnimons.length;
        const achieveStore = useAchievementStore.getState();
        const newlyUnlocked: string[] = [];

        const checks: Array<{ id: string; passes: boolean }> = [
          { id: 'first_scan',   passes: total === 1 },
          { id: 'scan_5',       passes: total === 5 },
          { id: 'scan_10',      passes: total === 10 },
          { id: 'scan_25',      passes: total === 25 },
          { id: 'first_rare',   passes: animon.rarity === 'rare' },
          { id: 'first_glossy', passes: animon.rarity === 'glossy' },
        ];

        for (const c of checks) {
          if (c.passes && !achieveStore.isUnlocked(c.id)) {
            achieveStore.unlockAchievement(c.id);
            newlyUnlocked.push(c.id);
          }
        }

        const firstNewAchievement =
          newlyUnlocked.length > 0
            ? (ACHIEVEMENTS.find((a) => a.id === newlyUnlocked[0]) ?? null)
            : null;

        // ── Reveal ────────────────────────────────────────────────────────────
        setState((s) => ({
          ...s,
          isIdentifying: false,
          isRevealing:   true,
          captured:      animon,
          pendingAchievement: firstNewAchievement,
        }));

        setTimeout(() => {
          setState((s) => ({ ...s, isRevealing: false }));
        }, 900);

      } catch (err) {
        setState((s) => ({
          ...s,
          isIdentifying: false,
          error: err instanceof Error ? err.message : 'Capture failed',
        }));
      }
    },
    [user, addAnimon],
  );

  const reset = useCallback(() => {
    setState({
      isIdentifying:    false,
      isRevealing:      false,
      captured:         null,
      capturedPhotoUri: null,
      error:            null,
      needsDisambiguation: false,
      scanLimitReached: false,
      pendingAchievement: null,
    });
  }, []);

  const clearPendingAchievement = useCallback(() => {
    setState((s) => ({ ...s, pendingAchievement: null }));
  }, []);

  return { ...state, capture, reset, clearPendingAchievement };
}
