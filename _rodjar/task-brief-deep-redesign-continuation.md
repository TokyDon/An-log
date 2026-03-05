# Task Brief: Fix TypeScript Errors + Complete Remaining Screens
**Assigned to:** Frontend Developer  
**Priority:** BLOCKER  
**Date:** 2026-03-05  
**Branch:** `feature/deep-redesign-v2` (already exists, make sure you're on it)

---

## CONTEXT

The previous Frontend Developer pass updated components and the Discover screen but:
1. `index.tsx` was APPENDED instead of replaced — it now has duplicate variable declarations and duplicate default exports → TypeScript errors
2. 5 screens were NOT updated and still reference old colour tokens that no longer exist → more TypeScript errors
3. `anilog.tsx` references tokens like `scannerGreenLight`, `screenBg`, `textPrimary`, `textSecondary`, `amberReadout`, `surfacePanel`, `surfaceBorder`, `surfaceInset` that don't exist in the new colors.ts

**Your job is to fix ALL TypeScript errors and complete all remaining screens.**

---

## Token Migration Map (old → new)

Use this to fix all broken token references:

| Old token | New token |
|-----------|-----------|
| `colors.screenBg` | `colors.specimenCream` |
| `colors.surfacePanel` | `colors.parchment` |
| `colors.surfaceCard` | `colors.cardStock` |
| `colors.surfaceInset` | `colors.insetPanel` |
| `colors.surfaceBorder` | `colors.inkRule` |
| `colors.textPrimary` | `colors.inkBlack` |
| `colors.textSecondary` | `colors.inkBrown` |
| `colors.textMuted` | `colors.inkFaded` |
| `colors.textInverse` | `colors.inkInverse` |
| `colors.textReadout` | `colors.inkAmber` |
| `colors.amberReadout` | `colors.inkAmber` |
| `colors.amberAccent` | `colors.amberResin` |
| `colors.scannerGreen` | `colors.forestFloor` |
| `colors.scannerGreenMid` | `colors.forestMid` |
| `colors.scannerGreenLight` | `colors.mossLight` |
| `colors.scannerGreenGlow` | `colors.amberGlow` |
| `colors.metalBrush` | `colors.instrumentBrass` |
| `colors.metalBrushLight` | `colors.instrumentBrassLight` |
| `colors.panelAmber` | `colors.amberDeep` |
| `colors.amberGlow` | `colors.amberGlow` (unchanged) |
| `colors.panelAmber` | `colors.amberDeep` |
| `colors.inkDark` | `colors.inkBlack` |
| `colors.inkMid` | `colors.inkBrown` |

---

## TASK 1 — Fix index.tsx (duplicate code)

Read the FULL contents of `src/app/(tabs)/index.tsx`. You will find the file contains TWO complete implementations appended together (starting around line 290+). 

**Fix:** Keep ONLY the NEW implementation (the second one, which uses `forestFloor`, `specimenCream`, `inkBlack` etc. and has the new `safeArea` / `header` style sheet). DELETE the first/old implementation.

The file should have exactly ONE `export default function HomeScreen()` and ONE `const styles = StyleSheet.create(...)`.

---

## TASK 2 — Update remaining 5 screens

For each screen, read its current content, then rewrite it using:
- The new colour tokens from the migration map above
- The design-spec-v2.md screen descriptions (`c:\Users\james\Documents\VS Code\Anílog\_rodjar\design-spec-v2.md`)
- The same naturalist/device aesthetic as implemented in the updated components

### `src/app/(tabs)/anilog.tsx`
Many token errors — replace all old tokens using migration map. Also fix the EmptyState usage — look at the new EmptyState component props and use the correct prop names.

### `src/app/(tabs)/milestones.tsx`
Read current file. Update all colors to use new tokens. Ensure it fits the specimen/field journal aesthetic.

### `src/app/(tabs)/profile.tsx`
Read current file. Update all colors to use new tokens.

### `src/app/camera.tsx`
Read current file. Update all colors to use new tokens. Ensure the scanner/reticle aesthetic fits the field equipment device language from spec.

### `src/app/animon/[id].tsx`
Read current file. Update all colors to use new tokens. The detail view is important — specimen label should appear here too.

---

## TASK 3 — Verify TypeScript clean

```powershell
cd "C:\Users\james\Documents\VS Code\Anílog"
npx tsc --noEmit 2>&1
```

ALL errors must be resolved. If there are errors, fix them. Repeat until clean.

---

## TASK 4 — Verify web bundle

Start the dev server (background) and verify the web bundle compiles:
```powershell
cd "C:\Users\james\Documents\VS Code\Anílog"
# Kill any existing node processes first
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
```
Then start expo and check for "Web Bundled" in output.

---

## TASK 5 — Commit everything

```powershell
cd "C:\Users\james\Documents\VS Code\Anílog"
git add -A
git commit -m "feat: complete deep redesign v2 — fix TS errors, update all screens to naturalist tokens"
git push origin feature/deep-redesign-v2
```

---

## TASK 6 — Update BACKLOG.md

Add under the existing DEEP REDESIGN V2 entry:
```
CONTINUATION — [date]:
TypeScript: CLEAN (0 errors)
Web bundle: [X modules]
All screens updated: index, anilog, milestones, profile, camera, animon/[id]
Status: PENDING QA
```

---

## DO NOT

- Do NOT modify colors.ts or typography.ts — they are correct
- Do NOT modify AnimonCard.tsx, TabBar.tsx, RarityBadge.tsx, TypeTagChip.tsx, EmptyState.tsx — they are correct
- Focus ONLY on fixing TypeScript errors and completing the 5 remaining screens
