# Task Brief: Dev Server Not Starting — ERR_CONNECTION_REFUSED

**Assigned to:** Backend Developer  
**Priority:** BLOCKER  
**Date:** 2026-03-05

---

## Problem

User is seeing `ERR_CONNECTION_REFUSED` on localhost. The Expo dev server is not running. All recent `npx expo start --tunnel` attempts have exited with code 1. The `--web` mode was previously confirmed working at http://localhost:8081.

Multiple file edits were made to the codebase since the last known-good state (skeuomorphic redesign merge at d0a6e2e). These edits may have introduced a syntax error or import problem that prevents the Metro bundler from starting.

## Files Recently Edited (check these first)

- `src/app/(tabs)/anilog.tsx`
- `src/app/(tabs)/milestones.tsx`
- `src/app/(tabs)/profile.tsx`
- `src/app/camera.tsx`
- `src/app/animon/[id].tsx`
- `src/components/layout/TabBar.tsx`
- `src/components/ui/AnimonCard.tsx`
- `src/constants/colors.ts`
- `src/app/(tabs)/index.tsx`
- `src/components/ui/index.ts`
- `src/app/_layout.tsx`
- `src/constants/typography.ts`
- `src/components/ui/TypeTagChip.tsx`
- `src/components/ui/RarityBadge.tsx`
- `src/components/ui/EmptyState.tsx`

## Your Tasks

1. **Diagnose** — Attempt to start the dev server with `npx expo start --web --clear` and capture the full error output. Look for syntax errors, missing imports, or module resolution failures.

2. **Inspect recently edited files** — Check each file in the list above for:
   - TypeScript/syntax errors
   - Imports of deleted tokens or components
   - Mismatched brackets or JSX errors

3. **Fix any issues found** — Make the minimum changes needed to get the server starting cleanly.

4. **Verify** — Confirm the web bundle compiles successfully (look for "Web Bundled" in output with module count). The server must be reachable at http://localhost:8081.

5. **Commit** — Stage and commit any fixes with message: `fix: resolve dev server startup errors`

6. **Report back** — Update `_rodjar/BACKLOG.md` with what was found and fixed. Write your findings under a new section `## DEV SERVER FIX 2026-03-05`.

## Known Good Config (do NOT change unless broken)

- `babel.config.js`: `presets: ['babel-preset-expo', 'nativewind/babel']`
- `metro.config.js`: `withNativeWind(config, { input: './global.css' })`
- `package.json` main: `"expo-router/entry"`
- `.npmrc`: `legacy-peer-deps=true`
- Web start command: `npx expo start --web --clear`

## Do NOT

- Do NOT attempt `--tunnel` (ngrok issues unrelated to this task)
- Do NOT change dependency versions
- Do NOT refactor working code
