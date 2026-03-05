# Anílog — Skeuomorphic Design Spec
**Version 1.0 | Date: 2026-03-05 | Author: UX/UI Designer**

---

## Part 1 — Design Language Summary

### Core Metaphor
The **BioField Scanner MK-II** — a rugged, weatherproof wildlife identification device as imagined by a field biologist, circa 2010. Picture a Garmin handheld GPS crossed with a leather naturalist's journal: chunky moulded dark-walnut casing, rubberised grip strips along the sides, a recessed backlit display housing the app. Every screen the user interacts with lives inside the device's display window. Data readouts feel like amber-on-dark LCD panels. The app is the software running on this physical machine.

### Tone in Three Words
**Grounded. Tactile. Alive.**

### What Makes This Skeuomorphic — Specific Decisions

| Element | Flat/Minimal Version | Skeuomorphic Version in This Spec |
|---------|---------------------|------------------------------------|
| App chrome | White/grey neutral | `deviceBody` (`#2C2416`) dark walnut casing frames the screen |
| Cards | White rounded rect + drop shadow | Multi-layer stack: parchment surface, inner-border highlight/shadow, type-tinted image footer |
| Buttons | Filled colour + border radius | Raised with top-highlight / bottom-shadow inner border; pressed state sinks 2px |
| Filter chips | Coloured pill | Toggle between raised (off) and inset/recessed (on) — physically pressable feel |
| Stats / data | Bold number + label | Dark recessed panel with monospace amber LCD readout text |
| Camera UI | White overlay + icon | Rubberised scan frame, L-bracket amber corner markers, pulsing sonar ring |
| Tab bar | Simple icon + label row | Brushed-metal device panel, indicator LED dots, camera button raised on disc |
| Rarity badge | Coloured pill | Embossed / stamped treatment per rarity tier |

---

## Part 2 — Colour System

### Full Palette

Replace `src/constants/colors.ts` with this object:

```typescript
export const colors = {

  // ── Device Chrome ─────────────────────────────────────────────────────────
  deviceBody:        '#2C2416',   // dark walnut outer casing — SafeAreaView background
  deviceBezel:       '#1A1208',   // near-black inner bezel; tab bar base; dark data panels
  metalBrush:        '#3A3530',   // brushed metal trim, tab bar top border, panel borders
  metalBrushLight:   '#5C5548',   // lighter brushed metal — inactive tab icons & labels
  rubberised:        '#1C1C1E',   // rubberised grip strip areas (decorative only)

  // ── App Screen (inside device display) ────────────────────────────────────
  screenBg:          '#F5F0E8',   // aged parchment / bone white — main scrollable background
  surfacePanel:      '#EDE8DC',   // slightly darker off-white — section panels, activity feed
  surfaceCard:       '#F0EBE0',   // card background (warm white)
  surfaceInset:      '#D4CEBC',   // recessed / inset panel fill
  surfaceBorder:     '#C8BFA8',   // border between panels; inactive chip borders
  screenGlass:       'rgba(255,255,255,0.06)',  // glass sheen overlay on dark surfaces

  // ── Primary Action (Forest Green) ─────────────────────────────────────────
  scannerGreen:      '#1B4332',   // deep forest green — primary CTA backgrounds
  scannerGreenMid:   '#2D6A4F',   // medium green — hover / secondary button fill
  scannerGreenLight: '#40916C',   // lit indicator green — active text links, active states
  scannerGreenGlow:  '#52B788',   // glow green — LED dot fill, active tab highlight

  // ── Amber (Data Readouts & Accents) ───────────────────────────────────────
  panelAmber:        '#92400E',   // warm sienna-amber — dark accent areas
  amberReadout:      '#E8C97E',   // aged amber LCD readout text on dark panels
  amberAccent:       '#D97706',   // amber UI accent (chips, inline highlights)
  amberGlow:         '#F59E0B',   // bright amber — camera reticle corners, scanner pulse

  // ── Rarity ────────────────────────────────────────────────────────────────
  rarity: {
    common:   '#8B8577',   // muted stone — pebble-ink stamp
    uncommon: '#2D7A3A',   // forest green — field mark
    rare:     '#2A5B9E',   // deep cobalt — expedition grade
    glossy:   '#B8860B',   // true dark gold — trophy specimen
  },

  // ── Type System ───────────────────────────────────────────────────────────
  // TYPE_DEFINITIONS colours in typeSystem.ts are unchanged — they remain strong.

  // ── Text ──────────────────────────────────────────────────────────────────
  textPrimary:   '#2C1F0F',   // deep warm brown — main text on parchment surfaces
  textSecondary: '#6B5C44',   // mid-tone warm brown — secondary labels
  textMuted:     '#A09070',   // muted — captions, metadata, timestamps
  textInverse:   '#F5F0E8',   // parchment white — text on dark/green surfaces
  textReadout:   '#E8C97E',   // amber LCD — text inside dark data panels (= amberReadout)

  // ── Semantic ──────────────────────────────────────────────────────────────
  success: '#15803D',
  error:   '#B91C1C',
  warning: '#D97706',

  // ── Overlays ──────────────────────────────────────────────────────────────
  overlayDark:  'rgba(0,0,0,0.55)',
  overlayAmber: 'rgba(232,201,126,0.12)',
} as const;
```

### Colour Migration Map (old token → new token)

| Old `colors.*` | New `colors.*` | Hex |
|----------------|----------------|-----|
| `primary` | `scannerGreen` | `#1B4332` |
| `accent` | `amberAccent` | `#D97706` |
| `background` | `screenBg` | `#F5F0E8` |
| `surface` | `surfaceCard` | `#F0EBE0` |
| `text.primary` | `textPrimary` | `#2C1F0F` |
| `text.secondary` | `textSecondary` | `#6B5C44` |
| `text.inverse` | `textInverse` | `#F5F0E8` |
| `rarity.*` | `rarity.*` | Same keys, new hex values |
| `overlay.dark` | `overlayDark` | `rgba(0,0,0,0.55)` |
| `overlay.light` | `screenGlass` | `rgba(255,255,255,0.06)` |
| `error` | `error` | `#B91C1C` |

