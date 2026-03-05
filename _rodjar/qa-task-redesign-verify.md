# QA Verification Task: Skeuomorphic Redesign

**Assigned by:** Rodjar  
**Date:** 2026-03-05  
**Branch:** `feature/skeuomorphic-redesign`  
**Design Spec:** `_rodjar/design-spec-skeuomorphic.md`

---

## Your Role

Verify the Frontend Developer has implemented the skeuomorphic redesign correctly and completely, and that no regressions have been introduced. Do NOT fix issues yourself — document them precisely so the Developer can fix and you can re-verify.

## Verification Checklist

### 1. Confirm on correct branch and web bundles clean
```powershell
cd "C:\Users\james\Documents\VS Code\Anílog"
git branch
npx expo export --platform web 2>&1 | Select-String "error|Error|ERROR|Bundled" | Select-Object -First 10
```
Must show `* feature/skeuomorphic-redesign` and `Web Bundled Xms`.

### 2. TypeScript compilation check
```powershell
npx tsc --noEmit 2>&1 | Select-Object -First 30
```
Report any TypeScript errors. Minor type warnings are acceptable. Missing types on new APIs are a medium issue.

### 3. Design token audit — read `src/constants/colors.ts`
Verify:
- Old tokens (`primary`, `accent`, `background`, `surface`) are either kept as aliases OR all references in screens have been updated
- New tokens from spec are present: `deviceBody`, `screenBg`, `amberReadout`, `scannerGreen`, `surfaceCard`, `surfacePanel`, `rarity.*`
- No hardcoded hex colors in component files (spot check 3 components)

### 4. Typography audit — read `src/constants/typography.ts`
Verify:
- Space Mono added as `fontFamilies.mono` (data readout)
- Playfair Display added as `fontFamilies.heading` OR `fontFamilies.species`
- DM Sans still present as body font

### 5. Carousel height fix — read `src/components/ui/AnimonCard.tsx`
THIS IS A REQUIRED BUG FIX. Verify:
- Compact card variant has explicit `height: 140` (or spec-defined fixed height)
- Height is enforced on BOTH the outer wrapper AND inner container (not just one)
- No `flexGrow` or dynamic sizing that would allow height variation

### 6. Component depth checks — read each file:
- `src/components/ui/AnimonCard.tsx` — has `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`, `elevation` for raised card effect
- `src/components/ui/RarityBadge.tsx` — has embossed/badge styling
- `src/components/ui/TypeTagChip.tsx` — has inset panel styling
- `src/components/layout/TabBar.tsx` — has device-style physical button appearance

### 7. Screen spot checks — read each file and check for:
- `src/app/(tabs)/index.tsx` — dark device body background, amber/green readout tones on stats chips
- `src/app/(tabs)/anilog.tsx` — type filter chips use inset style
- `src/app/camera.tsx` — scanner reticle has device aesthetic
- `src/app/animon/[id].tsx` — detail stats use Space Mono / monospace for data

### 8. Font loading check — read `src/app/_layout.tsx`
Verify Space Mono and Playfair Display fonts are loaded alongside DM Sans.

### 9. No regressions check
Verify these features still exist and haven't been accidentally removed:
- Mock data still imported and displayed on Discover screen
- 12 animons in My Anílog grid
- Type filter on My Anílog screen still has working filter chips
- Milestones achievements still show locked/unlocked states
- Profile screen still has Anílog+ banner

## Reporting

Create `_rodjar/qa-redesign-findings.md` with:

### PASS items
List what was verified correctly.

### FAIL items (if any)
For each failure, document:
- File and approximately what line
- What was expected (from spec)
- What was found instead
- Severity: BLOCKER / HIGH / MEDIUM / LOW

### Verdict
- **PASS** — ready to merge
- **CONDITIONAL PASS** — passes with listed LOWs acceptable, MLEDIUMs must be fixed
- **FAIL** — BLOCKERs or multiple HIGHs found, needs Developer rework

Update Agent Coordination Log in `_rodjar/BACKLOG.md`.
