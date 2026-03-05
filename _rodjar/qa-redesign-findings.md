# QA Findings: Skeuomorphic Redesign Verification

**QA Tester:** Rodjar QA Agent  
**Date:** 2026-03-05  
**Branch:** `feature/skeuomorphic-redesign`  
**Design Spec:** `_rodjar/design-spec-skeuomorphic.md`

---

## Check Results

### ✅ Check 1 — Branch Verification
`git branch` confirms `* feature/skeuomorphic-redesign`. Correct branch. **PASS**

---

### ❌ Check 2 — TypeScript Compilation

`npx tsc --noEmit` exits with code **1**. **5 type errors found** across 2 files:

| File | Line | Error |
|------|------|-------|
| `src/components/ui/CameraTab.tsx` | 37 | `Property 'primary' does not exist` on colors |
| `src/components/ui/CameraTab.tsx` | 40 | `Property 'primary' does not exist` on colors |
| `src/components/ui/EmptyState.tsx` | 52 | `Property 'text' does not exist` on colors |
| `src/components/ui/EmptyState.tsx` | 59 | `Property 'text' does not exist` on colors |
| `src/components/ui/EmptyState.tsx` | 65 | `Property 'primary' does not exist` on colors |

Both files still reference removed old tokens (`colors.primary`, `colors.text.primary`, `colors.text.secondary`). They were not updated during the redesign migration. See FAIL items below. **FAIL**

---

### ✅ Check 3 — Design Token Audit (`src/constants/colors.ts`)

All required new tokens are present and match spec values exactly:
- `deviceBody: '#2C2416'` ✅
- `screenBg: '#F5F0E8'` ✅
- `amberReadout: '#E8C97E'` ✅
- `scannerGreen: '#1B4332'` ✅
- `surfaceCard: '#F0EBE0'` ✅
- `surfacePanel: '#EDE8DC'` ✅
- `rarity.common/uncommon/rare/glossy` ✅

Old tokens (`primary`, `accent`, `background`, `surface`, `text.*`) correctly removed — **not present as aliases**, which caused the migration gap in Check 2.

**Spot-check for hardcoded hex in components:**
- `AnimonCard.tsx`: uses spec-precise inline hex values for bevel borders and shadows (`'#1A0F00'`, `'#FFFFFF'`, `'#B8AD96'`, `'#F5EDD8'`) — these are intentional and match the spec exactly, not arbitrary. Acceptable.
- `RarityBadge.tsx`: uses `borderColor: '#C8BFA8'` in `badgeCommon` — this value equals `colors.surfaceBorder` but is hardcoded inline rather than referencing the token. **LOW** — noted below.
- `TypeTagChip.tsx`: no hardcoded hex values; all styling via token references or spec-defined rgba values. ✅

**PASS** (with LOW noted)

---

### ✅ Check 4 — Typography Audit (`src/constants/typography.ts`)

| Required | Token Key | Value | Status |
|----------|-----------|-------|--------|
| Playfair Display (heading) | `fontFamily.heading` | `'PlayfairDisplay_400Regular'` | ✅ |
| Playfair Display Bold | `fontFamily.headingBold` | `'PlayfairDisplay_700Bold'` | ✅ |
| Playfair Display Black | `fontFamily.headingBlack` | `'PlayfairDisplay_900Black'` | ✅ |
| DM Sans body | `fontFamily.body` | `'DMSans_400Regular'` | ✅ |
| DM Sans medium | `fontFamily.bodyMedium` | `'DMSans_500Medium'` | ✅ |
| DM Sans bold | `fontFamily.bodyBold` | `'DMSans_700Bold'` | ✅ |
| Space Mono readout | `fontFamily.mono` | `'SpaceMono_400Regular'` | ✅ |
| Space Mono bold | `fontFamily.monoBold` | `'SpaceMono_700Bold'` | ✅ |

All font family keys match the spec definition. **PASS**

---

### ✅ Check 5 — Carousel Height Fix (`src/components/ui/AnimonCard.tsx`)

