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
### Last completed (2026-03-10 session)
- ✅ Collection display bug FIXED — `anilog.tsx`, `logbook.tsx`, `profile.tsx` now merge local `collectionStore` animons + Supabase animons via `useMemo` (deduped by id). Starters visible immediately after onboarding without auth. (`42a73c0`)
- ✅ Full design system pass — 7 commits, 0 TS errors:
  - `AnimonCard.showPhoto` default: `false` → `true` (photos now visible by default)
  - Party tab: type-color card backgrounds + `TypeTagChip` (matches Pokédex aesthetic)
  - Collection tab: `showPhoto`, pill chips (borderRadius `3` → `99`)
  - All screens: `paddingHorizontal` standardised to `16`
  - Typography tokens enforced throughout (no more raw literals; no `mono` on UI labels)
  - `TabBar.bg`: `colors.surface` → `colors.navDark` (correct token)
- ✅ Auth screens ALL IMPLEMENTED (login, register, forgot password, auth guard, session persistence)
- ✅ GitHub issues #18, #19, #20, #21, #22 CLOSED — all confirmed implemented
- ✅ Active branch: `feat/auth-onboarding`, latest commit: `7f5d5b9`

### What is genuinely NOT yet done
- ❌ `.env` file missing — Supabase + Gemini credentials needed (user doesn't have Gemini key yet)
- ❌ Supabase project not created — no real DB, no auth backend wired to real users
- ❌ Email verification gate after sign-up (issue #23) — code not written
- ❌ Supabase profiles table migration (issue #25) — need to check if in `001_initial_schema.sql`
- ❌ SSO (Google/Apple) — issue #28, P1
- ❌ `📱 Product Status` Notion page NOT YET CREATED
- ❌ Screenshots not yet taken (dev server needed to view visual result)

### Immediate next actions (pick up here)
1. **Get credentials**: Create Supabase project → copy URL + anon key. Get Gemini API key from Google AI Studio. Create `.env` from `.env.example`.
2. **Apply migrations**: Run `supabase/migrations/001_initial_schema.sql` + `002_daily_scans.sql` on the Supabase project.
3. **Test end-to-end**: Boot Expo Go, register, complete onboarding, confirm cat in collection, open camera, scan real animal.
4. **Implement #23**: Email verification gate before first scan.
5. **Close tech-debt issue #16**: All mock data now has real persistence path stubbed.

### Key store rules
- **All Zustand stores use manual AsyncStorage pattern** — NO `zustand/middleware` (causes white page on web/React 19)
- AsyncStorage keys: `onboarding_complete`, `username`, `party_slots`, `achievements`, `dev_seed_v1`
- **Collection store IS now persisted** (key: `collection_animons`) — seeded on onboarding, merged with Supabase at display layer
- All 3 collection display screens use merge pattern: `useMemo` combining `collectionStore.animons` + `supabaseAnimons`, deduped by id
