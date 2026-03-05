# UX/UI Design Task: Skeuomorphic Redesign of Anílog

**Assigned by:** Rodjar  
**Date:** 2026-03-05  
**Branch:** `feature/skeuomorphic-redesign`  
**Output:** Write your full design spec to `_rodjar/design-spec-skeuomorphic.md`

---

## Brief

The user wants a full visual redesign of Anílog away from the current flat/minimal aesthetic toward a **skeuomorphic design language** — the app should feel like you are interacting with a real physical digital device for capturing and cataloguing animals. Think: a rugged field scanner or wildlife collector's device — not a corporate app.

## Inspiration Reference
The user shared a Pokédex UI as reference (attached below as description). The Pokédex inspiration has:
- Soft card backgrounds with coloured type-based fills
- Rounded corners throughout
- Clean creature photography
- Bold category colour chips
- Warm whites and pastels

**However:** the user wants MORE skeuomorphic than the Pokédex reference — more tactile, more device-like, more physical.

## Design Direction

Think:
- **Field device aesthetic** — like a rugged handheld scanner a wildlife biologist would carry
- **Physical textures** — brushed metal panels, rubberised grips, screen bezels, rivets, subtle embossing
- **Screen-within-a-screen** — the app UI lives inside a "device frame" UI
- **Tactile controls** — buttons that look pressable, dials, toggles with physical depth
- **Warm nature palette** — deep forest greens, amber, off-whites like aged paper/bone, rich browns
- **Depth and shadow** — inset panels, raised elements, drop shadows that feel 3D
- **Typography** — mix of a technical/monospace font for data readouts and a hand-crafted feel for species names

NOT:
- Flat, minimal, app-store generic
- Neon or gaming aesthetic
- Cold blues/greys

## Current Screen List (all 6 must be redesigned)

1. **Discover (Home)** — greeting, stats chips, recently caught carousel, nearby activity feed
2. **My Anílog** — type filter chips, 2-column animon card grid
3. **Camera Modal** — scanning reticle, result slide-up card
4. **Animon Detail** — hero image, stats grid, region info
5. **Milestones** — species progress, rarity breakdown grid, achievement cards
6. **Profile** — avatar, stats, rarity chart, last catches, Anílog+ banner

## Known UI Bug to Address in Design
- Cards in the "recently caught" carousel are inconsistent heights — design must enforce fixed-height carousel cards

## What to Produce

Write a comprehensive design spec to `C:\Users\james\Documents\VS Code\Anílog\_rodjar\design-spec-skeuomorphic.md` covering:

### 1. Design Language Summary (1 page)
- Core metaphor / physical device concept
- Tone and feel in 3 words
- What makes this feel skeuomorphic (specific texture/depth decisions)

### 2. Colour System
- Full palette with hex values: primary, secondary, accent, backgrounds, surface variants, rarity colours
- Semantic names (e.g. `deviceGreen`, `panelAmber`, `screenBezel`)

### 3. Typography System
- Font choices (from Google Fonts / expo-google-fonts)
- Heading font, body font, data/readout font (monospace for stats)
- Size scale

### 4. Component Patterns
For each: visual description, shadow/depth spec, colour usage
- Card (full grid card)
- Compact card (carousel)
- Rarity badge
- Type tag chip
- Tab bar (device-style navigation)
- Buttons (primary, secondary, destructive)
- Stats readout (data display panels)
- Camera reticle / scanner UI

### 5. Screen-by-Screen Specs
For each of the 6 screens: layout description, key visual elements, any specific interactions

### 6. Implementation Notes for Developer
- Any new packages needed (e.g. specific font families)
- Key `StyleSheet` patterns to implement depth (shadows, borders, gradients)
- Any platform-specific notes

Be specific and opinionated. The Frontend Developer will implement directly from this spec — vague direction is not useful.