**Non-glossy compact path** (return `innerCard` directly):
- `styles.cardCompact` (Pressable): `height: 140, overflow: 'hidden'` ✅
- `styles.compactInner` (inner View): `height: 140` ✅
- Both layers explicitly constrained. **PASS**

**Glossy compact path** (wrapped in `glossyOuter` → `glossyBorder` → `glossyInner`):
- `styles.glossyOuter` / `styles.glossyOuterCompact`: **no `height: 140` declared** ⚠️
- The Pressable inside still has `height: 140`, so the content is constrained.
- `index.tsx` carousel wrapper also adds `height: 140` externally.
- In practice this applies only to 1 of 12 mock animons (Bengal Tiger — glossy). **LOW** — noted below.

---

### ✅ Check 6 — Component Depth Checks

**AnimonCard.tsx — raised card effect:**
- `shadowColor: '#1A0F00', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.30, shadowRadius: 10, elevation: 10` ✅
- Bevel borders: `borderTopColor: '#FFFFFF'` (highlight) + `borderBottomColor: '#B8AD96'` (shadow) ✅

**RarityBadge.tsx — embossed/stamped treatment:**
- `common` — flat inset stone style, no shadow ✅
- `uncommon` — `shadowColor: '#2D7A3A', elevation: 2` ✅
- `rare` — `shadowColor: '#2A5B9E', elevation: 2` ✅
- `glossy` — `LinearGradient ['#D4AF37','#FFD700','#B8860B']` + `shadowColor: '#B8860B', shadowOpacity: 0.50, elevation: 4` ✅

**TypeTagChip.tsx — raised specimen tab:**
- Top highlight edge: `View` with `backgroundColor: 'rgba(255,255,255,0.28)'` ✅
- Bottom shadow edge: `borderBottomColor: 'rgba(0,0,0,0.18)'` ✅
- `shadowColor: '#000', shadowOpacity: 0.20, shadowRadius: 2, elevation: 2` ✅