---

## Part 3 — Typography System

### Font Choices

**Install these packages:**

```bash
npx expo install @expo-google-fonts/playfair-display @expo-google-fonts/space-mono
```

**Remove (no longer needed):**

```bash
npx expo uninstall @expo-google-fonts/dm-serif-display
```

**Keep:** `@expo-google-fonts/dm-sans` (already installed)

### Font Roles

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| **Heading / Species names** | Playfair Display | 400 Regular, 700 Bold, 900 Black | Screen titles, animon species names, app wordmark. The 900 Black italic is reserved for glossy/rare species names on the detail screen. |
| **Body / UI labels** | DM Sans | 400, 500, 700 | Navigation labels, descriptions, chip text, button labels, section headers |
| **Data readouts** | Space Mono | 400 Regular, 700 Bold | Stats numbers, confidence %, coordinates, timestamps, scanner readouts — anything that represents measured or recorded data |

### Font Family Keys (update `src/constants/typography.ts`)

```typescript
fontFamily: {
  heading:      'PlayfairDisplay_400Regular',
  headingBold:  'PlayfairDisplay_700Bold',
  headingBlack: 'PlayfairDisplay_900Black',   // glossy/rare species italic
  body:         'DMSans_400Regular',
  bodyMedium:   'DMSans_500Medium',
  bodyBold:     'DMSans_700Bold',
  mono:         'SpaceMono_400Regular',
  monoBold:     'SpaceMono_700Bold',
},
```

### Font Loading in `_layout.tsx`

```typescript
const [loaded] = useFonts({
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_900Black,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
  SpaceMono_400Regular,
  SpaceMono_700Bold,
});
```

### Size Scale (unchanged, for reference)

| Token | px | Usage |
|-------|----|-------|
| `xs` | 11 | Micro labels, badge text, capture metadata |
| `sm` | 13 | Secondary body, chip labels, monospace readout labels |
| `base` | 15 | Primary body text, card descriptions |
| `md` | 17 | Card titles, section subtitles |
| `lg` | 20 | Screen subtitles, minor headings |
| `xl` | 24 | Screen headings (minor) |
| `2xl` | 30 | Screen headings (major) — My Anílog, Milestones, Profile |
| `3xl` | 36 | Discover screen heading |
| `4xl` | 48 | Numeric stat readouts (large data panels) |

### Typography Rules

- **Species names on cards:** Playfair Display 700, `base` (15px), `textPrimary`
- **Species names on detail screen:** Playfair Display 900 Black italic, `3xl` (36px), `textInverse`
- **Confidence scores:** Space Mono 700, `md` (17px), `amberReadout` on dark panel
- **Primary stats (large):** Space Mono 700, `4xl` (48px), `amberReadout`
- **Data labels below stats:** DM Sans 400, `xs` (11px), UPPERCASE, `letterSpacing: 1.5`, `textMuted`
- **Section titles:** DM Sans 500, `xs` (11px), UPPERCASE, `letterSpacing: 2`, `textMuted`
- **Tab bar labels:** DM Sans 700, 10px, UPPERCASE
- **Button labels:** DM Sans 700, 16px, `letterSpacing: 0.5`

---

## Part 4 — Component Patterns

### 4.1 Full Grid Card (`compact=false`)

**Physical metaphor:** A laminated specimen card from a naturalist's collector album — slightly yellowed, with a coloured type tab at the footer.

**Exact dimensions:**
- Width: `(SCREEN_WIDTH - 48) / 2` (two columns: 20px left pad + 8px gap + 20px right pad)
- Image height: **120px** (fixed — `height: 120`, overflow hidden)
- Info section height: **90px** (fixed — `height: 90`)
- Total card height: **210px** (fixed — eliminates height inconsistency across grid)
- Outer border radius: `16px`
- Image border radius: `12px` top-only (`borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomLeftRadius: 0, borderBottomRightRadius: 0`)

**Layers (back to front):**

| Layer | Value |
|-------|-------|
| Outer drop shadow (iOS) | `shadowColor: '#1A0F00', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.30, shadowRadius: 10` |
| Outer drop shadow (Android) | `elevation: 10` |
| Card background | `surfaceCard` `#F0EBE0` |
| Inner border — highlight (top + left) | `borderTopColor: '#FFFFFF', borderLeftColor: '#FFFFFF'` — `borderWidth: 1` |
| Inner border — shadow (bottom + right) | `borderBottomColor: '#B8AD96', borderRightColor: '#B8AD96'` — `borderWidth: 1` |
| Image (top half, fixed 120px) | `resizeMode: cover` |
| Type-tint gradient on image bottom | Absolute `View`, height 32px, bottom 0 of image — `backgroundColor: TYPE_DEFINITIONS[types[0]].color` at `opacity: 0.22` |
| Info area (lower 90px) | Padding `10px 12px` |

**Info area contents:**
- Species name: Playfair Display 700, 15px, `textPrimary` `#2C1F0F`, `numberOfLines: 1`
- Breed (if non-null): DM Sans 400, 12px, `textSecondary` `#6B5C44`, `numberOfLines: 1`, marginTop: 2
- Type chips row: `flexDirection: 'row'`, gap 4px, marginTop: 6
- Footer row: RarityBadge `sm` (left) + region text (right) — DM Sans 400, 11px, `textMuted`, `numberOfLines: 1`

**Pressed state:**
- `transform: [{ scale: 0.97 }]`
- Shadow reduces: iOS `shadowOpacity: 0.15`, Android `elevation: 4`

