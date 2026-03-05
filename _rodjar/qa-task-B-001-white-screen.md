# QA Task: B-001 — White Screen on Web Preview

**Assigned by:** Rodjar  
**Date:** 2026-03-05  
**Priority:** High  

---

## Problem Statement

The web preview at `http://localhost:19006` (started via `npx expo start --web --clear`) loads but shows a white/blank screen. The app does not render.

## Context

- Project: `C:\Users\james\Documents\VS Code\Anílog`
- Framework: Expo SDK 55, expo-router v3, React Native 0.83.2
- Entry point: `"main": "expo-router/entry"` in `package.json` (recently fixed from `index.ts`)
- `react-native-worklets` was recently installed as a peer dep for reanimated v4
- `babel.config.js` includes `nativewind/babel` and `react-native-reanimated/plugin`
- Web preview was started with `npx expo start --web --port 19006`

## Your Investigation Tasks

### 1. Check current package.json state
Read `C:\Users\james\Documents\VS Code\Anílog\package.json` — note all dependencies, especially reanimated, worklets, nativewind versions.

### 2. Start web preview and capture ALL console errors
Run in foreground to capture errors:
```powershell
cd "C:\Users\james\Documents\VS Code\Anílog"
$env:CI = "1"
npx expo start --web --clear 2>&1 | Tee-Object -FilePath "_rodjar\web-errors.txt"
```
Wait 30 seconds, then Ctrl+C and read `_rodjar\web-errors.txt`. Look for:
- Module not found errors
- TypeScript compilation errors
- Reanimated/worklets web compatibility errors
- NativeWind web errors

### 3. Check for known web incompatibilities
Read these files and check for web-incompatible imports:
- `src/app/_layout.tsx`
- `src/app/(tabs)/index.tsx`
- `src/components/ui/AnimonCard.tsx`
- `babel.config.js`

Known issues to look for:
- `expo-linear-gradient` — may need `expo-linear-gradient/web` on web
- `react-native-reanimated` — needs web-compatible setup
- `react-native-worklets` — may not support web
- Any `Platform.OS` checks missing that import native-only modules

### 4. Check metro.config.js / webpack config
Run:
```powershell
Get-ChildItem "C:\Users\james\Documents\VS Code\Anílog" -Name "metro.config*","webpack.config*","web-webpack*" -ErrorAction SilentlyContinue
```

### 5. Check browser console
Open `http://localhost:19006` in browser and check the browser's DevTools console (F12). The errors there will be most informative. We can't access this directly, but the Metro bundler log from Task 2 should show the same errors.

### 6. Apply fixes
Based on what you find, fix the root cause(s). Common fixes:
- If reanimated/worklets not web-compatible: wrap in `Platform.select` or add web mocks
- If NativeWind fails on web: check `tailwind.config.js` content paths include web files
- If linear-gradient fails: use conditional import

### 7. Verify fix
After applying fix, restart web preview and confirm `http://localhost:19006` renders the app (not white screen).

### 8. Update coordination log
Append your findings and outcome to `C:\Users\james\Documents\VS Code\Anílog\_rodjar\BACKLOG.md` in the Agent Coordination Log table.

---

## Expected Outcome

`http://localhost:19006` renders the Anílog app (Discover screen visible with mock animon cards).

## Report Back To Rodjar

- Root cause of white screen
- Exact fix applied (file + change)
- Whether the web preview now works
- Any new bugs discovered (add to BACKLOG.md)
