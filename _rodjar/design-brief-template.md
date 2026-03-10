# Anílog — Design Brief Template

**Rodjar: copy this file for every design dispatch. Fill in every section. Do not skip the contrast table.**

---

## Brief: [Design Task Name]

**Date:** [date]  
**Branch:** [branch name]  
**Scope:** [list of files to change]  
**Goal in one sentence:** [what the user will see differently]

---

## Step 0 — Pre-flight (Rodjar completes before dispatching)

- [ ] Read `refactoring-ui` skill
- [ ] Current `colors.ts` tokens documented below
- [ ] Contrast ratios calculated for ALL proposed changes
- [ ] `webapp-testing` skill available for screenshots

---

## Current Token Values (fill before dispatch)

```
bg:       [current value]
surface:  [current value]
surface2: [current value]
text1:    [current value]
text2:    [current value]
text3:    [current value]
accent:   [current value]
accentSoft: [current value]
```

---

## Proposed Changes — colors.ts ONLY (first commit)

| Token | Old value | New value | Contrast on bg | Contrast on surface | Contrast on surface2 | Pass? |
|-------|-----------|-----------|---------------|--------------------|--------------------|-------|
| text1 | | | :1 | :1 | :1 | ✅/❌ |
| text2 | | | :1 | :1 | :1 | ✅/❌ |
| text3 | | | :1 | :1 | :1 | ✅/❌ |
| accent text on accentSoft | | | :1 | — | — | ✅/❌ |
| textInverse on accent | | | :1 | — | — | ✅/❌ |

**All rows must show ✅ before the brief is dispatched.**

Minimum ratios: text1 ≥ 7.0:1 · text2 ≥ 4.5:1 · text3 ≥ 4.5:1 · textInverse on accent ≥ 4.5:1

---

## Screen-by-screen plan (one commit each)

After colors.ts is committed, take a screenshot baseline, then proceed:

| # | Screen file | Key changes | Screenshot after? |
|---|-------------|-------------|-------------------|
| 1 | colors.ts | Token definitions | ✅ baseline screenshot |
| 2 | | | ✅ screenshot |
| 3 | | | ✅ screenshot |
| 4 | | | ✅ screenshot |
| 5 | | | ✅ screenshot |

---

## Agent instructions

Paste the full UX designer dispatch prompt below this line.

### Rules the agent MUST follow
1. Read each file in full before editing
2. Only change style values — do NOT restructure JSX or change logic
3. `colors.ts` standalone commit first — no screen files in that commit
4. tsc must pass (0 errors) before each commit
5. One screen file per commit
6. No hardcoded hex in StyleSheet.create — use `colors.*` tokens only
7. All tap targets minHeight ≥ 44
8. Contrast ratios are pre-verified in this brief — do not deviate from them

### What is BANNED
- `#999999`, `#AAAAAA`, `#BBBBBB`, `#888888` as text colours on light backgrounds
- Multi-file commits
- Merging design changes with logic changes
- "subtle" as justification for low contrast

---

## Acceptance criteria

- [ ] 0 TypeScript errors
- [ ] All text tokens pass WCAG AA contrast (verified above)
- [ ] Screenshot shows no white-on-white or near-white-on-white text
- [ ] Tap targets all ≥ 44pt
- [ ] Committed with correct message format: `design: v[N] [description]`