**Glossy rarity variant:**
- Retain existing LinearGradient shimmer border wrapper
- Update gradient stops to: `['#B8860B', '#FFD700', '#D4A017', '#FFFACD', '#B8860B']`

---

### 4.2 Compact Card — Carousel (`compact=true`)

**Physical metaphor:** A small index card clipped to the collector's logbook.

**CRITICAL FIX — height consistency bug:**
Both the outer wrapper `View` and the inner `Pressable` must declare `height: 140` with `overflow: 'hidden'`. This prevents variable text content from expanding the card height.

```typescript
// In AnimonCard.tsx compact styles:
cardCompact: {
  height: 140,        // ← FIXED height
  overflow: 'hidden',
  flexDirection: 'row',
  borderRadius: 14,
  backgroundColor: surfaceCard,  // '#F0EBE0'
},
```

**Exact dimensions:**
- Width: set by parent wrapper — `SCREEN_WIDTH * 0.60`
- Height: **140px** (fixed — hard constraint, see above)
- Image: 80px × 80px (fixed square, `borderRadius: 10`)
- Border radius: `14px`

**Depth:**
- iOS shadow: `shadowColor: '#1A0F00', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.22, shadowRadius: 7`
- Android: `elevation: 7`
- Border: `borderWidth: 1, borderColor: '#E0D8C8', borderTopColor: '#F5EDD8'` (top edge slightly lighter — raised highlight)

**Info panel (right of image, fills remaining width):**
- Background: `surfaceCard` `#F0EBE0`
- Padding: `10px 10px`
- Species: Playfair Display 400, 14px, `textPrimary`, `numberOfLines: 2`
- Type chips: max 1 chip in compact mode — `animon.types.slice(0, 1)`
- Footer: RarityBadge `sm` + region in 10px DM Sans 400 `textMuted`, `numberOfLines: 1`

---

### 4.3 Rarity Badge

**Physical metaphor:** Stamped wax seal (rare/glossy) or ink-impression stamp (common/uncommon).

**Size `sm`:** height 18px, paddingHorizontal 8px, fontSize 10px, borderRadius 5px  
**Size `md`:** height 22px, paddingHorizontal 10px, fontSize 12px, borderRadius 6px

| Rarity | Background | Text | Border | Shadow |
|--------|------------|------|--------|--------|
| `common` | `#E8E4DC` (inset, no elevation) | `#8B8577`, DM Sans 700, UPPERCASE | `1px solid #C8BFA8` | None |
| `uncommon` | `#D6EDDA` | `#2D7A3A`, DM Sans 700, UPPERCASE | `1px solid #A8D4B0` | iOS: `shadowColor: '#2D7A3A', offset: {0,1}, opacity: 0.30, radius: 3` · Android: `elevation: 2` |
| `rare` | `#D6E4F5` | `#2A5B9E`, DM Sans 700, UPPERCASE | `1px solid #A8C4E0` | iOS: `shadowColor: '#2A5B9E', offset: {0,1}, opacity: 0.35, radius: 3` · Android: `elevation: 2` |
| `glossy` | LinearGradient `['#D4AF37','#FFD700','#B8860B']` (horizontal) | `#3D2B00`, DM Sans 700, UPPERCASE | `1.5px solid #8B6914` | iOS: `shadowColor: '#B8860B', offset: {0,2}, opacity: 0.5, radius: 5` · Android: `elevation: 4` |

---

### 4.4 Type Tag Chip

**Physical metaphor:** Colour-coded classification tab pinned to a specimen board.

**Geometry:**
- Size `sm`: height 20px, paddingHorizontal 8px, borderRadius 6px
- Size `md`: height 24px, paddingHorizontal 10px, borderRadius 7px

**Visual:**
- Background: `TYPE_DEFINITIONS[type].color` (existing — all 10 type colours unchanged)
- Text: `TYPE_DEFINITIONS[type].textColor` — DM Sans 700, 10px (`sm`) / 12px (`md`), UPPERCASE, `letterSpacing: 0.8`
- Emoji prefix: 12px (`sm`) / 14px (`md`), marginRight 3px
- Inner border top: `rgba(255,255,255,0.28)` at 1px (raised highlight edge)
- Inner border bottom: `rgba(0,0,0,0.18)` at 1px (shadow base)
- iOS shadow: `shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.20, shadowRadius: 2`
- Android: `elevation: 2`

---

### 4.5 Tab Bar — Device Control Panel

**Physical metaphor:** The physical control strip at the bottom edge of the BioField Scanner — moulded dark casing, brushed-metal top edge, LED status indicators above each tab.

**Container:**
- Background: `deviceBezel` `#1A1208`
- Height: 72px + safe-area bottom inset
- Top border: `2px solid #3A3530` (brushed metal top edge)
- Border radius: 0 (flat physical band — no curves)
- Rivet detail: two small `View` circles (`width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#5C5548'`) positioned absolutely at top-left (left: 10, top: 7) and top-right (right: 10, top: 7) of the container

**Tab item — inactive:**
- Icon: 22px, tint `#5C5548` (metalBrushLight)
- Label: DM Sans 700, 10px, UPPERCASE, colour `#5C5548`
- LED dot above icon: `width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#2C2416'` (unlit — same as device body, barely visible)

**Tab item — active:**
- Icon: 22px, tint `scannerGreenGlow` `#52B788`
- Label: DM Sans 700, 10px, UPPERCASE, colour `#52B788`
- LED dot: `width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#52B788'`
- LED iOS glow: `shadowColor: '#52B788', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.85, shadowRadius: 6`
- Active top line: `borderTopWidth: 2, borderTopColor: '#52B788'` on the tab item itself

