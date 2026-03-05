# Task Brief: Implement Deep Redesign V2
**Assigned to:** Frontend Developer  
**Priority:** HIGH  
**Date:** 2026-03-05  
**Branch:** `feature/deep-redesign-v2` (create from main if it doesn't exist)

---

## MANDATORY PROCESS

### Step 1 — Read the refactoring-ui skill FIRST

File: `c:\Users\james\.copilot\skills\refactoring-ui\SKILL.md`

Read it in full. This skill gives you a 0–10 scoring framework across seven principles. Your implementation MUST score 9+/10. You must explicitly score your work before committing.

The seven principles to score against:
1. Visual Hierarchy
2. Spacing & Sizing
3. Typography
4. Color
5. Shadows & Depth
6. Borders
7. Components & Patterns

### Step 2 — Read the design spec

File: `c:\Users\james\Documents\VS Code\Anílog\_rodjar\design-spec-v2.md`

Read it in FULL before writing any code. The spec has been produced by the UX/UI Designer with proper domain exploration. Follow it precisely.

---

## YOUR TASKS

### 1. Create feature branch
```powershell
cd "C:\Users\james\Documents\VS Code\Anílog"
git checkout main
git pull
git checkout -b feature/deep-redesign-v2
```

### 2. Replace the colour system

Replace `src/constants/colors.ts` with the FULL colour system from the spec. Use the exact token names and hex values specified. Do not invent new tokens or keep old ones not in the spec.

### 3. Replace the typography system

Update `src/constants/typography.ts` per the spec. The spec may confirm existing fonts or change them — follow spec exactly.

### 4. Implement ALL component redesigns

Work through each component spec in the design-spec-v2.md:

**`src/components/ui/AnimonCard.tsx`** — The HERO component. The "Typed Specimen Label Strip" signature element MUST appear here. This is the single most important component. Do not rush it. Full variant AND compact variant must both be implemented.

**`src/components/layout/TabBar.tsx`** — Physical device hardware feeling. Follow spec precisely.

**`src/components/ui/RarityBadge.tsx`** — Stamped/embossed feeling.

**`src/components/ui/TypeTagChip.tsx`** — Inset/recessed feeling.

**`src/components/ui/EmptyState.tsx`** — Follow spec.

### 5. Implement ALL screen redesigns

Work through each screen spec:
- `src/app/(tabs)/index.tsx` — Discover
- `src/app/(tabs)/anilog.tsx` — My Anílog  
- `src/app/(tabs)/milestones.tsx` — Milestones
- `src/app/(tabs)/profile.tsx` — Profile
- `src/app/camera.tsx` — Camera screen
- `src/app/animon/[id].tsx` — Detail view

### 6. Score your implementation

After implementing, score your output 0–10 against all seven refactoring-ui principles. Write the score in a comment at the top of `src/constants/colors.ts`. Target 9+. If you score below 9, identify and fix the lowest-scoring areas before committing.

### 7. Run TypeScript check

```powershell
cd "C:\Users\james\Documents\VS Code\Anílog"
npx tsc --noEmit 2>&1
```

Fix ALL TypeScript errors before committing.

### 8. Verify web bundle starts

```powershell
# Kill any existing processes
Get-Process -Name "node","ngrok" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
# Start web server
cd "C:\Users\james\Documents\VS Code\Anílog"
```
Start the server in background and verify bundle compiles (look for "Web Bundled" output).

### 9. Commit

```powershell
git add -A
git commit -m "feat: deep redesign v2 — specimen label signature, domain-grounded tokens"
git push -u origin feature/deep-redesign-v2
```

---

## QUALITY STANDARDS

- Every StyleSheet value must be traceable to a token in `colors.ts` or `typography.ts` — NO inline hex strings
- No magic numbers for spacing — use a constrained scale (4, 8, 12, 16, 20, 24, 32, 48, 64)
- No emojis as UI elements — use proper SVG icons or text characters from the domain world
- The "specimen label" signature must be visibly present in AnimonCard
- The "physical device" feel must be visible in the TabBar (not just colored boxes)

---

## DO NOT

- Do NOT keep any styles from the previous implementation if they conflict with the spec
- Do NOT add features or new screens not in scope
- Do NOT commit with TypeScript errors
- Do NOT skip the refactoring-ui scoring step

---

## UPDATE BACKLOG

After committing, update `_rodjar/BACKLOG.md`:
```
## DEEP REDESIGN V2 IMPLEMENTATION — [date]
Branch: feature/deep-redesign-v2
Commit: [hash]
Refactoring-UI score: [X/10]
TypeScript: CLEAN
Web bundle: [X modules]
Status: PENDING QA
```
