# Anílog — Core User Journeys

> Single source of truth for flows that MUST work before anything else ships.
> Keep this lean — if a flow isn't here, it isn't in scope.

---

## Status legend
- 🔴 Not started
- 🟡 In progress / mocked
- 🟢 Done (working end-to-end)

---

## Flow 1 — Scan & Capture (the core loop)
**Entry:** User opens camera tab (FAB in tab bar)  
**Exit:** Animon appears in their Anílog collection  
**Priority:** P0 — nothing else matters if this doesn't work

| Step | Screen / Component | Status | Notes |
|------|--------------------|--------|-------|
| 1 | Tap camera FAB in tab bar | 🔴 | Navigates to `/camera` |
| 2 | Camera viewfinder opens | 🔴 | expo-camera permission prompt on first run |
| 3 | User points at real animal | 🔴 | Live preview, shutter button |
| 4 | Photo captured → sent to AI | 🔴 | See `/research/image-recognition.md` for approach |
| 5 | AI returns: species name, confidence, base type | 🔴 | Loading state shown |
| 6 | Animon reveal screen — species mapped to game entity | 🔴 | e.g. "Robin" → Fire/Grass type, Common rarity |
| 7 | Capture animation plays | 🔴 | |
| 8 | "Added to your Anílog!" confirmation | 🔴 | |
| 9 | New card appears in Anílog tab | 🔴 | |

**Open questions:**
- What happens when the AI can't identify the animal? → show "Unknown Creature" fallback
- Duplicate capture — same species? → allow, track count per species
- Location tagging — do we record GPS coords at capture time?

---

## Flow 2 — Browse Collection (Anílog tab)
**Entry:** Tap Anílog tab  
**Exit:** User has found and viewed a specific captured Animon  
**Priority:** P0

| Step | Screen / Component | Status | Notes |
|------|--------------------|--------|-------|
| 1 | Anílog tab grid loads | 🟡 | Mock data wired, needs real data |
| 2 | Filter bar — tap type pill | 🟢 | Working |
| 3 | Grid filters to matching Animon | 🟢 | Working |
| 4 | Tap card → AnimonDetail screen `/animon/[id]` | 🟡 | Screen exists, needs real data |
| 5 | Detail shows: stats, capture location, rarity, type | 🔴 | |

---

## Flow 3 — First Launch / Onboarding
**Entry:** App installed, first open  
**Exit:** User has a username and has granted camera + location permissions  
**Priority:** P1 (needed before TestFlight)

| Step | Screen / Component | Status | Notes |
|------|--------------------|--------|-------|
| 1 | Splash / welcome screen | 🔴 | |
| 2 | "What's your trainer name?" input | 🔴 | |
| 3 | Camera permission prompt (system) | 🔴 | |
| 4 | Location permission prompt (system) | 🔴 | |
| 5 | "Here's your empty Anílog" → land on Discover tab | 🔴 | Empty state component exists |

---

## Flow 4 — Logbook / Achievements
**Entry:** Tap Logbook tab  
**Exit:** User can see their progress and unlocked achievements  
**Priority:** P1

| Step | Screen / Component | Status | Notes |
|------|--------------------|--------|-------|
| 1 | Logbook screen loads | 🟡 | Screen exists (`logbook.tsx`), mock data |
| 2 | Progress gauge shows % toward 100 species | 🟡 | Calculated from mock data |
| 3 | Rarity breakdown grid | 🟡 | Working visually |
| 4 | Achievement cards — locked/unlocked states | 🟡 | Mock unlocked states |
| 5 | Achievement unlocks in real time when condition met | 🔴 | Needs state/event system |

---

## Flow 5 — Profile
**Entry:** Tap Profile tab  
**Exit:** User has seen their stats and can reach settings  
**Priority:** P1

| Step | Screen / Component | Status | Notes |
|------|--------------------|--------|-------|
| 1 | Profile hero zone with avatar + name | 🟡 | Mock user data |
| 2 | Stat strip (caught / species / regions) | 🟡 | Mock data |
| 3 | Rarity breakdown bar | 🟡 | |
| 4 | Recent catches list | 🟡 | |
| 5 | Anílog+ upgrade banner — tap UPGRADE | 🔴 | No payment flow yet |
| 6 | Settings / sign out | 🔴 | Not built |

---

## Flow 6 — Trade (Post-MVP)
**Entry:** Social feed post with trade CTA, or direct from Animon detail  
**Exit:** Trade offer sent / accepted  
**Priority:** P2 (post-launch)

| Step | Screen / Component | Status | Notes |
|------|--------------------|--------|-------|
| 1 | Social feed visible in Discover tab | 🔴 | `SocialPost.tsx` created, not wired to screen |
| 2 | Tap "⇄ Offer Trade" | 🔴 | |
| 3 | Select Animon(s) to offer from own collection | 🔴 | |
| 4 | Offer sent — other user notified | 🔴 | Needs push notifications |
| 5 | Accept / reject flow | 🔴 | |
| 6 | Collections swap | 🔴 | |

---

## MVP Definition (what ships first)

Flows 1 + 2 working end-to-end with real AI = shippable beta.  
Flows 3, 4, 5 polished = TestFlight-ready.  
Flow 6 = v1.1+.

---

## Next build priorities

1. **Wire up camera screen** — capture photo, call AI, return result to app
2. **Image recognition spike** — see `_rodjar/research/image-recognition.md`
3. **Species → Animon mapping layer** — translate AI output to game entity
4. **Persist captured Animons** — local state / AsyncStorage → later: backend
5. **Onboarding screens** — username + permissions