**Camera tab (centre — special):**
- Raised circular disc: `width: 52, height: 52, borderRadius: 26`
- Disc background: `scannerGreen` `#1B4332`
- Disc border: `2px solid #52B788`
- Camera icon: 26px, tint `#F5F0E8`
- `marginBottom: 10` to raise it above the bar baseline
- iOS shadow on disc: `shadowColor: '#52B788', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.60, shadowRadius: 8`
- Android: `elevation: 12`

---

### 4.6 Buttons

**Primary button — rest state:**
- Background: `scannerGreen` `#1B4332`
- Height: 52px
- Border radius: 10px
- Outer dark edge: `borderWidth: 1, borderColor: '#0D2218'`
- Inner highlight (top): `borderTopColor: 'rgba(255,255,255,0.15)'` — creates raised ridge
- Inner shadow (bottom): `borderBottomColor: 'rgba(0,0,0,0.35)'`
- Label: DM Sans 700, 16px, `textInverse` `#F5F0E8`, `letterSpacing: 0.5`
- iOS shadow: `shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.40, shadowRadius: 6`
- Android: `elevation: 8`

**Primary button — pressed state:**
- Background: `scannerGreenMid` `#2D6A4F` (slightly lighter — reveals deeper layer beneath)
- `transform: [{ scale: 0.98 }, { translateY: 2 }]` (button sinks 2px)
- iOS shadow: `shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.20, shadowRadius: 2`
- Android: `elevation: 2`

**Secondary button:**
- Background: `surfacePanel` `#EDE8DC`
- Border: `1.5px solid #C8BFA8`
- Label: `textPrimary` `#2C1F0F`
- Same depth system, iOS shadow at `shadowOpacity: 0.15, shadowRadius: 4`, Android `elevation: 4`

**Destructive button:**
- Background: `#7F1D1D` (deep red)
- Label: `#F5F0E8`
- Same raised/pressed depth system as primary

---

### 4.7 Stats Readout Panel

**Physical metaphor:** An LCD/VFD data panel on scientific field equipment.

**Container:**
- Background: `deviceBezel` `#1A1208`
- Border radius: 8px
- Padding: `12px 14px`
- Border: `1px solid #3A3530`
- Inner top highlight stripe: `1px rgba(255,255,255,0.05)` — achieved with a `View` at absolute top of height 1
- iOS drop shadow: `shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.60, shadowRadius: 4`
- Android: `elevation: 2`

**Primary value (number):**
- Font: Space Mono 700 Bold
- Size: 48px for primary hero stats (`4xl`), 24px for grid stats (`xl`), 20px for inline stats
- Colour: `amberReadout` `#E8C97E`
- `letterSpacing: 1.5`

**Unit suffix (e.g. "%"):**
- Font: Space Mono 400, 16px
- Colour: `amberGlow` `#F59E0B`
- `alignSelf: 'flex-end', marginBottom: 6` (baseline-aligns with bottom of large number)

**Label below value:**
- Font: DM Sans 400, 11px, UPPERCASE, `letterSpacing: 1.5`
- Colour: `#6B5C44` (dimmed secondary)
- marginTop: 4

---

### 4.8 Camera Reticle / Scanner UI

**Physical metaphor:** A military-grade targeting scope with sonar ping capability.

**Full-screen overlay:**
- Background: `rgba(15, 10, 5, 0.75)` (very dark warm black — over the live camera feed)

**Reticle box:**
- Size: 240px × 240px, horizontally centred, vertically offset 40% from top
- Transparent interior — shows camera through

**L-bracket corner markers (4 corners):**
- Each corner made of two `View` rectangles meeting at 90°:
  - Horizontal arm: `width: 28, height: 3, borderRadius: 1`
  - Vertical arm: `width: 3, height: 28, borderRadius: 1`
- Colour: `amberGlow` `#F59E0B`
- iOS glow: `shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.90, shadowRadius: 8`
- Android: `elevation: 8`
- Positioning: use absolute layout — top-left corner at `{ top: 0, left: 0 }`, top-right at `{ top: 0, right: 0 }`, etc.

**Inner scan line (animated):**
- `View` with `height: 1, width: 236` (reticle interior width minus 2px each side)
- Background: `rgba(245, 158, 11, 0.55)`
- Animates `translateY` from `0` to `237` using `withRepeat(withTiming(237, { duration: 1800, easing: Easing.linear }), -1, false)`

**Pulse ring (animated):**
- Centred `View` with circular border only (no fill)
- Starting: `width: 0, height: 0, borderRadius: 0, opacity: 0.8`
- Ending: `width: 280, height: 280, borderRadius: 140, opacity: 0`
- Border: `2px solid rgba(245, 158, 11, 0.4)`
- Loop via `withRepeat(withTiming(..., { duration: 2200 }), -1, false)` — use `useSharedValue` + `useAnimatedStyle` for both scale and opacity simultaneously

**Status text above reticle:**
- "SCANNING..." — Space Mono 400, 13px, `amberReadout` `#E8C97E`, `letterSpacing: 3`
- Blinking opacity: `withRepeat(withSequence(withTiming(1, {duration:600}), withTiming(0.2, {duration:600})), -1, false)`

**Confidence readout below reticle:**
- Dark panel (Stats Readout Panel spec, compact form):
  - Background `#1A1208`, borderRadius 10px, padding `10px 16px`, margin `16px 0 0`
  - "CONFIDENCE" label: DM Sans 400, 10px, UPPERCASE, `letterSpacing: 1.5`, `#6B5C44`
  - Value: Space Mono 700, 24px, `amberReadout` — e.g. "89%"
  - Below: species candidate in Playfair Display 700, 16px, `#F5F0E8`

