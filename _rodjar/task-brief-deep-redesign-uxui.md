# Task Brief: Deep Redesign — Proper Skill Invocation Required
**Assigned to:** UX UI Designer  
**Priority:** HIGH  
**Date:** 2026-03-05  
**Branch to target:** `feature/deep-redesign-v2`

---

## WHY THIS BRIEF EXISTS

The previous redesign produced a design that the product owner describes as "not professional", "generic", and having "weird UI quirks". The root cause was that agents did NOT follow their assigned skills. This must not happen again.

**You MUST invoke and follow the `interface-design` skill before writing a single line of spec.**

---

## MANDATORY PROCESS (non-negotiable)

### Step 1 — Read and follow the `interface-design` skill

The skill file is at: `c:\Users\james\.copilot\skills\interface-design\SKILL.md`

Read it in full. Follow it exactly. The skill requires you to produce four domain exploration outputs BEFORE any spec is written:

1. **Domain** — 5+ concepts, metaphors, vocabulary from the product's actual world (not features — territory)
2. **Color world** — What colors exist naturally in this domain? If this product were a physical space, what would you SEE? List 5+ actual colors from the real world of wildlife biology, field work, specimen cataloguing, naturalist archives, exploration hardware
3. **Signature** — ONE element that could ONLY exist for Anílog. Must be specific, testable. Not "warm tones" — an actual component decision unique to this product
4. **Defaults** — Name 3 obvious choices you COULD make that would result in generic output. You must explicitly replace each one

This is NOT optional. If you skip it you will produce generic output.

### Step 2 — Run all four tests against your spec before writing it down

- **Swap test:** If you swapped your typeface for a generic one, would it feel meaningfully different?
- **Squint test:** Blur your eyes. Does hierarchy still hold? Does anything jump out harshly?
- **Signature test:** Can you point to FIVE specific components where your signature appears? Not overall feel — actual components
- **Token test:** Read your colour token names out loud. Do they sound like they came FROM this product's world?

### Step 3 — Also invoke the `refactoring-ui` skill

File at: `c:\Users\james\.copilot\skills\refactoring-ui\SKILL.md`

Use the visual hierarchy, spacing, and typography principles to validate your spec. Pre-score your spec 0–10 against the seven principles. Target 9+.

### Step 4 — Also invoke the `microinteractions` skill

File at: `c:\Users\james\.copilot\skills\microinteractions\SKILL.md`

Define at least 3 specific microinteractions for the app that reinforce the physical device metaphor.

---

## CONTEXT — What Exists and What Must Change

### Existing codebase
- React Native + Expo SDK 55, TypeScript strict, expo-router v3
- `src/app/(tabs)/` — Discover, Anilog, Milestones, Profile
- `src/app/camera.tsx` — camera capture screen
- `src/app/animon/[id].tsx` — detail view
- `src/components/ui/AnimonCard.tsx` — collectible card component
- `src/components/layout/TabBar.tsx` — custom tab bar
- `src/constants/colors.ts` — existing token system (may be replaced)
- `src/constants/typography.ts` — Playfair Display + Space Mono + DM Sans

### What the existing design FAILS at (product owner feedback)
- "Doesn't look very professional"
- "A number of weird UI quirks"
- "Looks very generic"
- The skeuomorphic intent is present in names/comments but NOT visible in the actual rendered interface
- It looks like colored boxes with basic React Native layouts — not a crafted physical device experience

### What this app IS
- "Catch them for real" — real-world animal discovery app
- Player scans animals they see in the wild using their camera
- Animals become collectibles in their personal log ("Anílog")
- Think: naturalist field journal + collectible cards + augmented reality scanning device
- Target user: curious outdoor person, nature lover, someone who finds actual animals exciting

---

## DELIVERABLE

Write a comprehensive design spec to `_rodjar/design-spec-v2.md`.

The spec MUST include:
1. Evidence of the domain exploration (all 4 required outputs from the interface-design skill)
2. The four test results (swap/squint/signature/token)
3. Pre-score against refactoring-ui principles (target 9+)
4. Full colour system (replace `src/constants/colors.ts`)
5. Full typography system (can keep existing fonts if they pass the swap test, but justify them)
6. Detailed component spec for EACH of the following:
   - `AnimonCard` (both compact and full variants) — this is the HERO component, push hardest here
   - `TabBar` — must feel like physical device hardware
   - `RarityBadge` — must feel stamped/embossed, not just a pill
   - `TypeTagChip` — must feel inset/recessed
   - Screen-level layout spec for: Discover, My Anílog, Camera, Detail view
7. At least 3 microinteraction definitions
8. Named defaults (things you explicitly rejected and why)

---

## DO NOT

- Do NOT just rename the existing spec. Produce genuinely new work after deep domain exploration
- Do NOT describe the design in generic terms ("clean", "modern", "professional") — every claim must be specific
- Do NOT produce output another AI would produce for the same prompt
- Do NOT write implementation code — spec only

---

## UPDATE BACKLOG

After completing the spec, add an entry to `_rodjar/BACKLOG.md`:
```
## DESIGN SPEC V2 — [date]
Status: SPEC COMPLETE — awaiting Frontend Developer implementation
Skill adherence: [confirm all 3 skills were invoked]
Domain exploration: [confirm all 4 outputs produced]
Pre-score: [X/10]
```