**TabBar.tsx — device control panel:**
- Background: `colors.deviceBezel` (#1A1208) ✅
- Top border: `borderTopWidth: 2, borderTopColor: colors.metalBrush` ✅
- Rivet decorations: `rivetLeft` and `rivetRight` — `5×5px`, `borderRadius: 2.5`, `backgroundColor: colors.metalBrushLight` ✅
- LED dots: inactive `colors.deviceBody` / active `colors.scannerGreenGlow` with iOS glow shadow ✅
- Active tab: `borderTopWidth: 2, borderTopColor: colors.scannerGreenGlow` ✅
- Camera disc: `52×52px`, `borderRadius: 26`, `backgroundColor: colors.scannerGreen`, `borderColor: colors.scannerGreenGlow`, `elevation: 12`, `marginTop: -18` ✅

All four components **PASS**

---

### ✅ Check 7 — Screen Spot Checks

**`src/app/(tabs)/index.tsx` (Discover):**
- `SafeAreaView` uses `styles.deviceFrame: { backgroundColor: colors.deviceBody }` — dark walnut chrome ✅
- Stat chips: `backgroundColor: colors.deviceBezel` with `statLabel: { color: colors.amberReadout }` — amber LCD on dark panel ✅
- `statLabel` uses `typography.fontFamily.mono` (Space Mono) ✅ — data readout font correct

**`src/app/(tabs)/anilog.tsx` (My Anílog):**
- Filter chips inactive: `backgroundColor: colors.surfacePanel` + raised shadow ✅
- Filter chips active: `backgroundColor: colors.surfaceInset` + inset border (`borderTopColor: '#B8AD96'` dark top, `borderBottomColor: '#E8E2D0'` light bottom) ✅

**`src/app/camera.tsx` (Camera):**
- Reticle corner brackets: `borderColor: colors.amberGlow` ✅
- Pulse ring: `borderColor: colors.amberGlow` ✅
- Scan line: `backgroundColor: colors.amberGlow, shadowColor: colors.amberGlow` ✅
- Status text: `fontFamily: typography.fontFamily.mono, color: colors.amberReadout` ✅
- Top bar: `backgroundColor: colors.deviceBezel` ✅

**`src/app/animon/[id].tsx` (Detail screen):**
- Stat cells: `backgroundColor: colors.deviceBezel` — dark bezel panels ✅
- `statLabel: { fontFamily: typography.fontFamily.mono }` ✅
- `statValue: { fontFamily: typography.fontFamily.monoBold, color: colors.amberReadout }` ✅
- `heroSpecies: { fontFamily: typography.fontFamily.headingBlack, fontStyle: 'italic' }` ✅
- **BUT** `heroSpecies.fontSize = 32` — spec requires `typography.fontSize['3xl']` which is **36px**. ⚠️ **MEDIUM** — noted below.

Screens **CONDITIONAL PASS** (one font-size deviation on detail screen).

---

### ✅ Check 8 — Font Loading (`src/app/_layout.tsx`)

All 8 weights loaded in `useFonts({...})`:

| Font | Weight | Status |
|------|--------|--------|
| `PlayfairDisplay_400Regular` | 400 | ✅ |
| `PlayfairDisplay_700Bold` | 700 | ✅ |
| `PlayfairDisplay_900Black` | 900 | ✅ |
| `DMSans_400Regular` | 400 | ✅ |
| `DMSans_500Medium` | 500 | ✅ |
| `DMSans_700Bold` | 700 | ✅ |
| `SpaceMono_400Regular` | 400 | ✅ |
| `SpaceMono_700Bold` | 700 | ✅ |

**PASS**

---

### ✅ Check 9 — Regression Check

| Feature | File | Verified |
|---------|------|----------|
| Mock data imported on Discover | `index.tsx` imports `MOCK_ANIMONS`, `MOCK_RECENT`, `NEARBY_ACTIVITY`, `MOCK_USER` | ✅ |
| 12 animons in My Anílog grid | `mockAnimons.ts`: IDs 1–12 (6 common, 3 uncommon, 2 rare, 1 glossy) | ✅ |
| Type filter chips functional | `anilog.tsx`: `useState<FilterOption>`, `useMemo` filter, all 10 types + "all" | ✅ |
| Milestones locked/unlocked states | `milestones.tsx`: `ACHIEVEMENTS` array, `unlocked: bool`, renders 🔒 for locked | ✅ |
| Profile Anílog+ banner | `profile.tsx`: `LinearGradient` banner, "Anílog+ ✨" title, UPGRADE button | ✅ |

**PASS — no regressions found**

---

## FAIL Items

### B-003 — `CameraTab.tsx` uses removed color tokens — HIGH

- **File:** `src/components/ui/CameraTab.tsx`
- **Lines:** 37 (`backgroundColor: colors.primary`), 40 (`shadowColor: colors.primary`)
- **Expected:** `colors.scannerGreen` (per migration map: `primary` → `scannerGreen`)
- **Found:** `colors.primary` — token removed in redesign, TypeScript errors generated
- **Additional note:** `CameraTab` is now a stale component — `TabBar.tsx` renders its own camera disc; `CameraTab` is exported from `src/components/ui/index.ts` but is not imported anywhere in the app. The file should either be updated (tokens migrated) and kept, or removed entirely.
- **Severity: HIGH** — causes 2 TypeScript compilation errors; `tsc --noEmit` exits code 1

---

### B-004 — `EmptyState.tsx` uses removed color tokens — HIGH

- **File:** `src/components/ui/EmptyState.tsx`
- **Lines:** 52 (`color: colors.text.primary`), 59 (`color: colors.text.secondary`), 65 (`backgroundColor: colors.primary`)
- **Expected:** 
  - Line 52: `colors.textPrimary`
  - Line 59: `colors.textSecondary`
  - Line 65: `colors.scannerGreen`
- **Found:** Old nested token structure (`colors.text.*`) and removed `colors.primary` — token structure changed in redesign
- **Additional note:** `EmptyState` is actively used in `anilog.tsx` (renders when a type filter returns zero results). The visual failure would be surfaced to a user who filters to a type with no results.
- **Severity: HIGH** — causes 3 TypeScript compilation errors; active component with a user-reachable code path

---

### B-005 — Detail screen hero species name wrong font size — MEDIUM

- **File:** `src/app/animon/[id].tsx`
- **Approximately line:** 195 (inside `heroSpecies` style)
- **Expected:** `fontSize: typography.fontSize['3xl']` → **36px** (per spec: "Species names on detail screen: Playfair Display 900 Black italic, **3xl (36px)**")
- **Found:** `fontSize: 32` — a hardcoded value 4px smaller than spec
- **Severity: MEDIUM** — incorrect direct pixel value; should reference the typography scale token

---

### B-006 — Glossy compact card outer wrapper missing `height: 140` — LOW

- **File:** `src/components/ui/AnimonCard.tsx`
- **Styles:** `glossyOuter` and `glossyOuterCompact`
- **Expected:** Both styles should declare `height: 140` (spec §4.2 CRITICAL FIX: "Both the outer wrapper View and the inner Pressable must declare `height: 140`")
- **Found:** `glossyOuter` defines only `borderRadius`, `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`, `elevation` — no height constraint. The inner Pressable (`cardCompact`) does correctly have `height: 140`.
- **Note:** In the carousel on `index.tsx` an external `<View style={{ height: 140 }}>` wrapper provides the constraint. In practice this glossy compact case is not broken, but the spec requirement is not met at the component level.
- **Severity: LOW**

---

### B-007 — `RarityBadge.tsx` hardcoded hex instead of token reference — LOW

- **File:** `src/components/ui/RarityBadge.tsx`
- **Line:** `badgeCommon` style — `borderColor: '#C8BFA8'`
- **Expected:** `borderColor: colors.surfaceBorder` — the value `#C8BFA8` is exactly `colors.surfaceBorder`; the token exists and should be used
- **Found:** Inline hex `'#C8BFA8'` instead of referencing the token
- **Note:** Functionally identical at runtime. Design system correctness issue only.
- **Severity: LOW**

---

## PASS Summary

| Check | Result |
|-------|--------|
| 1. Correct branch | ✅ PASS |
| 2. TypeScript compilation | ❌ FAIL (B-003, B-004) |
| 3. Design token audit — colors.ts | ✅ PASS |
| 4. Typography audit — typography.ts | ✅ PASS |
| 5. Carousel height fix | ✅ PASS (LOW noted for glossy wrapper) |
| 6. Component depth — all four | ✅ PASS |
| 7. Screen spot checks | ✅ PASS (MEDIUM noted for detail fontSize) |
| 8. Font loading — _layout.tsx | ✅ PASS |
| 9. Regression check | ✅ PASS |

---

## Verdict

### ⚠️ CONDITIONAL PASS

The skeuomorphic redesign is **substantially complete and correctly implemented** across all primary screens and components. The design tokens, typography system, depth effects, device chrome, amber LCD panels, and all screen compositions match the spec.

**Must fix before merge:**
- **B-003** (HIGH) — `CameraTab.tsx`: migrate `colors.primary` → `colors.scannerGreen`, or remove the stale file entirely
- **B-004** (HIGH) — `EmptyState.tsx`: migrate `colors.text.primary` → `colors.textPrimary`, `colors.text.secondary` → `colors.textSecondary`, `colors.primary` → `colors.scannerGreen`
- **B-005** (MEDIUM) — `animon/[id].tsx`: change `heroSpecies.fontSize` from `32` to `typography.fontSize['3xl']`

**Acceptable to merge with logged ticket:**
- **B-006** (LOW) — Glossy compact outer wrapper height
- **B-007** (LOW) — RarityBadge inline hex vs token

Once B-003, B-004, and B-005 are resolved, `tsc --noEmit` must exit 0 before re-verification sign-off.