**Slide-up result card (on capture):**
- Bottom sheet with `borderTopLeftRadius: 24, borderTopRightRadius: 24`
- Background: `surfaceCard` `#F0EBE0`
- Handle pill: `width: 36, height: 4, borderRadius: 2, backgroundColor: '#C8BFA8'`, centred, marginTop 12
- Top shadow: `shadowColor: '#000', shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.30, shadowRadius: 16`
- "CAPTURE CONFIRMED ✓": Space Mono 700, 11px, `scannerGreenLight`, `letterSpacing: 2`, marginTop 16, centred
- Animated in with `withTiming(0, { duration: 350 })` on `translateY` from screen height to final position
- Content: full AnimonCard info section (species, breed, type chips, RarityBadge, region)
- Two buttons: "ADD TO COLLECTION" (primary green, full width) + "DISCARD" (secondary, full width), 12px gap

---

## Part 5 — Screen-by-Screen Specs

### Screen 1: Discover (Home)

**Shell:**
- `SafeAreaView` background: `deviceBody` `#2C2416` — device casing shows at top + bottom safe areas
- Scrollable content background: `screenBg` `#F5F0E8`
- Thin `deviceBezel` strip: 8px `View` at top of scroll content area (screen bezel illusion)

**Header section:**
- Background: `screenBg`
- Horizontal padding: 20px, top padding: 20px
- App wordmark "Anílog" (tiny, DM Sans 400, 11px, UPPERCASE, `letterSpacing: 3`, `textMuted`) above heading — gives device boot-screen flavour
- "Discover" heading: Playfair Display 700, 36px (`3xl`), `textPrimary` `#2C1F0F`
- Greeting: DM Sans 400, 15px, `textSecondary` `#6B5C44`, marginTop 4

**Stats bar:**
- Horizontal `ScrollView`, no scrollbar, `contentContainerStyle: { paddingHorizontal: 20, gap: 10 }`
- Each stat chip:
  - Background: `deviceBezel` `#1A1208`
  - Border radius: 8px
  - Padding: `8px 14px`
  - Border: `1px solid #3A3530`
  - iOS shadow: `shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.40, shadowRadius: 4`
  - Android: `elevation: 4`
  - Emoji icon: 16px, marginRight 6
  - Label: Space Mono 400, 13px, `amberReadout` `#E8C97E`

**"RECENTLY CAUGHT" section header:**
- Horizontal padding: 20px
- Left label: DM Sans 500, 11px, UPPERCASE, `letterSpacing: 2`, `textMuted` `#A09070`
- Right link "SEE ALL →": DM Sans 700, 12px, `scannerGreenLight` `#40916C`
- Decorative rule beneath: `height: 1, backgroundColor: '#D4CEBC'`, marginTop 8, marginBottom 12

**Recently Caught carousel:**
- `paddingLeft: 20` on `contentContainerStyle`, gap between cards: 12px
- Each card width: `SCREEN_WIDTH * 0.60`
- Each card height: **140px FIXED** (see 4.2 — this is the height consistency fix)
- Snap behaviour: `decelerationRate="fast"`, `snapToInterval: SCREEN_WIDTH * 0.60 + 12`, `snapToAlignment="start"`
- Parent wrapper `View` must also declare `height: 140` to prevent carousel row from stretching

**Nearby Activity section:**
- Outer panel: `surfacePanel` `#EDE8DC`, `borderRadius: 16`, `margin: 0 20px`, `padding: 16px`, `borderWidth: 1, borderColor: '#C8BFA8'`
- Panel iOS shadow: `shadowColor: '#1A0F00', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 8`
- Android: `elevation: 3`
- Each activity item:
  - `flexDirection: 'row'`, `alignItems: 'center'`, padding `12px 0`
  - Separator between items: `height: 1, backgroundColor: '#D4CEBC'`
  - LED dot (left): `width: 8, height: 8, borderRadius: 4`, background = `colors.rarity[item.rarity]`
  - iOS LED glow: `shadowColor: colors.rarity[item.rarity], shadowOffset: {0,0}, shadowOpacity: 0.70, shadowRadius: 4`
  - Dot marginRight: 12
  - Message: DM Sans 500, 14px, `textPrimary`, `numberOfLines: 2`
  - Meta (region · time): DM Sans 400, 12px, `textMuted`, marginTop 2

---

### Screen 2: My Anílog

**App bar:**
- Background: `screenBg`
- Padding: `20px 20px 12px`
- "My Anílog": Playfair Display 700, 30px, `textPrimary`
- Below heading: Space Mono 400, 12px, `amberReadout` on dark inline badge — "12 SPECIMENS LOGGED"
  - Inline badge: `backgroundColor: '#1A1208', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6`

**Type filter strip:**
- Horizontal `ScrollView`, `contentContainerStyle: { paddingHorizontal: 20, paddingVertical: 12, gap: 8 }`
- Inactive chip:
  - Background: `surfacePanel` `#EDE8DC`
  - Border: `1px solid #C8BFA8`
  - Border radius: 8px
  - Padding: `6px 14px`
  - Label: DM Sans 500, 13px, `textSecondary`
  - iOS shadow (raised): `shadowColor: '#000', shadowOffset: {0,2}, shadowOpacity: 0.15, shadowRadius: 3`
  - Android: `elevation: 3`
- Active/selected chip (inset/pressed-in):
  - Background: `surfaceInset` `#D4CEBC`
  - `borderTopColor: '#B8AD96'` (shadow top — inset effect)
  - `borderBottomColor: '#E8E2D0'` (highlight bottom — inset effect)
  - `borderLeftColor: '#B8AD96'`, `borderRightColor: '#E8E2D0'`
  - `borderWidth: 1`
  - iOS shadow: none (`elevation: 0`)
  - Android: `elevation: 0`
  - Left: type emoji 14px, marginRight 4
  - Label: DM Sans 700, 13px, `TYPE_DEFINITIONS[type].color`

