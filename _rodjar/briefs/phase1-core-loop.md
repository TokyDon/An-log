# Phase 1 PRD — Anílog Core Loop

**Document status:** Ready for development  
**Branch target:** `feat/phase1-core-loop` (branched from `feat/auth-onboarding`)  
**Date:** March 10, 2026  
**Author:** Product (via Copilot)

---

## Table of Contents

1. [Phase 1 Scope Summary](#1-phase-1-scope-summary)
2. [User Stories & Acceptance Criteria](#2-user-stories--acceptance-criteria)
3. [Technical Architecture Decisions](#3-technical-architecture-decisions)
4. [New Database Migration: `002_daily_scans.sql`](#4-new-database-migration-002_daily_scanssql)
5. [Implementation Order](#5-implementation-order)
6. [Open Questions & Out of Scope](#6-open-questions--out-of-scope)

---

## 1. Phase 1 Scope Summary

Phase 1 delivers the complete **Scan → Capture → Collect** core loop: the end-to-end experience from opening the camera, through live AI identification of a real wild animal, to a reveal screen, to a permanently stored entry in the user's collection backed by Supabase. The player's collection is populated from real database data — no mock data in production paths. Phase 1 does **not** include: subscription purchase UI, social/friends features, achievements/stamps, the profile tab, or in-app notifications. "Done" is defined as: a user with an existing account can open the Camera tab, point at a real animal, see the lock-on animation fire automatically when the AI identifies it with high confidence, tap through the reveal screen, and immediately see the new Animon appear in their Anílog collection tab — with the illustration, stats, and capture location all correct — persistently stored in Supabase.

---

## 2. User Stories & Acceptance Criteria

### US-01 — Scan & Capture (Core Loop)

**As a player, I want the app to automatically identify animals through my camera so I can capture them as Animons without manually pressing a shoot button.**

#### AC-01.1 — Camera opens and requests permissions

```
Given I am on the Camera tab
When the camera screen mounts for the first time
Then the app requests camera permission via expo-camera
And if permission is granted, the live camera feed is displayed
And if permission is denied, a static "Camera access needed" message is shown with a link to Settings
```

#### AC-01.2 — Location permission is requested on first scan

```
Given the camera feed is active
When the first analysis cycle begins (i.e. the first ~3 second tick)
And location permission has not yet been granted
Then expo-location requests foreground permission
And regardless of the user's choice, the scan cycle continues
And if denied, region will be stored as "Unknown location"
```

#### AC-01.3 — Continuous scan loop runs automatically

```
Given the camera feed is live and camera permission is granted
Then the app analyses a camera frame every 3 seconds via the Gemini Vision API
And the scan loop continues without any user interaction required
And a subtle animated indicator shows the camera is "scanning"
And no UI prompt asks the user to "tap to shoot"
```

#### AC-01.4 — Liveness detection blocks photo/screen fraud

```
Given the scan loop is running
When a Gemini frame analysis returns { identified: false, reason: 'screen_detected' }
Then the lock-on animation does NOT trigger
And the UI displays the message: "Point at a real animal!"
And this message auto-dismisses after 2 seconds
And the scan loop continues immediately
```

#### AC-01.5 — Low confidence / no animal detected

```
Given the scan loop is running
When a Gemini frame analysis returns { identified: false, reason: 'no_animal' }
Or returns { identified: true, confidence: <0.70 }
Then no UI change occurs (silent non-event)
And the scan loop continues on its 3-second cadence
```

#### AC-01.6 — Lock-on animation triggers on confirmed detection

```
Given the scan loop is running
When a Gemini frame analysis returns { identified: true, confidence: ≥0.70, isRealAnimal: true }
And the returned commonName matches a species in the speciesRegistry
Then a targeting reticle animation plays over the camera feed for 1.5 seconds
And the scan loop PAUSES during this 1.5 seconds (no new API calls)
And after 1.5 seconds the capture is automatically confirmed (no user tap needed)
```

#### AC-01.7 — Unknown species produces fallback, is not saved

```
Given the lock-on animation has fired
And the Gemini response commonName does NOT match any species in the speciesRegistry
Then the reveal screen shows an "Unknown Creature" card with a question mark illustration
And no row is inserted into public.animons
And the user is shown: "This creature isn't in the Animon registry yet — keep exploring!"
And the capture photo is NOT uploaded to Supabase Storage
```

#### AC-01.8 — Same-session duplicate prevention

```
Given I have captured a "European Robin" within the last 5 minutes (in-session local state)
When the scan loop detects a European Robin again
Then the lock-on animation does NOT trigger for that species
And the camera UI shows: "You already caught one of these! Try looking for something different."
And this message auto-dismisses after 3 seconds
And the scan loop resumes
Note: After 5 minutes have elapsed since the last same-species capture, the block clears
```

#### AC-01.9 — Daily scan limit enforced

```
Given I am a free-tier user (is_subscribed = false)
When my scan_count for today reaches 20
Then the scan loop stops
And the camera UI shows a full-screen overlay: "You've used all 20 scans for today. Come back tomorrow — or go Premium for unlimited scanning."
And a "Remind me tomorrow" dismiss button is shown
And a "Go Premium" CTA is shown (links to a placeholder screen in Phase 1)
And the remaining scan count (e.g. "3 scans left today") is displayed on the camera screen at all times
```

#### AC-01.10 — Subscribed users bypass daily limit

```
Given I am a subscribed user (is_subscribed = true)
Then scan_count is still incremented per scan (for analytics)
But the scan loop never stops due to daily limit
And no scan count UI is shown on the camera screen
```

---

### US-02 — Reveal Screen

**As a player, after capturing an animal, I want to see a reveal screen that shows my new Animon's illustration and stats so I feel the excitement of a new discovery.**

#### AC-02.1 — Reveal screen appears immediately after capture

```
Given a capture has been confirmed (lock-on animation completed, species found in registry)
Then the camera screen transitions to the Reveal Screen
And the transition uses a dramatic scale-up animation (Animon card zooms in from centre)
```

#### AC-02.2 — Reveal screen displays correct Animon data

```
Given the Reveal Screen is shown for a captured "European Robin"
Then the species illustration (european-robin.png from Supabase Storage) is displayed
And the species common name ("European Robin") is shown as the title
And the rarity badge is displayed with correct tier (e.g. "Uncommon")
And the type tags (e.g. "Air", "Light") are shown
And the base stats (Speed, Power, Defence, Stamina) are shown from speciesRegistry
And the capture region (e.g. "London, UK") is shown at the bottom
```

#### AC-02.3 — Glossy variant is indicated on reveal

```
Given a capture rolls the 1-in-50 glossy outcome (Math.random() < 0.02 at capture time)
Then a shimmer/holo overlay animation plays on the Reveal Screen card
And the rarity badge shows "Glossy ✦"
And the stored rarity in public.animons is 'glossy'
```

#### AC-02.4 — Reveal screen save to Supabase

```
Given the Reveal Screen is showing
When the user taps "Add to Collection" (or after a 3-second auto-confirm countdown)
Then the capture photo is uploaded to the animon-photos Supabase Storage bucket
And a row is inserted into public.animons with all correct fields
And the collection store is refreshed (new animon appears at top of collection)
And the app navigates back to the Anílog (collection) tab
```

#### AC-02.5 — Reveal screen dismiss without saving

```
Given the Reveal Screen is showing
When the user taps "Release" (dismiss)
Then no row is inserted into public.animons
And the capture photo is NOT uploaded
And the app returns to the Camera screen
And the daily scan_count IS still incremented (the scan was used)
```

---

### US-03 — Collection (Anílog Tab)

**As a player, I want to view all my captured Animons in a scrollable grid so I can see my collection grow over time.**

#### AC-03.1 — Collection loads real data from Supabase

```
Given I am on the Anílog tab
Then the grid displays animons fetched from public.animons WHERE user_id = auth.uid()
And mock data is NOT used in any production code path
And the grid is ordered by captured_at DESC (most recent first)
```

#### AC-03.2 — Empty collection state

```
Given I have captured zero Animons
Then the Anílog tab shows the existing EmptyState component
And the message reads: "No Animons yet — head to the Camera tab to start exploring!"
```

#### AC-03.3 — Collection card displays correctly

```
Given animons are loaded from Supabase
Then each card displays:
  - The species illustration (from Supabase Storage via illustrationKey)
  - The species common name
  - The rarity badge
  - The type tags
And the card visual tier (border, glow) matches the rarity
And glossy cards show a shimmer effect
```

#### AC-03.4 — Loading state

```
Given the collection fetch is in flight
Then a skeleton/loading state is shown (existing loading pattern)
And the tab does not show stale mock data during loading
```

---

### US-04 — Animon Detail Screen

**As a player, I want to tap an Animon in my collection to see its full detail — illustration, stats, and where I caught it — and optionally view my actual capture photo.**

#### AC-04.1 — Detail screen shows full Animon info

```
Given I tap an Animon in my collection
Then I navigate to /animon/[id]
And the screen shows:
  - Large species illustration (primary visual)
  - Common name as page title
  - Scientific name (smaller, italic)
  - Rarity badge
  - Type tags
  - Base stats (Speed / Power / Defence / Stamina) as styled stat bars
  - Capture region (e.g. "London, UK")
  - Capture date (formatted: "1 March 2026")
  - Confidence score (e.g. "92% match")
  - Flavour text from speciesRegistry (italic, styled as a field note)
```

#### AC-04.2 — "See your photo" toggle

```
Given I am on the Animon detail screen
When I tap "See your photo"
Then the species illustration is replaced by my actual capture photo (from photo_url via Supabase Storage)
And the toggle label changes to "See illustration"
When I tap "See illustration"
Then the illustration is shown again
Note: The photo is fetched from the private animon-photos bucket using the authenticated session
```

#### AC-04.3 — Glossy detail decoration

```
Given the Animon has rarity: 'glossy'
Then the detail screen header has a shimmer/holo background effect
And the rarity badge displays "Glossy ✦"
```

---

## 3. Technical Architecture Decisions

### 3.1 Species Registry — `src/data/speciesRegistry.ts`

The species registry is the single source of truth for all curated Animon data. It is a TypeScript constant — not a database table — because it is app-owned, version-controlled, and shipped with the bundle.

#### TypeScript Interface

```typescript
import type { AnimonType } from '../types/animon';
import type { AnimonRarity } from '../types/animon';

export type SpeciesCategory = 'bird' | 'mammal' | 'insect' | 'reptile' | 'amphibian' | 'fish';

export interface SpeciesBaseStats {
  speed: number;    // 1–100
  power: number;    // 1–100
  defence: number;  // 1–100
  stamina: number;  // 1–100
}

export interface SpeciesEntry {
  /** Slug used as DB key and illustration filename. e.g. 'european-robin' */
  id: string;
  commonName: string;
  scientificName: string;
  category: SpeciesCategory;
  /** 1 or 2 types from the game type system */
  types: [AnimonType] | [AnimonType, AnimonType];
  rarity: AnimonRarity;
  flavourText: string;
  baseStats: SpeciesBaseStats;
  /**
   * Filename slug for the illustration.
   * Full URL: `${SUPABASE_URL}/storage/v1/object/public/species-illustrations/${illustrationKey}.png`
   * Convention: illustrationKey === id (enforce this in code review)
   */
  illustrationKey: string;
}
```

#### Example Entry — European Robin

```typescript
{
  id: 'european-robin',
  commonName: 'European Robin',
  scientificName: 'Erithacus rubecula',
  category: 'bird',
  types: ['air', 'light'],
  rarity: 'uncommon',
  flavourText: 'A bold songbird that fearlessly approaches gardeners. Its orange-red breast is one of Britain\'s most recognisable sights.',
  baseStats: {
    speed:    72,
    power:    38,
    defence:  44,
    stamina:  55,
  },
  illustrationKey: 'european-robin',
}
```

#### Initial 30 species

All entries to be defined in `speciesRegistry.ts` prior to camera wiring (Task 1).

| # | ID | Common Name | Category | Rarity |
|---|-----|-------------|----------|--------|
| 1 | `european-robin` | European Robin | bird | uncommon |
| 2 | `house-sparrow` | House Sparrow | bird | common |
| 3 | `blue-tit` | Blue Tit | bird | common |
| 4 | `common-blackbird` | Common Blackbird | bird | common |
| 5 | `common-wood-pigeon` | Wood Pigeon | bird | common |
| 6 | `mallard` | Mallard Duck | bird | common |
| 7 | `long-tailed-tit` | Long-tailed Tit | bird | uncommon |
| 8 | `red-kite` | Red Kite | bird | rare |
| 9 | `barn-owl` | Barn Owl | bird | rare |
| 10 | `peregrine-falcon` | Peregrine Falcon | bird | rare |
| 11 | `red-fox` | Red Fox | mammal | uncommon |
| 12 | `grey-squirrel` | Grey Squirrel | mammal | common |
| 13 | `red-squirrel` | Red Squirrel | mammal | rare |
| 14 | `european-hedgehog` | European Hedgehog | mammal | uncommon |
| 15 | `roe-deer` | Roe Deer | mammal | uncommon |
| 16 | `common-shrew` | Common Shrew | mammal | common |
| 17 | `common-pipistrelle` | Pipistrelle Bat | mammal | uncommon |
| 18 | `brown-rat` | Brown Rat | mammal | common |
| 19 | `red-admiral` | Red Admiral Butterfly | insect | uncommon |
| 20 | `common-bumblebee` | Common Bumblebee | insect | common |
| 21 | `seven-spot-ladybird` | Seven-spot Ladybird | insect | common |
| 22 | `large-white-butterfly` | Large White Butterfly | insect | common |
| 23 | `common-blue-butterfly` | Common Blue Butterfly | insect | uncommon |
| 24 | `emperor-dragonfly` | Emperor Dragonfly | insect | uncommon |
| 25 | `common-lizard` | Common Lizard | reptile | uncommon |
| 26 | `grass-snake` | Grass Snake | reptile | rare |
| 27 | `common-toad` | Common Toad | amphibian | common |
| 28 | `common-frog` | Common Frog | amphibian | common |
| 29 | `atlantic-salmon` | Atlantic Salmon | fish | rare |
| 30 | `three-spined-stickleback` | Three-spined Stickleback | fish | common |

---

### 3.2 Gemini Vision Integration — `src/services/ai/gemini.ts`

#### Environment variable

```
EXPO_PUBLIC_GEMINI_API_KEY=<key>
```

Stored in `.env` (gitignored). Accessed via `process.env.EXPO_PUBLIC_GEMINI_API_KEY`. The `EXPO_PUBLIC_` prefix is required for Expo to expose it to the client bundle.

#### API endpoint

```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${EXPO_PUBLIC_GEMINI_API_KEY}
```

Use `gemini-1.5-flash` (not Pro) for latency — frame analysis must complete well within 3 seconds.

#### Exact prompt

The system prompt instructs strict JSON-only output. **Do not add conversational text around the JSON**.

```typescript
const GEMINI_PROMPT = `You are an animal identification system for a wildlife app.

Analyse the image and respond with ONLY a JSON object — no markdown, no explanation, no extra text.

FIRST check: Is this image showing a real live animal directly in front of a camera, or is it showing a photo/screen/image/painting OF an animal?
- If it appears to be a photo of a photo, a screen, a book, or any non-live capture, set screenDetected: true.
- A live animal in natural or domestic settings is screenDetected: false.

If a real live animal is present and identified with confidence >= 0.70:
{
  "identified": true,
  "isRealAnimal": true,
  "screenDetected": false,
  "commonName": "<common name in English, e.g. European Robin>",
  "confidence": <0.0–1.0>
}

If a screen or photo-of-photo is detected:
{
  "identified": false,
  "isRealAnimal": false,
  "screenDetected": true,
  "reason": "screen_detected"
}

If no animal is visible or confidence < 0.70:
{
  "identified": false,
  "isRealAnimal": true,
  "screenDetected": false,
  "reason": "no_animal"
}

Respond ONLY with the JSON object. No other text.`;
```

#### TypeScript response types

```typescript
export interface GeminiIdentifiedResult {
  identified: true;
  isRealAnimal: true;
  screenDetected: false;
  commonName: string;
  confidence: number;
}

export interface GeminiFailedResult {
  identified: false;
  isRealAnimal: boolean;
  screenDetected: boolean;
  reason: 'screen_detected' | 'no_animal';
}

export type GeminiResult = GeminiIdentifiedResult | GeminiFailedResult;
```

#### Registry lookup after a positive result

```typescript
import { SPECIES_REGISTRY } from '../data/speciesRegistry';

function lookupSpecies(commonName: string): SpeciesEntry | null {
  return SPECIES_REGISTRY.find(
    s => s.commonName.toLowerCase() === commonName.toLowerCase()
  ) ?? null;
}
```

If `lookupSpecies` returns `null`: show "Unknown Creature" fallback (AC-01.7). Do not save to DB.

#### Handling JSON parse failures

Gemini occasionally returns malformed JSON despite the prompt. Wrap the parse in a try/catch and treat parse errors as `{ identified: false, reason: 'no_animal' }` — never throw to the user.

---

### 3.3 Capture Flow Data Path

The full sequence from lock-on confirmation to collection is:

```
1. expo-camera captureAsync() → local URI (JPEG, 1080p max, compressed to quality: 0.7)
2. Read file as base64 via expo-file-system FileSystem.readAsStringAsync(uri, { encoding: 'base64' })
3. Call Gemini API with base64 image → parse GeminiResult
4. If identified && species in registry:
   a. Roll glossy (Math.random() < 0.02)
   b. Get location (expo-location reverseGeocodeAsync → "{city}, {country}" or "Unknown location")
   c. Upload JPEG to Supabase Storage:
      Bucket: animon-photos (PRIVATE)
      Path: {userId}/{capturedAt_ISO}.jpg
      → returns photo_url (authenticated signed URL or long-lived token)
   d. Insert row into public.animons:
      {
        user_id: auth.uid(),
        species: speciesEntry.id,           // slug, e.g. 'european-robin'
        breed: null,                         // Phase 1: not breed-differentiated
        colour: 'N/A',                       // Phase 1: not used for wild animals
        gender: 'unknown',                   // Phase 1: Gemini not asked for gender
        rarity: isGlossy ? 'glossy' : speciesEntry.rarity,
        types: speciesEntry.types,
        photo_url: photo_url,
        region: reverseGeocodedString,
        confidence_score: geminiResult.confidence,
        captured_at: new Date().toISOString(),
      }
   e. Invalidate / refresh collectionStore
   f. Navigate to Reveal Screen with the captured data
5. Increment daily_scans.scan_count for today (server call — regardless of save/release outcome)
```

**Important:** Step 5 (scan count increment) happens at the point of analysis, not at the point of save. A scan is consumed when Gemini is called with a real frame, not when the user confirms the capture.

---

### 3.4 Illustration Storage — Supabase Storage

**Bucket name:** `species-illustrations`  
**Access policy:** `PUBLIC` (unauthenticated read — illustrations are not user-private)  
**File format:** PNG, recommended ~600×600px, transparent background  
**Naming convention:** `{illustrationKey}.png` where `illustrationKey === speciesEntry.id`

**URL pattern used in app:**

```typescript
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;

export function getIllustrationUrl(illustrationKey: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/species-illustrations/${illustrationKey}.png`;
}
```

This function is called in `AnimonCard`, `RevealScreen`, and `AnimonDetail` components.

**Fallback:** If the illustration fails to load (404 or network error), show a placeholder silhouette matching the species category (bird/mammal/insect/reptile/fish).

**User capture photos:**  
Bucket: `animon-photos` (PRIVATE)  
Access: Authenticated only via RLS — users can only access their own photos.  
URL for display: Generate a short-lived signed URL (60s expiry) at the point of display on the detail screen, using `supabase.storage.from('animon-photos').createSignedUrl(path, 60)`.

---

### 3.5 Scan Limit — `daily_scans` Table

The scan counter is **server-authoritative**. Storing it only in AsyncStorage would allow a free-tier user to bypass the limit by clearing app storage.

**Read flow (on Camera tab mount):**

```typescript
const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
const { data } = await supabase
  .from('daily_scans')
  .select('scan_count')
  .eq('user_id', userId)
  .eq('scan_date', today)
  .single();

const currentCount = data?.scan_count ?? 0;
```

**Increment flow (after each Gemini call, before processing result):**

```typescript
await supabase.rpc('increment_daily_scan', { p_user_id: userId, p_date: today });
```

This uses a Postgres function (defined in the migration) to upsert-and-increment atomically.

**Display:** Show `"{FREE_SCAN_LIMIT - currentCount} scans left today"` banner on camera screen for free users. Hide for subscribed users (`is_subscribed = true`).

---

### 3.6 Liveness Detection

Liveness detection is handled **inside the Gemini prompt** (see §3.2). The prompt instructs Gemini to set `screenDetected: true` if the image appears to be a photograph of a photograph, a screen displaying an animal, a book illustration, or any mediated image rather than a direct live camera view.

On `screenDetected: true`, the camera service:
1. Does NOT call `captureAsync()` (no photo is taken)
2. Does NOT consume a daily scan
3. Surfaces the "Point at a real animal!" inline message for 2 seconds
4. Resumes the 3-second scan loop

---

### 3.7 Location — `src/services/location/index.ts`

```typescript
import * as Location from 'expo-location';

export async function getCaptureRegion(): Promise<string> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') return 'Unknown location';

    const coords = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const [geocode] = await Location.reverseGeocodeAsync({
      latitude: coords.coords.latitude,
      longitude: coords.coords.longitude,
    });

    if (!geocode) return 'Unknown location';

    const city = geocode.city ?? geocode.subregion ?? geocode.region ?? '';
    const country = geocode.country ?? '';

    if (!city && !country) return 'Unknown location';
    if (!city) return country;
    if (!country) return city;
    return `${city}, ${country}`;
  } catch {
    return 'Unknown location';
  }
}
```

**Privacy rule (enforced in code review):** The raw `coords.coords.latitude` and `coords.coords.longitude` values must NEVER be assigned to any variable that is transmitted to Supabase or logged. Only the reverse-geocoded string is stored. Add a lint comment above the coords declaration: `// PRIVACY: raw GPS — do not log or transmit`.

---

## 4. New Database Migration: `002_daily_scans.sql`

Create this file at `supabase/migrations/002_daily_scans.sql`.

```sql
-- Anílog — Daily Scans & Subscription Flag
-- Migration: 002_daily_scans
-- Run via: supabase db push

-- ========================================
-- ADD SUBSCRIPTION FLAG TO USERS
-- ========================================
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS is_subscribed BOOLEAN NOT NULL DEFAULT false;

-- ========================================
-- DAILY SCANS TABLE
-- (server-authoritative scan counter per user per day)
-- ========================================
CREATE TABLE IF NOT EXISTS public.daily_scans (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  scan_date   DATE        NOT NULL,
  scan_count  INT         NOT NULL DEFAULT 0 CHECK (scan_count >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, scan_date)
);

-- Index for fast per-user per-date lookup
CREATE INDEX daily_scans_user_date_idx ON public.daily_scans (user_id, scan_date);

-- Enable Row-Level Security
ALTER TABLE public.daily_scans ENABLE ROW LEVEL SECURITY;

-- Users can read their own scan records
CREATE POLICY "Users can view their own daily scans"
  ON public.daily_scans FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own scan records (for upsert path)
CREATE POLICY "Users can insert their own daily scans"
  ON public.daily_scans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own scan records (for increment path)
CREATE POLICY "Users can update their own daily scans"
  ON public.daily_scans FOR UPDATE
  USING (auth.uid() = user_id);

-- ========================================
-- ATOMIC INCREMENT FUNCTION
-- (upsert + increment in a single round-trip)
-- ========================================
CREATE OR REPLACE FUNCTION public.increment_daily_scan(
  p_user_id UUID,
  p_date    DATE
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER   -- runs as function owner; bypasses RLS for the upsert
AS $$
BEGIN
  INSERT INTO public.daily_scans (user_id, scan_date, scan_count, updated_at)
  VALUES (p_user_id, p_date, 1, now())
  ON CONFLICT (user_id, scan_date)
  DO UPDATE SET
    scan_count = daily_scans.scan_count + 1,
    updated_at = now();
END;
$$;

-- Revoke public execute, grant only to authenticated users
REVOKE EXECUTE ON FUNCTION public.increment_daily_scan FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.increment_daily_scan TO authenticated;

-- ========================================
-- UPDATED_AT TRIGGER
-- ========================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER daily_scans_updated_at
  BEFORE UPDATE ON public.daily_scans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
```

---

## 5. Implementation Order

Tasks are sized S (≤half day), M (1 day), L (2–3 days). Execute in this order — each task unblocks the next.

| # | Task | File(s) | Size | Notes |
|---|------|---------|------|-------|
| 1 | **Species Registry** — define `SpeciesEntry` TypeScript interface and all 30 initial species entries | `src/data/speciesRegistry.ts` | S | Foundation — everything else imports from here. Use the exact interface and European Robin example from §3.1. |
| 2 | **Gemini service** — implement `analyseFrame(base64Jpeg: string): Promise<GeminiResult>` with exact prompt, response parsing, JSON error handling, and registry lookup helper | `src/services/ai/gemini.ts` | M | Use `gemini-1.5-flash`. Add `.env` entry for `EXPO_PUBLIC_GEMINI_API_KEY`. Write a `__tests__/gemini.test.ts` with mocked responses covering: identified, screen_detected, no_animal, parse failure. |
| 3 | **Location service** — `getCaptureRegion()` implementing the exact flow in §3.7 | `src/services/location/index.ts` | S | Unit testable — mock `expo-location`. Verify "Unknown location" fallback branches. |
| 4 | **Supabase Storage upload** — `uploadCapturePhoto(userId, uri): Promise<string>` that uploads to `animon-photos` bucket and returns a signed URL | `src/services/supabase/storage.ts` | S | Ensure bucket exists in Supabase dashboard first. Returns 60s signed URL. |
| 5 | **`daily_scans` migration** — run `002_daily_scans.sql` against Supabase | `supabase/migrations/002_daily_scans.sql` | S | Run `supabase db push` locally. Verify `increment_daily_scan` RPC works via Supabase Studio. |
| 6 | **Scan limit service** — `getScanCount(userId): Promise<number>` and `consumeScan(userId): Promise<void>` using the `increment_daily_scan` RPC | `src/services/supabase/scans.ts` | S | Call `consumeScan` before processing Gemini result in camera loop. |
| 7 | **Camera screen** — wire real `expo-camera`, implement continuous 3-second scan loop, liveness message, lock-on reticle animation (1.5s Animated.sequence), daily limit overlay, `{N} scans left` badge | `src/app/camera.tsx` | L | This is the most complex screen. The scan loop must be cleaned up on unmount (`useEffect` return). Use `useRef` for the interval. Pause loop during lock-on animation. See ACs 01.1–01.10. |
| 8 | **Reveal screen** — new route `/capture-reveal` (modal stack), receives `speciesId`, `confidenceScore`, `capturedAt`, `region`, `isGlossy` as params; shows illustration + stats; auto-confirm countdown (3s) or user taps "Add to Collection"; performs DB insert + photo upload | `src/app/capture-reveal.tsx` | M | Pass params via expo-router `router.push`. Glossy shimmer via `Animated` looping opacity on a gradient overlay. |
| 9 | **Collection store** — replace mock data fetch with real Supabase query; implement `fetchCollection()`, `addAnimon()`, `clearCollection()` | `src/store/collectionStore.ts` | M | Follow manual AsyncStorage Zustand pattern (no middleware). Cache locally after first fetch. Invalidate on `addAnimon`. |
| 10 | **Collection tab wire-up** — swap mock data source for collection store, wire `fetchCollection` on mount | `src/app/(tabs)/anilog.tsx` | S | Remove `MOCK_ANIMONS` import. Test empty state. |
| 11 | **Detail screen** — wire real data from collection store lookup by `id` param; add "See your photo" toggle using signed URL from `createSignedUrl`; add flavour text from registry lookup | `src/app/animon/[id].tsx` | S | Get signed URL at mount time (60s expiry is fine for a detail screen session). |
| 12 | **Integration test / QA pass** — end-to-end test on physical device with real animal target; verify all ACs | — | M | Use a printed animal photo to test liveness detection. Test with a species not in the registry. Test scan limit at count 20. |

---

## 6. Open Questions & Out of Scope

### Explicitly Out of Scope for Phase 1

| Feature | Rationale |
|---------|-----------|
| Subscription purchase UI (in-app purchase, RevenueCat, etc.) | `is_subscribed` column is architected in; purchase flow is Phase 2 |
| Friends / social features | Phase 3 |
| Achievements / Stamps tab | Data model exists; UI visible Phase 2 |
| Profile tab | Built; hidden from nav. Phase 2 |
| "Where to find" community map | Location data collected in Phase 1 for this; feature is Phase 3 |
| Push notifications | Phase 2 |
| Animon trading / gifting | Phase 3 |
| Breed differentiation for domestic pets | Phase 2 — `breed` column exists, will be blank in Phase 1 |
| Gender identification via Gemini | Phase 2 — `gender` will be stored as `'unknown'` in Phase 1 |

### Illustration Asset Creation (Content Task — Separate Track)

30 species illustrations must be created and uploaded to the `species-illustrations` Supabase Storage bucket before the app can display correct artwork. This is a **content/design task**, not a development task, and should run in parallel with Tasks 1–6 above. Filenames must exactly match `{illustrationKey}.png`. While illustrations are pending, a category-silhouette placeholder is shown (see §3.4).

### Open Questions

| # | Question | Owner | Status |
|---|----------|-------|--------|
| OQ-1 | Max resolution / size cap for capture photos uploaded to `animon-photos`? Current plan: compress to `quality: 0.7` via `captureAsync` — is this acceptable? | Founder | Open |
| OQ-2 | Should `consumed_scan` be logged even when Gemini returns `screen_detected`? Current spec: no (scan not consumed). Confirm this is the intended anti-abuse behaviour. | Founder | Open |
| OQ-3 | Auto-confirm countdown on reveal screen: 3 seconds or require explicit tap? Auto-confirm is more magical but risks accidental saves. | Founder | Open |
| OQ-4 | `gemini-1.5-flash` API costs at scale — set a Gemini API quota/alert in GCP before launch to prevent unexpected bills. | Founder | Action required |
| OQ-5 | Supabase Storage public bucket for `species-illustrations` — confirm public access is intentional (illustrations are not user-private). | Founder | Confirm before deploy |
