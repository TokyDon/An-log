/**
 * useCapture — Camera + AI Identification Hook
 *
 * Orchestrates the full capture flow:
 * 1. Snap photo via expo-camera
 * 2. Get fuzzy location (city level only)
 * 3. Send to Gemini Vision for identification
 * 4. Derive rarity
 * 5. Save to Supabase
 * 6. Add to local Zustand store
 *
 * Returns state for the 900ms reveal animation.
 */

import { useState, useCallback } from 'react';
import { identifyAnimal, deriveRarity } from '../../services/ai/geminiVision';
import { requestFuzzyLocation, formatRegion } from '../../services/location/fuzzyLocation';
import { createAnimon } from '../../services/supabase/animons';
import { useCollectionStore } from '../../store/collectionStore';
import { useAuthStore } from '../../store/authStore';
import { useAchievementStore } from '../../store/achievementStore';
import { ACHIEVEMENTS } from '../../constants/achievements';
import type { Animon, AiIdentificationResult } from '../../types/animon';
import type { Achievement } from '../../constants/achievements';

interface CaptureState {
  isIdentifying: boolean;
  isRevealing: boolean;
  captured: Animon | null;
  error: string | null;
  needsDisambiguation: boolean;
  candidates: AiIdentificationResult['alternativeCandidates'];
  pendingAchievement: Achievement | null;
}

export function useCapture() {
  const user = useAuthStore((s) => s.user);
  const addAnimon = useCollectionStore((s) => s.addAnimon);

  const [state, setState] = useState<CaptureState>({
    isIdentifying: false,
    isRevealing: false,
    captured: null,
    error: null,
    needsDisambiguation: false,
    candidates: undefined,
    pendingAchievement: null,
  });

  const capture = useCallback(
    async (base64Image: string, photoUrl: string) => {
      if (!user) return;

      setState((s) => ({ ...s, isIdentifying: true, error: null }));

      try {
        const [result, location] = await Promise.all([
          identifyAnimal(base64Image),
          requestFuzzyLocation(),
        ]);

        // Low confidence — ask user to pick from candidates
        if (result.confidenceScore < 0.7 && result.alternativeCandidates?.length) {
          setState((s) => ({
            ...s,
            isIdentifying: false,
            needsDisambiguation: true,
            candidates: result.alternativeCandidates,
          }));
          return;
        }

        const rarity = deriveRarity(result);
        const region = location ? formatRegion(location) : 'Unknown';

        const animon = await createAnimon({
          userId: user.id,
          species: result.species,
          breed: result.breed,
          colour: result.colour,
          gender: result.gender,
          rarity,
          types: result.suggestedTypes,
          photoUrl,
          region,
          confidenceScore: result.confidenceScore,
        });

        addAnimon(animon);

        // ── Achievement checks ──────────────────────────────────
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
        // ───────────────────────────────────────────────────────

        // Trigger 900ms reveal animation window
        setState((s) => ({
          ...s,
          isIdentifying: false,
          isRevealing: true,
          captured: animon,
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
      isIdentifying: false,
      isRevealing: false,
      captured: null,
      error: null,
      needsDisambiguation: false,
      candidates: undefined,
      pendingAchievement: null,
    });
  }, []);

  const clearPendingAchievement = useCallback(() => {
    setState((s) => ({ ...s, pendingAchievement: null }));
  }, []);

  return { ...state, capture, reset, clearPendingAchievement };
}