**Grid:**
- `FlatList`, `numColumns: 2`
- `contentContainerStyle: { padding: 12 }`
- `columnWrapperStyle: { gap: 12 }`
- Row gap: `marginBottom: 12` on each card
- Cards: full AnimonCard spec (Section 4.1)

---

### Screen 3: Camera Modal

**Full-screen shell:**
- Background: `#0F0A05` (very dark warm black — no light bleed)
- `StatusBar` style: `light-content`

**Top control bar:**
- Height: 56px
- Background: `deviceBezel` `#1A1208`
- Border bottom: `1px solid #3A3530`
- Padding: `0 20px`
- `flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'`
- Left: "✕ CLOSE" — DM Sans 700, 12px, UPPERCASE, `amberReadout`
- Centre: "SCANNER MK-II" — Space Mono 400, 11px, `#5C5548`, `letterSpacing: 2`
- Right: two-toggle pill (PHOTO | VIDEO):
  - Container: `backgroundColor: '#2C2416', borderRadius: 6, flexDirection: 'row'`
  - Each option: DM Sans 700, 10px, UPPERCASE. Active: `backgroundColor: '#1B4332', color: '#52B788'`. Inactive: `color: '#5C5548'`
  - Padding: `4px 10px`, border radius 5px

**Viewfinder area:**
- Fills from bottom of top bar to top of bottom panel — approximately 70% of screen height
- `expo-camera` `CameraView` fills this space
- Reticle overlay rendered on top of camera (see Section 4.8)

**Bottom shutter panel:**
- Background: `deviceBezel` `#1A1208`
- Height: 160px
- Border top: `2px solid #3A3530` (brushed metal edge)
- Shutter button (centred):
  - Outer ring: `width: 76, height: 76, borderRadius: 38`, `borderWidth: 3, borderColor: '#C8BFA8'`
  - Inner disc: `width: 60, height: 60, borderRadius: 30`, background LinearGradient `['#F5EDD8', '#E8DCC8']`
  - iOS shadow on outer ring: `shadowColor: '#F59E0B', shadowOffset: {0,0}, shadowOpacity: 0.40, shadowRadius: 12`
  - Android: `elevation: 10`
  - Pressed state: inner disc darkens to `#D4CEBC`, `scale: 0.95`
- Left of shutter (gallery thumbnail):
  - 44px × 44px, `borderRadius: 8`, `borderWidth: 1, borderColor: '#3A3530'`
  - Label below: "GALLERY" Space Mono 400, 9px, `#5C5548`, `letterSpacing: 1`
- Right of shutter (flash toggle):
  - Flash icon 24px, tint `#5C5548` (off) / `amberGlow` `#F59E0B` (on)
  - Label: "FLASH" Space Mono 400, 9px, `#5C5548`

---

### Screen 4: Animon Detail

**Hero image:**
- Height: 280px, `width: '100%'`, `resizeMode: 'cover'`
- Bottom gradient fade: absolute `View`, height 110px, bottom 0, LinearGradient `['transparent', 'rgba(44,31,15,0.82)']`
- Species name (on gradient): Playfair Display 900 Black, 32px, italic where breed exists, `#F5F0E8`, `position: 'absolute', bottom: 16, left: 20, right: 20`
- Breed subtitle: DM Sans 400, 16px, `rgba(245,240,232,0.72)`, immediately below species name (bottom: 44px aligned)

**Back button:**
- `position: 'absolute', top: 52, left: 16` (inside hero image area)
- `width: 40, height: 40, borderRadius: 20`
- Background: `rgba(26,18,8,0.70)`
- Border: `1px solid rgba(255,255,255,0.15)`
- "←" text: DM Sans 700, 20px, `#F5F0E8`

**Data plate (immediately below hero):**
- Background: `surfacePanel` `#EDE8DC`
- Padding: `14px 20px`, `borderBottomWidth: 1, borderBottomColor: '#C8BFA8'`
- Row 1: all type chips (`md` size), `flexDirection: 'row', flexWrap: 'wrap', gap: 6`
- Row 2 (marginTop 10): RarityBadge `md` (left) + Space Mono 400, 12px `textMuted` date string (right)

**Stats grid (2 × 2):**
- `padding: 16px 20px`
- `flexDirection: 'row', flexWrap: 'wrap', gap: 12`
- Each cell: Stats Readout Panel (Section 4.7) at `width: (SCREEN_WIDTH - 52) / 2`
  - Height: 80px
  - CONFIDENCE: value 20px Space Mono 700 + "%" suffix in amberGlow
  - GENDER / REGION / DATE: value 16px Space Mono 700 (text values, not numeric)
  - Label: 10px DM Sans 400 UPPERCASE below

**"Capture Notes" panel:**
- `backgroundColor: surfacePanel, borderRadius: 12, padding: 16, margin: '0 20px 24px'`
- Border: `1px solid #C8BFA8`
- Panel title: DM Sans 700, 12px, UPPERCASE, `letterSpacing: 1.5`, `textMuted`, marginBottom 12
- Each detail row: `flexDirection: 'row', justifyContent: 'space-between'`, `paddingVertical: 8`, separator `1px solid #D4CEBC`
  - Label: DM Sans 400, 13px, `textMuted`
  - Value: DM Sans 500, 13px, `textPrimary`
- Fields: Colour, Region, Captured, Confidence

---

### Screen 5: Milestones

**Header:** Same pattern — Playfair Display 700, 30px "Milestones" + Space Mono sub-label

**Species progress gauges:**
- Each gauge panel:
  - Background: `deviceBezel` `#1A1208`
  - Border radius: 10px
  - Padding: `14px 16px`
  - Margin: `0 20px 10px`
  - Border: `1px solid #3A3530`
  - iOS shadow: `shadowColor: '#000', shadowOffset: {0,3}, shadowOpacity: 0.40, shadowRadius: 5`
  - Android: `elevation: 5`
