# QA Re-Verification Task: B-001 Web Preview

**Assigned by:** Rodjar  
**Date:** 2026-03-05  
**Bug Ref:** B-001 (Developer claims resolved)  

---

## Developer's Claimed Fixes

1. `GestureHandlerRootView` added to `src/app/_layout.tsx`
2. `metro.config.js` created with NativeWind `withNativeWind` wrapper
3. `global.css` created with Tailwind directives

## Your Verification Tasks

### 1. Confirm files exist and look correct
Read:
- `C:\Users\james\Documents\VS Code\Anílog\src\app\_layout.tsx` — confirm `GestureHandlerRootView` wraps the root
- `C:\Users\james\Documents\VS Code\Anílog\metro.config.js` — confirm `withNativeWind` is present
- `C:\Users\james\Documents\VS Code\Anílog\global.css` — confirm Tailwind directives present

### 2. Kill stale processes and do a clean start
```powershell
Get-Process -Name "node","ngrok" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3
cd "C:\Users\james\Documents\VS Code\Anílog"
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
```

### 3. Run export to verify bundle compiles clean
```powershell
cd "C:\Users\james\Documents\VS Code\Anílog"
npx expo export --platform web 2>&1 | Tee-Object "_rodjar\qa-web-verify.txt"
Get-Content "_rodjar\qa-web-verify.txt" | Select-String -Pattern "error|Error|ERROR|Bundled|bundled|warn|WARN" | Select-Object -First 30
```
Must see "Web Bundled Xms (XXXX modules)" with no ERRORs.

### 4. Start web dev server and verify HTTP response
```powershell
$job = Start-Job { cd "C:\Users\james\Documents\VS Code\Anílog"; npx expo start --web --clear }
Start-Sleep -Seconds 30
try {
  $r = Invoke-WebRequest -Uri "http://localhost:8081" -UseBasicParsing -TimeoutSec 10
  Write-Host "PASS: HTTP $($r.StatusCode)"
} catch {
  try {
    $r2 = Invoke-WebRequest -Uri "http://localhost:19006" -UseBasicParsing -TimeoutSec 10
    Write-Host "PASS: HTTP $($r2.StatusCode) on port 19006"
  } catch {
    Write-Host "FAIL: Web server not responding — $_"
  }
}
```

### 5. Check for B-002
Developer flagged: `react-native-worklets@0.7.4` installed but Expo 55 expects `0.7.2`.
Check `package.json` — if `0.7.4` is there, flag it in BACKLOG.md as Active Bug B-002 if not already there.

### 6. Update BACKLOG.md
- If B-001 verified fixed → move to Resolved table
- If B-001 still failing → update Active Bugs, describe what's still broken
- Add B-002 to Active Bugs if not already present

## Report Back to Rodjar
- PASS or FAIL on each check
- Whether the web preview is confirmed working
- Status of B-002
