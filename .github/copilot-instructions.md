# Anílog — Copilot Workspace Instructions

## Notion
- **ONLY** use the `notion-Anilog` MCP server for all Notion operations in this workspace.
- **NEVER** use `notion-main` — that is the Cardinal Point workspace and must not be touched.
- If `notion-Anilog` tools are not available, stop and tell the user to reconnect the MCP server via Command Palette → "MCP: List Servers".

## GitHub
- Repo: `https://github.com/TokyDon/Anilog`
- `gh` CLI is authenticated as `TokyDon`
- All issues use labels: `P0`, `P1`, `P2`, `tech-debt`

## Stack
- Expo SDK 55, React Native, TypeScript, expo-router v3
- Design system: v3 Clean Modern (committed at `5daf043`)
- All screens are in `src/app/`, components in `src/components/`

## Notion — Confirmed State
- **Working config:** stdio type, `@notionhq/notion-mcp-server` via npx (NOT http — http hits wrong workspace)
- **Token:** stored in VS Code secret store via `.vscode/mcp.json` input — Anílog workspace only
- **Workspace:** `workspace_name: "Anílog"`, `workspace_id: "215daaca-aff7-817f-a1ce-0003a56f7b1f"`
- **Root page:** `🏡 Overview`, ID: `319daaca-aff7-8025-bd41-da8c4a4f959d`
- **Cardinal Point token (NEVER USE):** stored separately — do NOT use in this workspace
- **TODO:** User needs to create a workspace-specific `secret_` integration token at notion.com/my-integrations for reliability

## Design Protocol (ENFORCED — Rodjar must follow this every time)

### The core problem this solves
Design agents cannot see the rendered app. They commit visually broken code. We have shipped WCAG-failing contrast twice. This protocol prevents that.

### Step-by-step — no skipping

**Step 0 — Read the skill before writing any brief**
Rodjar MUST read `refactoring-ui` skill before dispatching any design agent. It contains contrast rules, spacing systems, and colour principles. Do not skip this.

**Step 1 — colors.ts ONLY, first commit**
- The ONLY change in the first commit is `src/constants/colors.ts`
- Every color token in the brief MUST have its WCAG contrast ratio stated explicitly
- Minimum ratios: text1 ≥ 7:1, text2 ≥ 4.5:1, text3 ≥ 4.5:1, ALL measured against the background it will appear on
- Use the template at `_rodjar/design-brief-template.md` — the contrast table is mandatory

**Step 2 — Screenshot before touching screens**
After colors.ts commits, use the `webapp-testing` skill to screenshot the running app BEFORE editing any screen file. This is the visual baseline.

**Step 3 — One screen per commit**
- Each screen file is a separate commit
- Pattern: edit → tsc → screenshot → commit
- Never batch multiple screens into one commit

**Step 4 — Screenshot after each screen commit**
After every screen commit, screenshot that screen. Visually confirm contrast, padding, and legibility before moving to the next screen.

**Step 5 — Final accessibility sweep**
Before marking any design task complete, screenshot ALL tabs/screens together and explicitly check:
- All body text readable without squinting
- Placeholder/ghost text (text3) still readable — NOT decorative grey
- Tap targets ≥ 44pt height
- No white-on-white or near-white-on-white situations

### WCAG Quick Reference (mandatory in every design brief)
| Token | Min contrast | Against |
|-------|-------------|---------|
| text1 | ≥ 7.0:1 | bg, surface, surface2 |
| text2 | ≥ 4.5:1 | bg, surface, surface2 |
| text3 | ≥ 4.5:1 | bg, surface, surface2 |
| accent text on accentSoft | ≥ 4.5:1 | accentSoft |
| textInverse | ≥ 4.5:1 | accent button bg |

### What is BANNED in design briefs
- Any mention of `#999999` for text (2.85:1 — fails)
- Any mention of `#AAAAAA` for text (2.32:1 — fails)
- Multi-screen commits without a screenshot gate between them
- "subtle" or "ghost" as justification for a failing contrast ratio

### Design brief template
Always use: `_rodjar/design-brief-template.md`

---

## Current State (updated each session)
### Last completed (session ending March 9, 2026)
- ✅ All P0 issues (#1, #3–#7) and P1 issues (#12–#15) implemented on `feat/p1-features`
- ✅ UX restructure: Party tab (replaces Discover), tabs renamed Collection/Stamps, onboarding 5→7 steps
- ✅ White-page fix: partyStore manual AsyncStorage, `router.replace('/')`, font-loading screen
- ✅ Dev seed: Domestic Shorthair Cat "Biscuit" gifted to party on first load (`dev_seed_v1` flag)
- ✅ GitHub: #12–15 closed, #26 created+closed. Notion: Feature Registry Phase 2 → DONE, Screen Map updated
- ✅ Active branch: `feat/p1-features`, latest commit: `594b670` (pending push — tokens scrubbed)
- ✅ `.vscode/mcp.json` now uses VS Code `inputs` (no hardcoded token)
- ❌ `📱 Product Status` Notion page NOT YET CREATED

### Immediate next actions (pick up here)
1. Verify the cat "Biscuit" appears in the Party tab after clearing AsyncStorage (`dev_seed_v1`)
2. Start Phase 3 P0 dev — Issue #4 first (`AnimonScanResult` type), then #3 (Gemini service), then #1 (camera capture)
3. Create `📱 Product Status` Notion page under root `319daaca-aff7-8025-bd41-da8c4a4f959d`

### Key store rules
- **All Zustand stores use manual AsyncStorage pattern** — NO `zustand/middleware` (causes white page on web/React 19)
- AsyncStorage keys: `onboarding_complete`, `username`, `party_slots`, `achievements`, `dev_seed_v1`
- Collection store is NOT persisted — Supabase-backed, requires auth (Phase 3)