- Label row:
  - Left: species / type name — DM Sans 500, 14px, `amberReadout` `#E8C97E`
  - Right: count fraction e.g. "7 / 10" — Space Mono 400, 13px, `amberReadout`
- Gauge track:
  - `height: 10, borderRadius: 5, backgroundColor: '#0D0A05'`
  - Border: `1px solid #2C2416`
  - `marginTop: 10, overflow: 'hidden'`
- Gauge fill:
  - `height: 10, borderRadius: 5`
  - Background: `scannerGreenLight` `#40916C` (default; use type colour for type-specific rows)
  - Width: animated via `Animated.Value` to fill percentage
  - iOS glow on fill: `shadowColor: '#52B788', shadowOffset: {0,0}, shadowOpacity: 0.60, shadowRadius: 4`

**Rarity breakdown grid (2 columns):**
- Same 2-col `FlatList` layout, `gap: 12, padding: 20`
- Each cell (`surfaceCard`, `borderRadius: 14, padding: 16, alignItems: 'center'`):
  - RarityBadge extra-large: height 28px, fontSize 13px, paddingHorizontal 14px
  - Large number: Space Mono 700, 48px, `colors.rarity[rarity]`
  - Label: "SPECIMENS" DM Sans 400, 10px, UPPERCASE, `textMuted`, marginTop 4
  - iOS shadow: `shadowColor: '#1A0F00', shadowOffset: {0,3}, shadowOpacity: 0.18, shadowRadius: 6`
  - Android: `elevation: 5`

**Achievement cards:**
- Full viewport-width cards with `margin: 0 20px 12px`
- Background: `surfacePanel`, `borderRadius: 14`, `overflow: 'hidden'`
- Left accent stripe: `width: 6, position: 'absolute', top: 0, bottom: 0, left: 0`
  - Colour by tier: Bronze `#CD7F32` / Silver `#A8A9AD` / Gold `#F59E0B`
- Content padding: `14px 16px 14px 22px` (extra left to clear stripe)
- `flexDirection: 'row', alignItems: 'center'`
- Shield icon (left): 40px emoji or SVG, marginRight 14
- Title: DM Sans 700, 16px, `textPrimary`
- Description: DM Sans 400, 13px, `textSecondary`, marginTop 2
- Locked state: entire card `opacity: 0.45`, stripe colour desaturated to `#6B6B6B`

---

### Screen 6: Profile

**Hero / avatar zone:**
- Background: `scannerGreen` `#1B4332`, height 210px (plus safe area top)
- Semi-transparent dark overlay for depth: absolute `View`, `backgroundColor: 'rgba(0,0,0,0.18)'`, `StyleSheet.absoluteFill`
- Avatar circle: `width: 84, height: 84, borderRadius: 42`
  - Border: `borderWidth: 4, borderColor: amberGlow` `#F59E0B`
  - Background: `amberReadout` `#E8C97E`
  - Initials: Playfair Display 700, 30px, `scannerGreen` `#1B4332`
  - iOS glow: `shadowColor: '#F59E0B', shadowOffset: {0,0}, shadowOpacity: 0.60, shadowRadius: 10`
  - Android: `elevation: 10`
- Username: Playfair Display 700, 22px, `#F5F0E8`, marginTop 12
- "Member since March 2026": DM Sans 400, 13px, `rgba(245,240,232,0.65)`, marginTop 4

**Stats strip (3 readout panels):**
- `flexDirection: 'row'`, `margin: 0 20px`, `borderRadius: 10`
- Background: `deviceBezel` `#1A1208`
- 3 equal-width panels separated by `width: 1, backgroundColor: '#3A3530'` dividers
- Each panel: `padding: 12px 8px, alignItems: 'center'`
  - Value: Space Mono 700, 28px, `amberReadout` `#E8C97E`
  - Label: DM Sans 400, 10px, UPPERCASE, `letterSpacing: 1.5`, `#6B5C44`
- iOS shadow: `shadowColor: '#000', shadowOffset: {0,4}, shadowOpacity: 0.40, shadowRadius: 6`
- Android: `elevation: 6`

**Rarity breakdown bar:**
- `margin: 20px 20px 0`, `height: 16, borderRadius: 8`, `flexDirection: 'row', overflow: 'hidden'`
- Segmented: each `View` with `flex` proportional to count, `backgroundColor: colors.rarity[tier]`
- No gap between segments (seamless fill)
- Labels beneath: `flexDirection: 'row'`, proportional widths matching bar, `paddingTop: 6`
  - Each label: count (Space Mono 700, 11px, rarity colour) + rarity name (DM Sans 400, 10px, `textMuted`)

**Last Catches:**
- "LAST CATCHES" section header (same pattern — DM Sans 500, 11px UPPERCASE `textMuted`)
- Horizontal carousel of compact cards, identical spec to Screen 1

**Anílog+ banner:**
- `margin: 20px 20px 32px`, `borderRadius: 16, overflow: 'hidden'`
- Background: LinearGradient `['#163D2C', '#1B4332', '#163D2C']` (horizontal L→R)
- Border: `1.5px solid #52B788`
- iOS shadow: `shadowColor: '#52B788', shadowOffset: {0,4}, shadowOpacity: 0.30, shadowRadius: 12`
- Android: `elevation: 8`
- Padding: `20px`
- Top row: "Anílog+" in Playfair Display 700 italic, 22px, `amberGlow` `#F59E0B` + "PREMIUM" pill (DM Sans 700, 9px, UPPERCASE, `backgroundColor: '#F59E0B', color: '#1B4332', borderRadius: 4, padding: '2px 6px'`)
- Body text: DM Sans 400, 14px, `rgba(245,240,232,0.85)`, marginTop 8 — "Unlock unlimited captures, glossy radar & exclusive species alerts."
- CTA: Primary button compact variant — height 40px, `marginTop: 16`, full width, text "UPGRADE"

