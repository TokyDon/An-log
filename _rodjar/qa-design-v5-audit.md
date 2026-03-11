# Anílog — Design Audit v5 (UX/WCAG)

**Branch:** `feat/auth-onboarding`  
**Date:** 2026-03-10  
**Auditor:** UX/UI Designer mode (Refactoring UI framework)  
**Screenshots:** `_rodjar/screenshots/` — 5 screens captured on Expo Web (port 8083, iPhone 14 viewport 390×844 @2x)

---

## Overall score: 6/10

The palette tokens and typography scale are well-designed in isolation, but a **single misused token (`navDark`)** creates two catastrophic WCAG failures on Logbook and Profile, plus the rarity count display in Logbook uses decorative colors as text — producing three more WCAG failures. Spacing and visual hierarchy are mostly solid; the problems are color, not structure.

---

## Color System Audit

All ratios calculated via WCAG 2.1 relative luminance formula.

### Base text tokens (verified ✓)

| Token | Value | On bg (#FFF) | On surface (#F5F5F5) | On surface2 (#EBEBEB) | Status |
|-------|-------|-------------|---------------------|----------------------|--------|
| text1 | #111111 | **18.88:1** | — | — | AAA ✓ |
| text2 | #555555 | **7.46:1** | 6.84:1 | 6.25:1 | AAA ✓ |
| text3 | #5E5E5E | **6.48:1** | 5.95:1 | 5.44:1 | AA ✓ |

> Note: `colors.ts` comments claim text3 is 5.8:1 on white — the actual calculated value is **6.48:1**. The comment is wrong (stale from an older shade). Not a safety issue, but documentation inaccuracy should be corrected.

### Accent token

| Pair | Ratio | Status |
|------|-------|--------|
| accent (#2563EB) on bg (#FFFFFF) | **5.17:1** | AA ✓ |
| accent (#2563EB) on navDark (#FAFAFA) | **4.95:1** | AA ✓ |
| accent (#2563EB) on accentSoft (#EFF6FF) | **4.75:1** | AA ✓ (barely) |

The accent-on-accentSoft pairing at **4.75:1** passes WCAG AA minimum but only by 0.25:1 margin. The filter chip text in the Collection tab uses this pair at `xs` (12pt) — the smallest size that requires ≥4.5:1. Any future shade adjustment could push this below the threshold.

### CRITICAL: textInverse on navDark

| Pair | Ratio | Status |
|------|-------|--------|
| textInverse (#FFFFFF) on navDark (#FAFAFA) | **1.04:1** | ✗ CRITICAL FAIL |

`navDark` is defined as `#FAFAFA` ("almost white") yet the **Logbook** and **Profile** screens use it as a header background and pair it with `textInverse` (#FFFFFF) white text. This produces white-on-white (1.04:1) — the content is **invisible**.

**Root cause:** `navDark` appears to have been a dark value in an earlier palette and was changed to #FAFAFA in v5. The Logbook and Profile screens were not migrated — they still use `textInverse` on `navDark` as if it were dark.

**Affected tokens/screens:**
- `logbook.tsx` line ~190 — `screenTitle: color: colors.textInverse` on `colors.navDark` bg → "Stamps" heading invisible
- `profile.tsx` line ~265 — `username: color: colors.textInverse` on `colors.navDark` bg (partially rescued by overlayDark: blended ratio ≈4.88:1)
- `profile.tsx` line ~270 — `memberSince: color: rgba(255,255,255,0.55)` on blended hero ≈ **2.41:1** ✗ FAIL
- `logbook.tsx` + `profile.tsx` — achievement checkmark `textInverse` on `navDard` = **1.04:1** ✗ FAIL

### Rarity colors used as text

The Logbook's rarity count cells (`rarityCell`) use `colors.rarity[r.rarity]` as **text color** on `surface2 (#EBEBEB)` background. These colors were designed for chip backgrounds, not as text on grey:

| Text color | On surface2 (#EBEBEB) | Font size | WCAG threshold | Status |
|------------|----------------------|-----------|----------------|--------|
| rarity.common (#94A3B8) | **2.15:1** | 40pt bold (large) | ≥3:1 | ✗ FAIL |
| rarity.uncommon (#16A34A) | **2.76:1** | 40pt bold (large) | ≥3:1 | ✗ FAIL |
| rarity.rare (#4F46E5) | **5.27:1** | 40pt bold (large) | ≥3:1 | AA ✓ |
| rarity.glossy (#D97706) | **2.67:1** | 40pt bold (large) | ≥3:1 | ✗ FAIL |

> Large text (≥18pt regular or ≥14pt bold) requires minimum 3:1. Even at 40pt, common, uncommon and glossy fail.

Additionally, rarity colors as labels elsewhere:

| Pair | Ratio | Context | Status |
|------|-------|---------|--------|
| rarity.common (#94A3B8) on bg (#FFFFFF) | **2.56:1** | Any label use | ✗ FAIL |
| rarity.uncommon (#16A34A) on bg | **3.30:1** | Large text only | ⚠ LA (large text pass) |
| rarity.glossy (#D97706) on bg | **3.19:1** | Large text only | ⚠ LA (large text pass) |

### Type chip colours

All three `dark-text-on-colour-bg` type chips (Electric, Bug, Light) use `textColor: #0F172A`:

| Pair | Ratio | Status |
|------|-------|--------|
| #0F172A on Electric #EAB308 | **9.31:1** | AAA ✓ |
| #0F172A on Bug #84CC16 | **9.04:1** | AAA ✓ |
| #0F172A on Light #F59E0B | **8.31:1** | AAA ✓ |

All other type chips use white text on their respective colors. These need individual verification when a new type is added. Current set passes.

---

## Typography Audit

**Scale defined in `typography.ts`:** xs(12), sm(13), base(15), md(16), lg(18), xl(22), 2xl(28), 3xl(32), 4xl(40).

### Off-scale font sizes found (medium severity)

The following **hardcoded px values** appear in screen files instead of using tokens:

| File | Selector | Value | Should be |
|------|----------|-------|-----------|
| `src/app/(tabs)/index.tsx` | `screenTitle.fontSize` | `22` (hardcoded) | `typography.fontSize.xl` |
| `src/app/(tabs)/index.tsx` | `nickname.fontSize` | `15` (hardcoded) | `typography.fontSize.base` |
| `src/app/animon/[id].tsx` | `idLabel.fontSize` | `11` | no token (below xs=12 minimum) |
| `src/app/animon/[id].tsx` | `dataDate.fontSize` | `11` | no token |
| `src/app/animon/[id].tsx` | `noteKey.fontSize` | `11` | no token |
| `src/app/animon/[id].tsx` | `statLabel.fontSize` | `10` | no token (below xs=12 minimum) |
| `src/app/(tabs)/profile.tsx` | `statLabel.fontSize` | `10` | no token |
| `src/app/(tabs)/profile.tsx` | `rarityLegendText.fontSize` | `10` | no token |
| `src/app/(tabs)/profile.tsx` | `memberSince.fontSize` | `11` | no token |
| `src/app/(tabs)/logbook.tsx` | `rarityLabel.fontSize` | `10` | no token |

**The 10pt and 11pt values are below the minimum xs=12 token**, and below WCAG's practical guidance of ≥14px (≈10.5pt) for body text, ≥12px for secondary labels. At 10pt, text3 (#5E5E5E) on white is 6.48:1 which technically passes, but legibility at that size on mobile is poor regardless of contrast.

### Body text size

- Body text (`base: 15`) is used consistently across Party, Collection, Profile for main content. Acceptable.
- The typography token scale has two near-identical sizes: `base: 15` and `md: 16` (that's only 1pt difference). This creates an ambiguous pair that teams use inconsistently — Party body uses base (15) while Onboarding uses md (16).

### Line heights

- Headings use `lineHeight.tight (1.1)` on large sizes (3xl, 2xl) — appropriate ✓
- Body text at 16pt uses `1.65` in onboarding and `1.5` in profile body — both acceptable ✓
- `bodyMedium` at 15pt in party tab omits lineHeight entirely — will default to system (typically ~1.2), which is tight for multi-line text

### Heading hierarchy

- The tab wordmark → screenTitle pattern (ANÍLOG → screen name) is consistent on Party and Collection ✓
- Logbook and Profile deviate — Profile has no wordmark in the hero zone, and Logbook's wordmark/title contrast fails (see above)

---

## Spacing & Layout (Refactoring UI §2)

### What is working

- `scrollContent: { padding: 16, gap: 14 }` in Party tab creates consistent inset. ✓
- Cards use `padding: 16` throughout — consistent and generous. ✓
- Section rules in Logbook provide clear visual separation. ✓
- Filter bar in Collection is properly contained with `paddingHorizontal: 6-8`. ✓

### Issues

- **Empty slot cards**: use `borderStyle: 'dashed'` which does **not render on React Native Web**. On web the dashed style falls back to solid or disappears entirely (depending on the browser). Screenshot `01-party-tab.png` will show this.

- **Party card height**: CARD_PHOTO_SIZE=72 + padding 16×2 = 104pt minimum. With typeRow, actual card is ~116–120pt. This is comfortable for finger interaction ≥44pt. ✓

- **Onboarding step indicator dots**: `gap: 8` between dots creates adequate touch spacing, but the dots themselves (width: 8, height: 8) are decorative and not individually tappable — acceptable.

- **Animon hero height** is 280pt (hardcoded `HERO_HEIGHT`). The overlap `marginTop: HERO_HEIGHT - 28 = 252` on the sheet means 28pt of the sheet is behind the hero. The sheet handle (40×4pt) is close to invisible at that size.

- **Collection grid gap**: `COLUMN_GAP: 12, SIDE_PAD: 16` with 2-col — adequate breathing room ✓

- **Profile stat strip** uses `marginTop: -1` which overlaps the heroZone border. This is intentional (flush join) but brittle — 1px rendering differences across platforms can cause visual glitches.

---

## Visual Hierarchy (Refactoring UI §1)

### Party Tab
- **Species name is NOT the hero text.** The nickname is displayed in `bodySemiBold 15pt text1` and the species in `mono 13pt text2`. Both sizes are very close (15 vs 13). For a wildlife collecting app, the species name is arguably more informative than the nickname — the hierarchy should be inverted or at least differentiated more strongly (species at md/16 bold, nickname at sm/13).
- Level badge is correctly de-emphasised (xs, surface2 bg, text2) ✓
- Empty slot "+" text using `fontSize: 28, color: text3` — good contrast, visible placeholder ✓
- Screenshot: `_rodjar/screenshots/01-party-tab.png`

### Collection Tab
- Grid establishes clear visual order via consistent card sizing. ✓
- Filter chips use `letterSpacing: widest` on uppercase — readable as labels ✓
- Empty state is clean and directs to the primary action ✓
- Screenshot: `_rodjar/screenshots/02-collection-tab.png`

### Camera Screen
- **PRIMARY ACTION is clear:** `START SCANNING` button is the dominant element in the control panel when `captureState === 'idle'`. ✓
- But the button has no explicit style shown in the excerpts I can access — the `startBtn` style definition was beyond our reading range. The visual weight is implied structurally but not verified from code.
- Reticle corners use `color: '#FFFFFF'` on a dim overlay — this is a hardcoded value, not using `textInverse`. Minor consistency issue.
- The `closeBtn` background is `rgba(255,255,255,0.08)` — the close affordance is nearly invisible on a dark overlay. WCAG requires ≥3:1 for non-text interactive elements.

---

## Component-by-Component Issues

### PARTY TAB (`src/app/(tabs)/index.tsx`)

**[Party] — EmptyCard border style — Severity: Medium**
- What: `borderStyle: 'dashed'` on emptyCard and emptyPhotoPlaceholder. Dashed borders do not render in React Native Web and degrade inconsistently across RN versions.
- Why: Violates Refactoring UI §6 (images/icons/decorative elements must work across platforms). Creates visual inconsistency between native and web.
- Fix: Replace dashed with a solid border at reduced opacity (`borderColor: colors.border, opacity: 0.6`) or use a `border-dashed` SVG background pattern.

**[Party] — Species vs nickname hierarchy — Severity: Medium**
- What: nickname (15pt, semibold, text1) and species (13pt, mono, text2) are only 2pt apart and the nickname is primary. For a wildlife app the species name is the critical identifier.
- Why: Violates Refactoring UI §1 (Visual Hierarchy — "not everything can be important"). Two near-equal sizes compete.
- Fix: Swap scale: species at `typography.fontSize.base (15)` bodySemiBold text1; nickname at `typography.fontSize.sm (13)` body text2 beneath it. Or make species the first line at `md (16)` bold, nickname smaller and muted below.

**[Party] — Hardcoded font values — Severity: Low**
- What: `screenTitle: { fontSize: 22 }` and `nickname: { fontSize: 15 }` are hardcoded values. They happen to match tokens `xl` and `base` but do not reference them.
- Why: Violates token discipline — future rebase of typography scale won't update these.
- Fix: Replace with `typography.fontSize.xl` and `typography.fontSize.base` respectively.

---

### COLLECTION TAB (`src/app/(tabs)/anilog.tsx`)

**[Collection] — Active filter chip contrast margin — Severity: Low**
- What: Active chip text uses `accent (#2563EB)` on `accentSoft (#EFF6FF)` = **4.75:1** at `xs` font (12pt). Passes WCAG AA by only 0.25:1.
- Why: Refactoring UI §4 (Color) requires margins to handle future adjustments.
- Fix: Increase active chip text contrast by using `accentDeep (#1D4ED8)` for text instead of `accent`. `#1D4ED8` on `#EFF6FF` = approximately 6.0:1.

---

### LOGBOOK/STAMPS TAB (`src/app/(tabs)/logbook.tsx`)

**[Logbook] — CRITICAL: screenTitle invisible (white on white) — Severity: High (WCAG ✗)**
- What: `screenTitle` style uses `color: colors.textInverse` (#FFFFFF) on `backgroundColor: colors.navDark` (#FAFAFA). Contrast = **1.04:1**. The "Stamps" heading is invisible.
- Why: `navDark` was changed to #FAFAFA in v5 but this screen was not migrated. Violates WCAG 1.4.3 (minimum contrast 4.5:1). Refactoring UI §4 §1.
- Fix: Change `screenTitle.color` to `colors.text1` and `header.backgroundColor` to `colors.bg` — matching the Party and Collection header pattern.

**[Logbook] — rarity count contrast failures — Severity: High (WCAG ✗)**
- What: `rarityCount` uses `color: colors.rarity[r.rarity]` as text on `surface2 (#EBEBEB)` background. At `typography.fontSize['4xl']` (40pt bold), WCAG requires ≥3:1 for large text. common=2.15:1, uncommon=2.76:1, glossy=2.67:1 — all fail.
- Why: Rarity colors were designed as chip backgrounds, not text foregrounds on grey. Violates WCAG 1.4.3. Refactoring UI §4.
- Fix: Rarity counts should use `colors.text1` for the number, with the rarity color applied only to a small colored swatch/badge beside it. Alternatively: display the counts on a white `bg` background (`rarityCell: backgroundColor: colors.bg`) — common at 2.56:1 still fails but rare and uncommon would improve; best to use text1 (#111111) for all count digits.

**[Logbook] — Platinum tier color — Severity: Medium**
- What: `TIER_COLORS.Platinum = '#E5E4E2'`. On achievement card background `surface (#F5F5F5)`, this is extremely low contrast: #E5E4E2 on #F5F5F5 ≈ **1.1:1**. The Platinum accent stripe is essentially invisible.
- Why: Refactoring UI §5 (Depth) — accent stripe purpose is to signal tier at a glance. At 1.1:1 it fails entirely.
- Fix: Change Platinum to a mid-grey or silver metallic like `#9CA3AF` (tailwind gray-400) which has adequate contrast on surface; or border-based treatment.

**[Logbook] — `rarityLabel` font size 10 — Severity: Low**
- What: `rarityLabel: { fontSize: 10 }` — below the minimum xs=12 token.
- Why: Violates typography system constraints. Refactoring UI §3 (Typography — "avoid font weights/sizes that become unreadable").
- Fix: Change to `typography.fontSize.xs` (12). Also change `letterSpacing: 1` to use a token.

---

### PROFILE TAB (`src/app/(tabs)/profile.tsx`)

**[Profile] — username visible only with overlay (fragile) — Severity: High**
- What: `username` is `textInverse` (#FFFFFF) on `navDark` (#FAFAFA) hero. The overlay (`colors.overlayDark = rgba(0,0,0,0.55)`) produces a blended background of approximately #717171, giving ~4.88:1. This passes AA — but it depends 100% on the overlay rendering. Without the overlay (say, if conditional rendering changes), the username reverts to 1.04:1.
- Why: Structural fragility. The intent is clearly a dark hero with light text, but the base token is wrong. Violates Refactoring UI §4 — relying on a stacked effect to achieve contrast instead of proper tokens.
- Fix: Either define `heroDark: '#1A1A2E'` (or similar) as a dedicated dark hero token, or set `heroZone.backgroundColor: '#1A1A2E'` directly. Then `textInverse` has proper contrast without depending on overlay.

**[Profile] — memberSince barely readable — Severity: High (WCAG ✗)**
- What: `memberSince: color: 'rgba(255,255,255,0.55)'`. On the blended ~#717171 background, semi-transparent white resolves to approximately #B6B6B6 on #717171 = **2.41:1**. Fails WCAG AA. Hardcoded rgba value bypasses the design token system entirely.
- Why: Violates WCAG 1.4.3. Refactoring UI §4. Also violates token discipline.
- Fix: Use `colors.text3` or a dedicated `textMuted: 'rgba(255,255,255,0.70)'` token that achieves ≥4.5:1 on #717171 (minimum value: ≈ rgba(255,255,255,0.72) for 4.5:1).

**[Profile] — checkmark icon invisible — Severity: High (WCAG ✗)**
- What: Achievement checkmark uses `textInverse` (#FFFFFF) on `navDark` (#FAFAFA) = **1.04:1**. The ✓ mark is invisible.
- Why: Same navDark token misuse. WCAG 1.4.11 (non-text contrast ≥3:1 for UI components).
- Fix: Change `checkmark.backgroundColor` to `colors.accent` and keep `checkmarkText: colors.textInverse` → 5.17:1. ✓

**[Profile] — upgrade banner invisible — Severity: Medium**
- What: LinearGradient uses `[colors.navDark, colors.bezel, colors.navDark]` = `[#FAFAFA, #FFFFFF, #FAFAFA]`. This gradient from near-white to white to near-white is visually indistinguishable from the page background. The premium Anílog+ banner is lost.
- Why: Refactoring UI §4 — "Design in grayscale first. Add color last." Without a contrasting surface, the section has no visual weight.
- Fix: Use a meaningful gradient like `[colors.accentSoft, #FFFFFF]` or give the banner a distinct `backgroundColor: colors.surface` with an `accent` border. The upgrade CTA is the app's monetisation lever — it must be visible.

**[Profile] — sub-token font sizes — Severity: Low**
- What: `statLabel: { fontSize: 10 }`, `rarityLegendText: { fontSize: 10 }`, `memberSince: { fontSize: 11 }` — all below the minimum `xs: 12` in `typography.ts`.
- Why: Violates typography token system. Refactoring UI §3.
- Fix: All should use `typography.fontSize.xs` (12) at minimum.

---

### ONBOARDING (`src/app/onboarding.tsx`)

**[Onboarding] — Ghost button affordance — Severity: Medium**
- What: `ghostBtn` has no border and no background — it renders as plain text. In RN web this renders fine; on mobile the tap target depends solely on text hit area. At `sm/xs` label sizes this could be <44pt tap height.
- Why: Refactoring UI §2 (Spacing & Sizing — tap targets ≥44pt). WCAG 2.5.5 (Target Size).
- Fix: Add a minimum `minHeight: 44` to `ghostBtn` style. Optionally add a subtle `borderBottomWidth: 1, borderBottomColor: colors.border` to give it a hint of affordance — it sits below a primary button and needs to be visually secondary without disappearing.

**[Onboarding] — Step 3 disabled button opacity — Severity: Low**
- What: `btnDisabled: { opacity: 0.4 }` applied to the primary button when no starter selected. The disabled button text (`textInverse` #FFFFFF on accent + 0.4 opacity over white) effectively becomes rgba(255,255,255,0.4) on rgba(37,99,235,0.4) blend over white. Hard to predict reliably.
- Why: Refactoring UI §4 — opacity should not be used as the sole accessibility signal for disabled state.
- Fix: Set disabled state explicitly: `backgroundColor: colors.surface2, color: colors.text3` rather than opacity-based.

**[Onboarding] — Step 4 input missing active/focus state — Severity: Low**
- What: The `TextInput` style only defines a border. No focused border colour is specified. On web this renders a simple grey box with no focus ring — significant accessibility and UX regression.
- Why: Refactoring UI §1 — interactive states must be distinct. WCAG 2.4.7 (Focus Visible).
- Fix: Add `selectionColor: colors.accent` (already partially handled by RN default). Wrap in a custom focused state using `onFocus`/`onBlur` to toggle `borderColor: colors.accent`.

---

### ANIMON DETAIL (`src/app/animon/[id].tsx`)

**[Detail] — Sub-token font sizes — Severity: Medium**
- What: `idLabel`, `dataDate`, `noteKey` all use `fontSize: 11`. `statLabel` uses `fontSize: 10`. These are below the minimum `xs: 12` token.
- Why: Refactoring UI §3 (Typography). Minimum legible label size for mobile is 12pt/16px.
- Fix: Raise all to `typography.fontSize.xs` (12). `statLabel` specifically should use xs, as it is metadata for a key metric.

**[Detail] — heroBreed uses hardcoded rgba — Severity: Low**
- What: `heroBreed: color: 'rgba(245,240,232,0.80)'` — is a hardcoded rgba value not in the token system.
- Why: Token discipline violation. Refactoring UI §4.
- Fix: Add a `textInverseMuted` token to `colors.ts` (e.g., `rgba(255,255,255,0.75)`) and reference it here.

**[Detail] — Capture notes duplicate data — Severity: Low (UX)**
- What: The "stats 2×2 grid" shows CONFIDENCE and CAUGHT, and then the "capture notes card" shows the same CONFIDENCE and CAPTURED plus REGION which also appears in `dataDate`. Three places show capture date.
- Why: Information density without hierarchy. Refactoring UI §1 — de-emphasise repetition.
- Fix: Remove the stats grid CONFIDENCE and CAUGHT entries (or merge the stats grid into the notes card). Keep species-specific stats in the grid (GENDER, COLOUR) and all capture metadata in notes.

---

### CAMERA SCREEN (`src/app/camera.tsx`)

**[Camera] — closeBtn affordance — Severity: Medium**
- What: Close button background is `rgba(255,255,255,0.08)` — the button is barely visible on the camera overlay. Touch target is 32×32pt which is below WCAG 2.5.5 minimum of 44pt.
- Why: WCAG 2.5.5 (Target Size). Refactoring UI §2.
- Fix: Increase to `width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.45)'`.

**[Camera] — Hardcoded white on reticle — Severity: Low**
- What: Reticle corners use `borderColor: '#FFFFFF'` and scan line `backgroundColor: '#FFFFFF'` instead of `colors.textInverse`.
- Why: Token discipline. If palette ever gains a true dark mode these will not update.
- Fix: Replace with `colors.textInverse`.

---

## What Is Working Well

1. **Token correctness on text1/text2** — The main text tokens are solid: 18.88:1 and 7.46:1 on white, AAA on all surfaces.
2. **Type chip system** — The electrically-dark types (Electric, Bug, Light) use a dark text color (`#0F172A`) yielding 9.31:1, 9.04:1, 8.31:1. Excellent.
3. **Party card layout rhythm** — 16px padding throughout, 14px gap between cards, 40px bottom padding. The spacing is consistent and hierarchy (nickname > species > type chips) is structurally correct even if the size delta is small.
4. **Onboarding animation** — The spring animation on starterCard selection (`scale: 1→1.03`) is a tasteful microinteraction. The entrance animation on step 4 (`cardOpacity` + `cardTranslateY`) provides clear forward motion.
5. **Camera reticle** — Four-corner bracket reticle with convergence animation on lock-on is a strong, purposeful UI pattern that communicates the scanner metaphor without clutter.
6. **Collection filter bar** — Horizontal scrolling filter chips with type-colour borders on active state are effective and consistent with the type system.
7. **Rarity rare (#4F46E5) on surface2** — 5.27:1 — The indigo rare color is the only rarity that passes when used as text, and it passes with meaningful margin.
8. **Accent on accentSoft** — 4.75:1 — Passes WCAG AA. Tight but valid.
9. **Progress dots in onboarding** — Clear active (wide blue), done (medium grey), inactive (surface2) differentiation using width as well as color, so not color-only signalling.
10. **Screen title sizes** — 3xl (32pt) for Stamps, xl (22pt) for Party/Collection, 2xl (28pt) for Profile username — creates appropriate size hierarchy between tabs.

---

## Priority Fix List (Top 5)

### #1 — Logbook header: white-on-white screen title
**File:** [src/app/(tabs)/logbook.tsx](src/app/(tabs)/logbook.tsx)  
**Lines:** `header.backgroundColor` (~L181) and `screenTitle.color` (~L189)  
**Fix:** `header.backgroundColor` → `colors.bg`; `screenTitle.color` → `colors.text1`; `specimenBadge` border → `colors.border`  
**Why:** White on white (1.04:1) — "Stamps" heading is invisible. WCAG 1.4.3 critical failure.

### #2 — Profile checkmark visible-invisible bug  
**File:** [src/app/(tabs)/profile.tsx](src/app/(tabs)/profile.tsx)  
**Lines:** `checkmark.backgroundColor` and `checkmarkText.color` (~L403–L410)  
**Fix:** `checkmark.backgroundColor` → `colors.accent`; `checkmarkText.color` → `colors.textInverse`  
**Why:** Current navDark bg with textInverse text = 1.04:1. Same applies to logbook.tsx checkmark (~L291–298). Achievement completion markers are invisible.

### #3 — Logbook rarity count colors fail WCAG large-text threshold  
**File:** [src/app/(tabs)/logbook.tsx](src/app/(tabs)/logbook.tsx)  
**Lines:** `rarityCount` style and the inline `color: colors.rarity[r.rarity]` on `rarityCell` (~L105–L120)  
**Fix:** Remove the dynamic rarity color from the count number. Use `color: colors.text1` for the digit. Apply rarity color only to the `RarityBadge` component beside it.  
**Why:** common=2.15:1, uncommon=2.76:1, glossy=2.67:1 — all fail WCAG 1.4.3 large-text (3:1 minimum).

### #4 — Profile memberSince hardcoded rgba fails contrast  
**File:** [src/app/(tabs)/profile.tsx](src/app/(tabs)/profile.tsx)  
**Lines:** `memberSince.color` (~L268): `'rgba(255,255,255,0.55)'`  
**Fix:** Minimum safe opacity for white on the blended hero is ≈0.72. Change to `'rgba(255,255,255,0.80)'` or add `textInverseMuted: 'rgba(255,255,255,0.80)'` to colors.ts and reference it here.  
**Why:** At 55% opacity, contrast ≈2.41:1, fails WCAG AA. 80% opacity gives ~3.6:1 (passes large text, borderline normal).

### #5 — Profile upgrade banner invisible against page  
**File:** [src/app/(tabs)/profile.tsx](src/app/(tabs)/profile.tsx)  
**Lines:** `upgradeBanner` LinearGradient colors (~L235): `[colors.navDark, colors.bezel, colors.navDark]`  
**Fix:** Replace gradient with a solid `backgroundColor: colors.accentSoft`, add `borderWidth: 1, borderColor: colors.accent`, and add `borderRadius: 8`. Keep text and button as-is.  
**Why:** navDark→bezel gradient is near-white-to-white — visually identical to the page. The premium upsell banner must visually differentiate itself. This is the app's monetisation lever.

---

## WCAG Failures Summary

| Severity | Screen | Component | Token pair | Ratio | WCAG rule |
|----------|--------|-----------|------------|-------|-----------|
| Critical | Logbook | screenTitle | textInverse on navDark | **1.04:1** | 1.4.3 (AA) |
| Critical | Profile+Logbook | checkmarkText | textInverse on navDark | **1.04:1** | 1.4.3 + 1.4.11 |
| High | Logbook | rarityCount (common) | #94A3B8 on surface2 | **2.15:1** | 1.4.3 large text |
| High | Logbook | rarityCount (uncommon) | #16A34A on surface2 | **2.76:1** | 1.4.3 large text |
| High | Logbook | rarityCount (glossy) | #D97706 on surface2 | **2.67:1** | 1.4.3 large text |
| High | Profile | memberSince | rgba(fff,0.55) on hero~717 | **2.41:1** | 1.4.3 (AA) |
| Medium | Camera | closeBtn | touch target 32×32pt | n/a | 2.5.5 (target size) |
| Low | All | various labels | fontSize 10–11 (below xs:12) | n/a | 1.4.4 (resize text) |

---

## Screenshots Reference

| File | Description |
|------|-------------|
| [_rodjar/screenshots/01-party-tab.png](_rodjar/screenshots/01-party-tab.png) | Party tab — 6 slots, 1 filled (Biscuit seed) |
| [_rodjar/screenshots/02-collection-tab.png](_rodjar/screenshots/02-collection-tab.png) | Collection tab — empty state |
| [_rodjar/screenshots/03-logbook-tab.png](_rodjar/screenshots/03-logbook-tab.png) | Logbook/Stamps tab — **critical: check header** |
| [_rodjar/screenshots/04-profile-tab.png](_rodjar/screenshots/04-profile-tab.png) | Profile tab — hero zone with overlay |
| [_rodjar/screenshots/05-onboarding.png](_rodjar/screenshots/05-onboarding.png) | Onboarding step 1 |
