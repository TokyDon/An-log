# Developer Task: Fix QA Findings from Redesign (B-003, B-004, B-005)

**Assigned by:** Rodjar  
**Date:** 2026-03-05  
**Branch:** `feature/skeuomorphic-redesign`  
**QA Findings:** `_rodjar/qa-redesign-findings.md`

---

## Required Fixes (must all pass before merge)

### B-003 — `CameraTab.tsx` uses deleted colour tokens
**File:** `src/components/ui/CameraTab.tsx`  
**Problem:** References `colors.primary` which was removed in the redesign, causing TypeScript errors. This component is now a stale no-op — `TabBar.tsx` renders its own camera disc natively.  
**Fix:** Either:
- **Option A (preferred):** Delete `CameraTab.tsx` entirely if it is truly unused. Check no file imports it first:
  ```powershell
  grep -r "CameraTab" src/ --include="*.tsx" --include="*.ts"
  ```
  If unused → delete it and remove from `src/components/ui/index.ts` if listed there.
- **Option B:** If it IS still used somewhere, migrate `colors.primary` → `colors.scannerGreen` and any other deleted tokens to their new equivalents from `colors.ts`.

---

### B-004 — `EmptyState.tsx` uses deleted colour tokens  
**File:** `src/components/ui/EmptyState.tsx`  
**Problem:** References `colors.text.primary`, `colors.text.secondary`, `colors.primary` — all removed in redesign. This IS a live code path (shown on My Anílog grid when type filter returns no results).  
**Fix:** Read the file first, then migrate to new token equivalents:
- `colors.text.primary` → `colors.inkDark` (or equivalent dark text token from new palette)
- `colors.text.secondary` → `colors.inkMid` (or equivalent muted text token)
- `colors.primary` → `colors.scannerGreen`

Read `src/constants/colors.ts` to confirm the exact token names before making changes.

---

### B-005 — `animon/[id].tsx` species font size off-spec  
**File:** `src/app/animon/[id].tsx`  
**Problem:** `heroSpecies.fontSize: 32` — spec requires `typography.fontSize['3xl']` which is 36px.  
**Fix:** Change `heroSpecies.fontSize` from hardcoded `32` to `typography.fontSize['3xl']` (check the actual value in `typography.ts` first).

---

## Also fix these LOW priority items (B-006, B-007) while you're in the codebase

### B-006 — Glossy compact card missing explicit height on outer wrapper
**File:** `src/components/ui/AnimonCard.tsx`  
**Fix:** Add `height: 140` to the `glossyOuter` wrapper style alongside the existing `compactOuter` fix.

### B-007 — `RarityBadge.tsx` inline colour instead of token  
**File:** `src/components/ui/RarityBadge.tsx`  
**Fix:** Replace inline `'#C8BFA8'` with `colors.surfaceBorder` (confirm token name in colors.ts first).

---

## After Fixing

1. Run TypeScript check — must be clean:
```powershell
cd "C:\Users\james\Documents\VS Code\Anílog"
npx tsc --noEmit 2>&1 | Select-Object -First 20
```

2. Run web export — must be clean:
```powershell
npx expo export --platform web 2>&1 | Select-String "error|Error|Bundled" | Select-Object -First 10
```

3. Commit on the feature branch:
```powershell
git add -A
git commit -m "fix: QA feedback — B-003 CameraTab, B-004 EmptyState, B-005/6/7 token fixes"
git push
```

4. Update `_rodjar/BACKLOG.md` — add B-003–B-007 to the Resolved Bugs table.

## Hand Back to Rodjar
Report:
- Which option you chose for B-003 (delete or migrate)
- Exact token mappings used for B-004
- TypeScript check output (pass/fail)
- Web export output (pass/fail)
- Commit hash