---

## Part 6 — Implementation Notes for Developer

### New Packages Required

```bash
npx expo install @expo-google-fonts/playfair-display @expo-google-fonts/space-mono
```

Remove after migrating all references:
```bash
npx expo uninstall @expo-google-fonts/dm-serif-display
```

---

### colors.ts Migration

Replace `src/constants/colors.ts` entirely with the palette from Part 2.

All existing colour references in screen files and components must be updated per the migration map in Part 2. A global find-and-replace on token names is sufficient.

---

### Key StyleSheet Patterns

**Raised element (button, chip at rest):**
```typescript
{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.35,
  shadowRadius: 5,
  elevation: 6,
}
```

**Deep raised card:**
```typescript
{
  shadowColor: '#1A0F00',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.30,
  shadowRadius: 10,
  elevation: 10,
}
```

**Inset data panel:**
```typescript
{
  backgroundColor: '#D4CEBC',    // surfaceInset
  borderTopWidth: 1,
  borderTopColor: '#B8AD96',     // shadow edge — feels pushed down from top
  borderBottomWidth: 1,
  borderBottomColor: '#E8E2D0',  // highlight edge — light hits bottom of recess
  borderLeftWidth: 1,
  borderLeftColor: '#B8AD96',
  borderRightWidth: 1,
  borderRightColor: '#E8E2D0',
}
```

**Raised card inner border (bevel effect):**
```typescript
{
  borderWidth: 1,
  borderTopColor: '#FFFFFF',      // highlight — light comes from top-left
  borderLeftColor: '#FFFFFF',
  borderBottomColor: '#B8AD96',   // shadow — bottom-right is in shadow
  borderRightColor: '#B8AD96',
}
```

**Active LED glow (green):**
```typescript
{
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: '#52B788',   // scannerGreenGlow
  shadowColor: '#52B788',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.85,
  shadowRadius: 6,
  elevation: 6,
}
```

**Scanner corner amber glow:**
```typescript
{
  shadowColor: '#F59E0B',        // amberGlow
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.90,
  shadowRadius: 8,
  elevation: 8,
}
```

**Pressed-in button (active state delta):**
```typescript
// Apply transform + reduce shadow when Pressable pressed=true
transform: [{ scale: 0.98 }, { translateY: 2 }],
shadowOpacity: 0.20,   // reduced from 0.40
elevation: 2,           // reduced from 8
```

---

### Compact Card Height Fix — Exact Code

In `AnimonCard.tsx`, the `StyleSheet` entries for compact mode must be:

```typescript
cardCompact: {
  height: 140,         // ← FIXED — this is the source of truth
  overflow: 'hidden',
  flexDirection: 'row',
  borderRadius: 14,
  backgroundColor: '#F0EBE0',
},
compactInner: {
  flex: 1,
  height: 140,         // ← Also fixed — do not omit
  overflow: 'hidden',
  flexDirection: 'row',
},
imageCompact: {
  width: 80,
  height: 80,
  borderRadius: 10,
  alignSelf: 'center',
  marginLeft: 10,
},
compactInfo: {
  flex: 1,
  padding: 10,
  justifyContent: 'space-between',
  overflow: 'hidden',
},
```

In `HomeScreen`, the wrapper `View` for each carousel card must also declare `height: 140`:

```typescript
<View key={animon.id} style={{ width: COMPACT_CARD_WIDTH, height: 140 }}>
  <AnimonCard animon={animon} compact onPress={handleCardPress} />
</View>
```

---

### Simulating Texture in React Native

React Native has no built-in texture system. Achieve the tactile parchment/metal feel through:

1. **Raised bevel (parchment cards):** Use the inner border highlight/shadow pattern above — this single technique accounts for ~60% of the skeuomorphic depth perception. Cost: zero. Works on all platforms.

2. **Dark panel scanline simulation (optional):** Inside a Stats Readout Panel, render 2–3 absolutely positioned horizontal `View` lines with `height: 1, backgroundColor: 'rgba(255,255,255,0.04)'` spaced 16px apart. Creates a subtle CRT scanline. Don't overuse.

3. **Parchment texture (optional, low priority):** Apply a small `ImageBackground` with a local asset `/assets/noise-parchment.png` (50×50px, greyscale noise at 4% opacity) set to `resizeMode="repeat"` behind `screenBg` zones. The flat `#F5F0E8` alone reads as warm aged paper — this is optional enhancement only.

4. **Avoid:** `react-native-linear-gradient` for every element — use it only where specified (glossy badge, Anílog+ banner, hero overlay, shutter button). Overuse dilutes the effect.

---

### Platform-Specific Notes

**iOS (primary visual target):**
All shadow values in this spec are iOS-format (`shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`). These render natively with sub-pixel accuracy at no extra cost.

**Android:**
Use the `elevation` values paired with each iOS shadow spec throughout this document. Android `elevation` cannot produce coloured glow effects (LED active, glossy shimmer). For those, substitute a `View` wrapper with a matching `borderColor` and `borderWidth: 1.5` around the glowing element — this approximates the effect at device level.

**Web:**
- Use NativeWind `className="shadow-[...]"` for `boxShadow` equivalents where inline styles are insufficient
- Example for card shadow: `className="shadow-[0_5px_20px_rgba(26,15,0,0.28)]"`
- The parchment background and type colours render correctly on web unchanged
- The `deviceBody`/`deviceBezel` chrome is most visible on mobile form factor; on web, a simple fixed-width centred container with `deviceBody` background achieves the same device-in-browser feel

---

*End of Spec — v1.0*
