# Frontend Developer Task: Implement Skeuomorphic Redesign

**Assigned by:** Rodjar  
**Date:** 2026-03-05  
**Branch:** `feature/skeuomorphic-redesign` — you MUST be on this branch  
**Design Spec:** `_rodjar/design-spec-skeuomorphic.md` — read this IN FULL before touching any code

---

## Overview

Implement the full skeuomorphic visual redesign of the Anílog app as specified in the design spec. This is a visual/styling overhaul — the underlying data, navigation structure, and logic do NOT change. Mock data stays as-is.

## Before You Start

1. Confirm you are on the correct branch:
```powershell
cd "C:\Users\james\Documents\VS Code\Anílog"
git branch
```
Should show `* feature/skeuomorphic-redesign`. If not: `git checkout feature/skeuomorphic-redesign`

2. Read the full design spec: `_rodjar/design-spec-skeuomorphic.md`

3. Read current state of ALL files you will modify before editing them:
- `src/constants/colors.ts`
- `src/constants/typography.ts`  
- `src/components/ui/AnimonCard.tsx`
- `src/components/ui/RarityBadge.tsx`
- `src/components/ui/TypeTagChip.tsx`
- `src/components/layout/TabBar.tsx`
- `src/app/(tabs)/index.tsx`
- `src/app/(tabs)/anilog.tsx`
- `src/app/(tabs)/milestones.tsx`
- `src/app/(tabs)/profile.tsx`
- `src/app/camera.tsx`
- `src/app/animon/[id].tsx`
- `src/app/_layout.tsx`

## Implementation Order

### Step 1 — Install new fonts
The design spec calls for Space Mono (new) and Playfair Display (new). Install:
```powershell
npx expo install @expo-google-fonts/space-mono @expo-google-fonts/playfair-display
```

### Step 2 — Update design tokens
Update `src/constants/colors.ts` with the full new colour palette from the spec (all 25 named tokens). Keep backward-compatible exports where existing screens still reference old names initially.

Update `src/constants/typography.ts` with the new font system: Playfair Display (heading), DM Sans (body), Space Mono (data readout).

### Step 3 — Update `src/app/_layout.tsx`
Load the new fonts (Space Mono + Playfair Display) alongside existing DM Sans load.

### Step 4 — Rebuild all UI components
Implement the component patterns exactly as specced:
- `AnimonCard.tsx` — skeuomorphic card with raised shadow, inner bevel border, **fixed height on compact variant (height: 140)** to fix carousel inconsistency
- `RarityBadge.tsx` — embossed badge style
- `TypeTagChip.tsx` — inset panel style
- `TabBar.tsx` — device-style navigation with physical button feel

### Step 5 — Rebuild all 6 screens
Apply the skeuomorphic styling to all screens per the spec's Screen-by-Screen section:
- `src/app/(tabs)/index.tsx` — Discover screen
- `src/app/(tabs)/anilog.tsx` — My Anílog grid
- `src/app/(tabs)/milestones.tsx` — Milestones
- `src/app/(tabs)/profile.tsx` — Profile
- `src/app/camera.tsx` — Camera modal
- `src/app/animon/[id].tsx` — Animon detail

### Step 6 — Verify web build compiles clean
```powershell
npx expo export --platform web 2>&1 | Select-String "error|Error|ERROR|Bundled" | Select-Object -First 20
```
Must show "Web Bundled" with no errors.

### Step 7 — Commit to branch
```powershell
git add -A
git commit -m "feat: skeuomorphic redesign — BioField Scanner design language"
git push
```

### Step 8 — Update BACKLOG.md
Append to the Agent Coordination Log:
`| 2026-03-05 | Frontend Developer | Implement skeuomorphic redesign | ✅ Complete |`

---

## Critical Rules
- Stay on `feature/skeuomorphic-redesign` branch — do NOT commit to main
- Do NOT change navigation structure, data, or logic — styling only
- Do NOT remove mock data
- Fixed height on compact carousel cards is a required bug fix — enforce it
- All StyleSheet values must use the new colour tokens, not hardcoded hex
- Test that TypeScript compiles (no red underlines in key files)

## Hand Back to Rodjar
Report:
- All files changed
- Whether web build compiles clean
- Commit hash
- Any decisions you made that deviated from the spec (and why)
- Any new bugs found (add to BACKLOG.md Active Bugs)
