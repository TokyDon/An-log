# Developer Task: Fix Web Preview Perpetual Loading

**Assigned by:** Rodjar  
**Date:** 2026-03-05  
**Bug Ref:** B-001 (re-opened — QA fixes incomplete)  
**Priority:** High  

---

## Problem Statement

`npx expo start --web --clear` starts but the browser at `http://localhost:19006` shows perpetual loading — the app never renders. Previous QA pass made partial fixes but the issue persists.

## What QA Already Fixed (do NOT undo these)

QA confirmed these changes are in place:
1. `babel.config.js` — `nativewind/babel` moved from `plugins` → `presets`, `react-native-reanimated/plugin` removed (babel-preset-expo auto-includes it)
2. `package.json` — `babel-preset-expo@55.0.10` added to devDependencies
3. `package.json` — `expo-linking` added to dependencies  
4. `package.json` — `react-native-worklets@0.7.4` added to dependencies
5. `package.json` — `"main"` is correctly `"expo-router/entry"`

## Current State

```json
// babel.config.js is now:
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', 'nativewind/babel'],
  };
};
```

## Your Tasks

### 1. Run web bundler in foreground and capture ALL output
```powershell
cd "C:\Users\james\Documents\VS Code\Anílog"
Get-Process -Name "node","ngrok" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
npx expo start --web --clear 2>&1 | Tee-Object "_rodjar\web-bundle-output.txt"
```
Wait 60 seconds (Metro needs time to bundle 1200+ modules), then read `_rodjar\web-bundle-output.txt`.

### 2. Look specifically for these errors:
- `Cannot find module` — missing dependency
- `SyntaxError` — broken source file
- `TypeError` — runtime crash on startup  
- `Warning: Each child in a list should have a unique "key"` — non-fatal but note it
- Any red ERROR lines
- Check if Metro says "Web Bundled Xms" — if yes, bundling succeeded and the issue is runtime

### 3. If bundling succeeds — check for runtime crash
If Metro outputs "Web Bundled", the issue is a JavaScript runtime error in the browser. Open `http://localhost:19006` and note any error overlays. Common causes for Expo/RN web runtime crashes:
- `expo-haptics` — not web-compatible, needs Platform guard
- `expo-camera` — not web-compatible without explicit web support
- `expo-location` — needs web permission handling
- Imports of native-only modules without web fallbacks
- `react-native-gesture-handler` needing web setup

Check `src/app/_layout.tsx`, `src/app/(tabs)/index.tsx`, `src/components/ui/AnimonCard.tsx`, `src/components/layout/TabBar.tsx` for any imports that would crash on web.

### 4. Add Platform guards where needed
If native-only modules are causing crashes, wrap them:
```typescript
import { Platform } from 'react-native';
// Only import on native:
if (Platform.OS !== 'web') { ... }
```
Or use dynamic imports / conditional requires for problematic packages.

### 5. Check GestureHandlerRootView
`react-native-gesture-handler` requires wrapping the app in `<GestureHandlerRootView>` on web. Check `src/app/_layout.tsx` — if it's not there, add it:
```typescript
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// Wrap root return with: <GestureHandlerRootView style={{ flex: 1 }}>
```

### 6. Verify fix
After applying fixes:
```powershell
npx expo export --platform web 2>&1 | Select-String -Pattern "error|Error|ERROR|Bundled|bundled" | Select-Object -First 20
```
Should output "Web Bundled Xms (XXXX modules)" with no errors.

Then start the server and verify `http://localhost:19006` loads (not perpetual spinner):
```powershell
npx expo start --web --clear
```
Wait 30 seconds then:
```powershell
$r = Invoke-WebRequest -Uri "http://localhost:19006" -UseBasicParsing -TimeoutSec 10
Write-Host "Status: $($r.StatusCode), Size: $([math]::Round($r.RawContent.Length/1024))KB"
```

### 7. Update BACKLOG.md
Append your findings and fix to `_rodjar/BACKLOG.md` Agent Coordination Log.

---

## Expected Outcome

`http://localhost:19006` renders the Anílog Discover screen with mock animon cards. No loading spinner, no error overlay.

## Hand Back To Rodjar
Report:
- Root cause of perpetual loading
- Exact files changed and what changed
- Whether `http://localhost:19006` now renders
- Any new bugs found (add to BACKLOG.md Active Bugs table)
