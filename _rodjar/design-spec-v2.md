# Anílog Design Spec v2 — Field Naturalist Edition
**Date:** 2026-03-05  
**Status:** SPEC COMPLETE — awaiting Frontend Developer implementation  
**Authored by:** UX UI Designer  
**Skills invoked:** `interface-design`, `refactoring-ui`, `microinteractions`

---

## PART 1: DOMAIN EXPLORATION
_(Required by interface-design skill — do not skip, do not abbreviate)_

### 1.1 Who Is This Human?

They are outside. Right now. They just spotted a bird they don't recognise on a trail above the lake. Their hands may be dusty or gloved. They pull out their phone — not to scroll social media, not to check notifications — to capture this specific moment before the animal moves. Anílog is a field instrument. It should feel like one it should not feel like a collectibles app that happens to use a camera.

**5 minutes before they open the app:** walking, looking at things, absorbed in the physical world.  
**5 minutes after:** the phone goes back in the pocket and they keep exploring.

This shapes everything. The app must be fast, legible in direct sunlight, and reward the act of finding real animals.

---

### 1.2 Domain: Concepts from the Naturalist World

These are not features — they are the territory this app inhabits. Every visual decision must connect back to at least one of these.

1. **Specimen labels** — The small rectangles of card stock pinned below every pinned insect or pressed plant in a natural history museum. Handwritten or typed. Latin binomial name in italic. Collector abbreviation, date, precise location. Dense, precise, informational. These contain the most important metadata in the collection. They are the primary mental model for the AnimonCard label strip.

2. **Field journal pages** — Naturalists carry pocket-sized bound notebooks with cream/ivory pages — not white. Ink is dark, often blue-black. Entries are dated. Sketches coexist with text. Pages have slight cream/ochre tint from acid content in the paper — this is not white paper that has aged; it was always this color. Moleskine's Field Notes version. This is the surface that the main screen background should evoke.

3. **Entomology and ornithology specimen drawers** — Museum storage. Pinned moths behind glass, sorted by family in rectilinear grid arrangements. Each specimen earns its spot. The joy of the drawer is in the accumulation of specifically-earned items. The grid of AnimonCards is this drawer seen from above.

4. **Portable field equipment** — The Garmin eTrex GPS. The Bushnell binoculars. The hand lens / loupe used to examine insects. Physical characteristics: rubberised grip sections, recessed LCD display (transflective, legible in sun), olive-drab/dark-tan casing, physical tactile buttons. The TabBar must evoke this panel — not space-age chrome, but instrument hardware.

5. **Field guide plates** — Audubon Society, Peterson's, Sibley's. Species illustrated against white or cream ground. Colored edge bands on book faces indicating taxonomic family groupings. Precise comparison of similar species. The TypeTagChip should feel like the color band that says "this belongs to THIS family."

6. **Taxonomy identification keys** — The branching dichotomous key used to identify species. Diamond shapes and branching paths. These inform the categorisation visual language. Type chips are not decoration — they are taxonomic classification.

7. **Herbarium sheets** — Dried, pressed plants affixed with small adhesive strips to acid-free paper. A rectangular paper label in the corner: institution name, binomial name, collector's name, date, grid reference. The label is slightly smaller than a playing card, cream, with a printed border. This is the direct model for the specimen label strip in AnimonCard.

8. **India ink on cream paper** — The actual color of a naturalist's freshly-written field notes. Not pure black — warm blue-black, a hair's breadth away from navy. Not on white paper — on paper with warmth, slight ochre tinge. This pairing — inkBlack on specimenCream — is the typographic core of the whole system.

---

### 1.3 Color World

_If you walked into the physical version of Anílog's world, what colors would you see? List actual real-world colors, not adjectives._

1. **Herbarium paper** — The specific off-white of acid-free archival paper that has been in a museum collection for 20+ years. Warm ivory-ochre. Not beige (too gray), not cream (too yellow). The actual color is approximately `#F2EDD7` — you can see it in any herbarium sheet photo from Kew Gardens or the Smithsonian.

2. **India ink** — Pen filling a specimen label with a fine nib. Deep warm blue-black, `#1C1B2E`. Not printer black `#000000`. The warmth comes from the iron gall content; the depth from the concentration.

3. **Lichen on basalt** — The specific gray-green of foliose lichen covering a wet stone on a Scottish moorland or a North American trail. Not sage, not army green, not olive. The color of the actual organism on the actual rock: `#8A9A7B`.

4. **Amber resin** — An insect trapped in Cretaceous amber, held up to a lightbox. The color of fossilized honey, warm and glowing: `#C6882A`. Not gold (too metallic), not yellow (too bright). Amber.

5. **Forest floor shadow** — Looking up at the canopy from the forest floor, the deep dark green where light rarely reaches: `#1A3020`. This is the color of the instrument panel / header areas. It reads as depth and authority without being black.

6. **Dried specimen label brown** — The warm, slightly red-tinged umber of aged archival paper labels that have been handled repeatedly by museum staff over decades: `#7A5C3A`.

7. **Entomologist's specimen drawer felt** — The deep teal-green baize lining that museum specimen drawers are lined with. Formal, precise, institutional: `#2C4A3E`.

8. **Pinned moth wing dust** — The very fine powdery scales from a Lepidoptera specimen, dusty warm taupe at the edges of where it was handled: `#B8AE97`.

9. **Verdigris on brass hardware** — The oxidised patina on the brass fittings of a Victorian-era specimen cabinet: `#7C9E8C`.

10. **Amber LED warm-up** — The specific bright warm amber of an analog instrument LED indicator when it first switches on — not orange, not yellow: `#E8B455`.

---

### 1.4 Signature Element

> **One element that could ONLY exist for Anílog.**

**The Typed Specimen Label Strip** at the base of every AnimonCard.

Real museum specimen cards — whether insect, bird skin, or pressed plant — have a small rectangle of cream paper pinned or adhered below the specimen. It contains: the binomial species name in italic, the collector's initials and date, and a catalogue number. The information is dense, precise, and printed in a typewriter-adjacent font. It sits below the specimen, ruled off from it by a thin horizontal line.

For Anílog, every AnimonCard has this strip at the bottom:
- A 1px horizontal rule (ruleColor) separating it from the image
- Species name in Space Mono italic, ink-black
- A small accession number (truncated ID) right-aligned — e.g., `##-042`
- Region code in small caps below

This element is **physically impossible to mistake for any other product**. It requires knowing what a naturalist specimen drawer looks like. It is not decorative — it carries the most important card metadata. It passes the signature test: could this element appear in a fitness tracker, a travel app, a recipes app? No. It belongs here and only here.

Signature appears in **six** specific components (passing the 5+ test):
1. **AnimonCard full** — specimen label strip at base of every card
2. **AnimonCard compact** — accession number in mono at image overlay, top-right, like a tag
3. **RarityBadge** — stamp impression aesthetic, not a pill
4. **TypeTagChip** — inset/recessed color band, not a filled chip
5. **Detail screen ID block** — "SPECIMEN ID" header + `# 0042` in mono, full-width
6. **TabBar** — instrument panel with LED indicators, engraved uppercase labels (not nav links)

---

### 1.5 Named Defaults (Explicitly Rejected)

> Three obvious choices that would produce generic output. Named so they cannot sneak in.

**DEFAULT 1 — REJECTED: Dark mode with glowing neon accents.**  
The obvious choice for "tech scanner device" is pure black backgrounds with bright cyan or toxic green LED glows. That is every gaming app, every sci-fi UI kit, every fintech dark mode. Real field instruments — a GPS, a radio, a field spectrophotometer — use MUTED, high-contrast displays in olive, amber, and dark tan because they must be legible in direct sunlight, one-handed, with gloves. The aesthetic is "military instrument" not "gaming peripheral." Replaced by: amber/ochre warm accents on deep forest-green and dark-walnut device chrome.

**DEFAULT 2 — REJECTED: Nature-green as the primary accent color.**  
"Nature app → must use leaf green." Every hiking app, plant identifier, outdoor lifestyle brand defaults to a #4CAF50-adjacent green. It is the color of a smoothie brand logo. The naturalist science world uses amber for data readouts (LCD), cobalt blue for museum classification, and forest floor shadows for depth — not grass green. Green in this system is used ONLY structurally (forestFloor for dark panels, lichenGray for common rarity and subtle dividers). It is never used as a call-to-action or brand highlight. Replaced by: amberResin as the active/CTA accent — because amber is what the instrument lights show.

**DEFAULT 3 — REJECTED: Rounded card with soft drop shadow.**  
The standard mobile card pattern: white/light background, 12-16px border radius, 4px soft drop shadow, image top, title+metadata bottom. This produces the AnimonCard that every AI generates for every "collectible card" prompt. A museum specimen drawer does not have rounded corners — index cards are rectangular, herbarium sheets are rectangular, pinned specimen trays are rectangular. Replaced by: borderRadius max 4px (feels like card stock corners vs. soft plastic), and cards are defined by a thin border rule (`ruleColor`) rather than drop shadow — as if they were physically placed on a surface rather than floating above it.

---

## PART 2: THE FOUR TESTS

### Swap Test

**Typeface swap:** Replace Playfair Display with Georgia. Result: the binomial species names lose their field-guide authority — Georgia is browser default, it does not carry the weight of scientific typography. Playfair Display Italic for species names is not decorative; it replicates the typographic convention of scientific naming (all printed natural history materials italicise the binomial). **Playfair earns its place.**

Replace Space Mono with SF Mono or Courier. Result: Space Mono has a neutral technical quality that reads as "printed label" rather than "code editor." Courier feels aged, Menlo feels developer. Space Mono sits at the intersection — it reads as typewritten data without feeling retro or tech-nerdy. **Space Mono earns its place.**

Replace DM Sans with Inter. Result: the UI would feel imperceptibly different. However DM Sans at optical sizes below 12px retains slightly more warmth than Inter (which is very cool and geometric). Given the warm domain palette, DM Sans is correct. **DM Sans earns its place but barely — the swap test is close here.**

**Color swap:** Replace amberResin with iOS blue `#007AFF`. The instrument-panel feel evaporates entirely — it becomes a React Native starter template. **amberResin is load-bearing for the entire system's identity.**

**Layout swap:** Replace the specimen label strip with a standard `species name / type chips / region` text block. Result: loses the ONLY element that could not exist in any other app. Generic immediately. **The specimen label strip is non-negotiable.**

**Test result: PASS** — every significant choice produces a meaningfully different feeling if swapped.

---

### Squint Test

Blurring the eye at the full-card layout:
- Hero image (warm, textured, full-bleed) — visually dominant ✓
- Specimen label strip (crisp cream/ink contrast below image) — clearly secondary zone ✓  
- Within label strip: species name (largest text element) — easily readable ✓
- Accession number (smallest, bottom-right) — subordinate, metadata ✓

Blurring at Discover screen:
- Dark header block (forestFloor) — immediately reads as "top of screen / title" ✓
- White/cream scrollable body — content area, clearly distinct from header ✓
- Stats bar chips — horizontal rhythm, readable ✓
- Section rule with label — separates content zones cleanly ✓
- Card carousel — 140px height slot, cards horizontal ✓

Blurring at TabBar:
- Dark deviceBezel base — clear bottom anchor ✓
- Amber active LED + label — jumps forward from inactive elements ✓
- Inactive tabs — recede appropriately ✓

Harshness check: the forestFloor → specimenCream transition is a strong contrast. The 8px bezel strip between them absorbs some of this — no harsh jump. The specimen label strip at card base uses a 1px rule to bridge the image-to-cream transition — no harsh jump. **Test result: PASS.**

---

### Signature Test

Can I point to FIVE specific components where the specimen label signature appears?

1. **AnimonCard full** — bottom 35% is the specimen label strip: 1px ruled line separator, Space Mono italic species, accession number right-aligned, region in small-cap mono
2. **AnimonCard compact** — a small accession tag in the top-right corner of the image (`##-042` Space Mono 10px, amberFaint label on dark overlay)
3. **RarityBadge** — stamp impression: slightly irregular border-radius pattern, Space Mono text with widest letter-spacing, ink-color text on cream-tinted background, applied with slight -1px y-offset to simulate stamped impression
4. **TypeTagChip** — inset/recessed rendering (background darker than parent surface, highlight on top border, shadow on bottom border) — field guide color band aesthetic, NOT pill-shaped
5. **Specimen ID Block (Detail screen)** — full-width label block on cream background with "SPECIMEN ID" header in small Space Mono and large `# 0042` accession number — verbatim herbarium label format
6. **TabBar LED indicators** — 4px instrument LED dots above each tab icon; active tab has amberGlow with radial shadow (actual LED light bleed) — instrument panel, not navigation links

**Test result: PASS — 6 components identified.**

---

### Token Test

Reading token names aloud — do they belong to this product's world?

| Token name | Belongs to Anílog? |
|---|---|
| `specimenCream` | ✓ immediately evokes herbarium paper |
| `inkBlack` | ✓ naturalist's pen, not "gray-900" |
| `inkBrown` | ✓ aged ink on aged paper |
| `lichenGray` | ✓ field texture, specific |
| `amberResin` | ✓ specimen in amber, unforgettable |
| `forestFloor` | ✓ the dark the canopy makes |
| `stampBrown` | ✓ the rubber stamp impression color |
| `instrumentBrass` | ✓ fieldwork hardware trim |
| `amberGlow` | ✓ the LED warm-up flash |
| `parchment` | ✓ archival surface |
| `ruleColor` | ✗ functional, not domain — rename to `inkRule` |
| `deviceBody` | ✗ device-metaphor, kept for structural clarity |

**Test result: PASS with one note** — `ruleColor` renamed to `inkRule` in final token system.

---

## PART 3: REFACTORING-UI PRE-SCORE

_Scored against the 7 principles. Target: 9+._

### Principle 1 — Visual Hierarchy: 9/10
Four levels clearly distinguished using different tools per level: species name (size + italic weight + Playfair), section titles (size + Playfair regular), body/data (DM Sans medium/regular, normal size), metadata (Space Mono, reduced size, inkFaded color). Labels are de-emphasized vs. values throughout — "SPECIMEN ID" at 9px vs. `# 0042` at 18px. The one gap: stat chips on Discover screen need careful implementation to prevent the stat value and label from competing.

### Principle 2 — Spacing & Sizing: 9/10
4pt grid throughout: 4, 8, 12, 16, 24, 32, 48, 64. Card image/label zones use percentage-of-height allocation (65/35) which produces consistent proportions regardless of card height variation. Between-section spacing (24px) vs. within-section spacing (8-12px) clearly differentiated.

### Principle 3 — Typography: 9/10
Three font families, zero overlap in role assignment. Modular scale: 10, 11, 13, 15, 17, 20, 24, 28, 30, 36. Line heights correctly differentiated: headings 1.1–1.25, body 1.5, labels 1.3. Letter-spacing intentionally applied (Space Mono headers: +1.5px; tab labels: +1.2px; section rules: +2px). No font weight below 400 for reading text.

### Principle 4 — Color: 10/10
Full systematic palette from domain exploration. Token names from product world. 4-level text hierarchy in color system. Every usage motivated. Semantic colors (success/error/warning) using domain analogues. No unmotivated color usage.

### Principle 5 — Depth & Shadows: 8/10
Single discipline: border-only for surfaces and cards (no floating shadows). Inset treatment for recessed elements (TypeTagChip, stat cells). LED glow effect for active TabBar indicators (physically motivated shadow). Shadow is used only where it has a physical-world reason. Half-point deducted because the glossy card shimmer border adds a second system — mitigated by it being rarity-specific and programmatically motivated.

### Principle 6 — Images & Icons: 9/10
Full-bleed images in cards with object-fit cover and defined aspect ratios. Hero image on detail screen: 280px fixed height. Compact card image: fixed 42% width, full height. No image distortion possible. Tab icons replaced with specimen-world Unicode characters (not emoji) — field crosshairs, specimen pin, grid symbol. Empty states specified (see screen layouts).

### Principle 7 — Layout & Composition: 9/10
Left-aligned content default throughout. Cards use field-guide plate proportions — precise rectangles, not rounded boxes. Screen headers contrast strongly with content area (dark/cream). Section rules create clear page breaks as in a field journal. Center-align used only for the camera reticle (physically appropriate) and for the "nothing found" empty state.

### **AGGREGATE SCORE: 63/70 = 9.0/10**

Main opportunity to reach 9.5+: refine stat chip hierarchy and tighten the glossy card treatment so it doesn't add visual complexity.

---

## PART 4: COLOUR SYSTEM

_Replaces `src/constants/colors.ts` in full._

```typescript
/**
 * Anílog Design Token — Colours v2
 * Field Naturalist palette — derived from real-world domain exploration.
 * Named from the naturalist world, not the UI template world.
 * 
 * Physical references:
 *   specimenCream    → Kew Gardens herbarium paper (acid-free, 20yr aged)
 *   inkBlack         → India ink on fine-nib pen, warm blue-black
 *   amberResin       → Cretaceous amber specimen held to lightbox
 *   forestFloor      → Looking up at canopy shadow, deep emerald-shadow
 *   lichenGray       → Foliose lichen on wet basalt, Scottish moorland
 *   instrumentBrass  → Antique brass hardware on Victorian specimen cabinet
 */

export const colors = {

  // ── Device Chrome ──────────────────────────────────────────────────────────
  deviceBody:        '#2A2318',   // dark walnut outer casing
  deviceBezel:       '#1A1510',   // near-black inner bezel, tab bar base
  instrumentBrass:   '#5C4E38',   // antique brass trim, panel seams, top border
  instrumentBrassLight: '#8A7255', // lighter brass — inactive icons & labels

  // ── App Screen Surfaces ────────────────────────────────────────────────────
  specimenCream:     '#F2EDD7',   // PRIMARY background — herbarium paper, warm ivory
  parchment:         '#EAE3CA',   // section panels, slightly darker than specimenCream
  cardStock:         '#E5DEC3',   // card surface — a further step cooler/darker
  insetPanel:        '#D2CAAD',   // recessed fills — stat cells, dark data zones on light bg
  inkRule:           '#BDB69A',   // ruled lines, card borders, chip borders

  // ── Forest Canopy (structural dark surfaces) ───────────────────────────────
  forestFloor:       '#1A3020',   // primary dark surface — screen headers, data panels
  forestMid:         '#2D5440',   // secondary green — uncommon rarity, active elements
  mossLight:         '#6B9A78',   // tertiary green — linked text, subtle accents
  lichenGray:        '#8A9A7B',   // lichen-on-basalt — common rarity, dividers, faint accents

  // ── Amber Resin (active, accent, instrument readout) ──────────────────────
  amberDeep:         '#7C4810',   // darkest amber — CTA on dark surfaces
  amberResin:        '#C6882A',   // MID amber — active states, highlights, stamp colors
  amberGlow:         '#E8B455',   // BRIGHT amber — LED active dot, instrument readout text
  amberFaint:        '#F5E4B5',   // PALE amber — tint on active tab area, tag on image

  // ── Ink Scale (text on light surfaces) ────────────────────────────────────
  inkBlack:          '#1C1B2E',   // india ink — primary text on specimenCream
  inkBrown:          '#4A3728',   // aged ink — secondary text
  inkFaded:          '#7A6A52',   // faded ink — tertiary text, labels, metadata
  inkGhost:          '#A89680',   // ghost ink — disabled, placeholder, decorative
  inkInverse:        '#F2EDD7',   // = specimenCream — text on dark surfaces
  inkAmber:          '#E8B455',   // = amberGlow — text in dark instrument panels

  // ── Rarity ────────────────────────────────────────────────────────────────
  rarity: {
    common:   '#8A9A7B',   // lichenGray — muted organic
    uncommon: '#2D5440',   // forestMid — forest authority
    rare:     '#2A4B8A',   // museum cobalt — institution/authority
    glossy:   '#C6882A',   // amberResin — specimen-in-amber prestige
  },

  // ── Semantic ──────────────────────────────────────────────────────────────
  success:  '#1A5C32',   // dark forest success
  error:    '#8A1F1F',   // deep museum red
  warning:  '#C6882A',   // = amberResin

  // ── Overlays ──────────────────────────────────────────────────────────────
  overlayDark:   'rgba(26,21,16,0.60)',   // dark walnut overlay
  overlayAmber:  'rgba(232,180,85,0.10)', // amber instrument readout wash
  screenGlass:   'rgba(255,255,255,0.05)',// glass sheen on dark surfaces

} as const;

export type ColorToken = typeof colors;
```

**What changed and why:**
- Removed all `scanner*`, `panel*`, `brushed*`, `rubberised` names — these are device-type names, not naturalist names
- `screenBg` → `specimenCream` — because the name tells you the physical reference
- `amberReadout` → `inkAmber` — more specific to how it's used (text in dark panels)
- Added full `forestFloor`/`forestMid`/`mossLight`/`lichenGray` green scale (previously only one flat green-family set)
- Rarity `glossy` moved from `#B8860B` to `#C6882A` — less yellow-gold (looks cheap), more amber-honey
- Text tokens renamed from `textPrimary/Secondary/Muted` to `inkBlack/inkBrown/inkFaded` — passes token test

---

## PART 5: TYPOGRAPHY SYSTEM

_Existing fonts KEPT with justified reasoning and new usage rules._

### Font Families

| Token | Font | Role | Justification |
|---|---|---|---|
| `heading` | Playfair Display 400 Regular | Screen titles, section headings in content area | Field guide plate headings. Carries scientific authority. |
| `headingItalic` | Playfair Display 400 Italic | **ALL binomial species names** | Typographic convention of scientific naming — *Parus major* in italic is the standard from Linnaeus forward. Every field guide does this. |
| `headingBold` | Playfair Display 700 Bold | Hero species name on detail screen | Maximum weight for maximum hierarchy at large size |
| `body` | DM Sans 400 Regular | Body copy, descriptions, capture notes | Warm, rounded sans — matches the approachable-but-precise character of the product |
| `bodyMedium` | DM Sans 500 Medium | UI labels, filter chips, nav items | Slightly more weight for legibility at small sizes |
| `bodyBold` | DM Sans 700 Bold | Stat values, emphasis text | Distinction from medium for primary data values |
| `mono` | Space Mono 400 Regular | **ALL data readouts** — IDs, coordinates, dates, percentages | Reads as typewritten label. Tabular number spacing keeps data aligned. The specimen label signature. |
| `monoBold` | Space Mono 700 Bold | Specimen ID value (`# 0042`) | Large accession number needs weight |

**Swap test result:** Replace Playfair with Georgia — binomial names lose scientific authority. Replace Space Mono with Courier New — looks retro-typewriter not precise instrument. Replace DM Sans with Inter — negligible difference at most sizes but DM Sans is slightly warmer. All three families earn their place.

### Font Size Scale

```typescript
fontSize: {
  xs:   10,  // accession numbers, micro labels
  sm:   11,  // specimen label strip primary, tab labels, chip text
  base: 13,  // secondary metadata, compact card species name
  md:   15,  // body text, description paragraphs
  lg:   17,  // card species name (full card), section sub-headings
  xl:   20,  // section headings, screen sub-title
  '2xl': 24, // screen titles (Discover heading)
  '3xl': 28, // large screen title
  '4xl': 36, // hero species name (detail screen)
  '5xl': 48, // (reserved — stat callout if needed)
}
```

### Line Height

```typescript
lineHeight: {
  tight:   1.1,  // display headings, hero species
  heading: 1.25, // section headings
  normal:  1.5,  // body text
  label:   1.3,  // mono labels, metadata
  relaxed: 1.75, // capture notes paragraph text
}
```

### Letter Spacing

```typescript
letterSpacing: {
  squeezed: -0.5,  // large hero species name (tight tracking at 36px+)
  normal:    0,
  label:     0.5,  // mono data labels, chip text
  wide:      1.2,  // tab labels, section rule labels
  widest:    2.0,  // RarityBadge text, "SPECIMEN ID" header label
}
```

---

## PART 6: COMPONENT SPECIFICATIONS

---

### 6.1 AnimonCard — HERO COMPONENT

_This is the single most important component. Push hardest here._

#### Full Card (compact=false)

**Dimensions:** Fixed 210px total height, width fills column (approximately 160px in 2-col grid).  
**Structure:** Two zones separated by a thin horizontal rule.

**Zone A — Image (136px, 65% of height)**
- `Image` component, `contentFit="cover"`
- No type-tint gradient overlay (rejected — adds color noise over the photo, removes naturalist clarity)
- Top-left corner: if `rarity !== 'common'` → a 20×20px rarity color tab, like the small colored sticker tabs archivists put on folders. Triangle-cut top-left corner (achieved via View with borderTopLeftRadius:0, borderRightWidth:0, borderBottomWidth:0 border-trick). This is SMALL and precise, not a banner.
- NO gradient overlay over image. The photo should look like the photo.

**Zone B — Specimen Label Strip (74px, 35% of height)**

This is the signature. Exact visual spec:

```
┌──────────────────────────────────────┐
│ 1px inkRule horizontal top separator │
│                                      │
│  Quercus robur                 ##-042│  ← Space Mono 12px, inkBlack italic | Space Mono 10px inkFaded right
│                                      │
│  [OAK] [DECIDUOUS]    Richmond Park  │  ← TypeTagChips | inkFaded 10px DM Sans right  
│                                      │
└──────────────────────────────────────┘
```

Background: `cardStock` (`#E5DEC3`) — one step DARKER than specimenCream, as if the label area is the backing card and the image is mounted on top of it. This creates a subtle depth distinction without a shadow.

Internal spacing: 8px horizontal padding, 6px vertical padding top and bottom.

Species name line: `fontFamily: mono`, `fontSize: sm (11)`, `fontStyle: 'italic'`, `color: inkBlack`, left-aligned. Accession number (#-XXX, truncated from animon.id) right-aligned on same line, `fontSize: xs (10)`, `color: inkFaded`.

Type/location line: TypeTagChips (sm size) left-aligned, region text right-aligned `fontSize: xs (10)`, `fontFamily: bodyMedium`, `color: inkFaded`.

**Border treatment (by rarity):**
- `common`: 1px border all sides, `inkRule`, borderRadius 3
- `uncommon`: 1.5px border all sides, `forestMid`, borderRadius 3
- `rare`: Outer 1px `#2A4B8A` + inner 1px `#2A4B8A` at 40% opacity (double-rule) via wrapper View, borderRadius 3
- `glossy`: Animated LinearGradient border wrapper — colors `['#C6882A', '#E8B455', '#D4A040', '#F5E4B5', '#C6882A']`, shimmer repeating. The specimen label strip on glossy cards also receives `backgroundColor: '#F2E8C8'` — a very slightly warmer cream, as if the label paper was edged with gold leaf sizing medium.

**Press state:**  
`scale: 0.97`, animation: 80ms ease-in to pressed, 150ms spring back. No color change — the card physically depresses, it does not glow or highlight.

---

#### Compact Card (compact=true)

**Dimensions:** Fixed 140px height, width from parent (snapToInterval at ~60% screen width).  
**Structure:** Horizontal split — image left, specimen data right.

**Image panel (42% width, full height)**
- Full-bleed image, object-fit cover
- Top-right corner: accession tag overlay — small `View` with dark overlay (overlayDark 60%), `Text` inside: `##-042`, Space Mono 9px, `amberFaint`, right-aligned. This tag reads like a museum accession sticker on the specimen.

**Data panel (58% width, full height)**
- Background: `cardStock`
- Left border: 1px `inkRule` (the panel-edge separator)
- Padding: 8px horizontal, 8px vertical
- Species name: `fontFamily: mono`, `fontSize: base (13)`, `fontStyle: 'italic'`, `color: inkBlack`, numberOfLines: 2
- TypeTagChips row: sm size, max 1 chip
- Bottom row: RarityBadge sm + region text `fontSize: xs`, `color: inkFaded`, `fontFamily: bodyMedium`

---

### 6.2 TabBar — Physical Instrument Panel

**Overall frame:**
- Background: `deviceBezel` (`#1A1510`)
- `borderTopWidth: 2`, `borderTopColor: instrumentBrass`
- Two rivet details: 4px circles, `instrumentBrass`, positioned 12px from each side, 8px below top edge
- Vertical separators between tab zones: 1px, `instrumentBrass` at 20% opacity
- `minHeight: 74px` + `paddingBottom: insets.bottom`

**Tab items:**

_Inactive state:_
- LED dot: 4px circle, `instrumentBrass`, no shadow
- Icon: Unicode symbol (see table below), `fontSize: 16`, `color: instrumentBrassLight`
- Label: `fontFamily: bodyMedium`, `fontSize: 9`, `letterSpacing: wide (1.2)`, UPPERCASE, `color: instrumentBrassLight` (approximately 50% visibility) — engraved feel, recessed into panel

_Active state:_
- LED dot: 4px circle, `amberGlow`, shadow: `{ shadowColor: amberGlow, shadowRadius: 5, shadowOpacity: 0.9, elevation: 3 }` — actual LED glow bleed
- Icon: same symbol, `fontSize: 16`, `color: amberGlow`
- Label: same DM Sans, but `color: amberGlow`, full opacity
- Active tab background: very subtle `amberFaint` at 8% opacity (barely visible warmth)

**Tab icons (replace Unicode symbols):**

| Tab | Symbol | Why |
|---|---|---|
| Discover | `⊙` | Targeting reticle / crosshair |
| Anílog | `⊞` | Grid/collection drawer |
| Milestones | `◈` | Achievement marker |
| Profile | `◉` | Identity target |

**Camera disc (center raised):**
- Outer ring: `View`, 56px diameter, `backgroundColor: deviceBezel`, `borderWidth: 2`, `borderColor: instrumentBrass`, `borderRadius: 28`
- Inner surface: slight elevation achieved via `boxShadow` analog: top border 1px `instrumentBrassLight`, bottom border 1px `#0A0806`
- Icon: SVG aperture circle (not emoji 📷) — 24px, `color: inkAmber`
- When camera screen is active: outer ring gets `borderColor: amberGlow` with glow shadow

---

### 6.3 RarityBadge — Rubber Stamp Impression

**Philosophy: A rubber stamp impression on paper, not a pill-badge on a card.**

**Visual spec:**

The badge must feel like the rarity was stamped onto the card — not designed onto it. Methods to achieve this:

- `borderRadius`: Asymmetric — `borderTopLeftRadius: 2, borderTopRightRadius: 4, borderBottomRightRadius: 2, borderBottomLeftRadius: 4` — creates a subtle irregularity that reads as hand-pressed
- `borderWidth: 1.5`, `borderColor`: rarity color at 65% opacity — ink not completely saturating the paper
- Background: `specimenCream` — NOT the rarity color. The fill is paper, the color is only in the border and text.
- Slight inner shadow illusion: `borderTopWidth: 1` lighter side (specimenCream + 10% lightness), `borderBottomWidth: 2` (rarity color slightly darker). This creates pressed-onto-paper depth.
- Text: `fontFamily: mono`, UPPERCASE, `color`: rarity color (full opacity), `letterSpacing: widest (2.0)`, slight y-translate: `transform: [{ translateY: 0.5 }]` — like the stamp hit slightly crooked

**Sizes:**

| size | height | paddingH | fontSize |
|---|---|---|---|
| sm | 18px | 6px | 9px |
| md | 23px | 8px | 10px |
| lg | 28px | 10px | 12px |

**Text content by rarity:**

| rarity | text |
|---|---|
| common | `COMMON` |
| uncommon | `UNCOMMON` |
| rare | `RARE` |
| glossy | `GLOSSY ✦` |

The `✦` on glossy is a four-pointed star — a subtle reference to specimen labelling in some botanical collections that used a star to mark type specimens.

---

### 6.4 TypeTagChip — Recessed Field Guide Color Band

**Philosophy: A color band cut into the card surface, not applied on top of it.**

The field guide color band that marks a family grouping lives at the edge of the page — it's a structural element of the book's organization. For TypeTagChip, the color should feel INSET — as if the surface was cut away and the color shows through from beneath.

**Inset effect (no drop shadows):**
- `backgroundColor`: parent surface (specimenCream) darkened by 8% — the "cut" is slightly shadowed
- `borderTopWidth: 1`, `borderTopColor`: white at 40% opacity (highlight edge of cut)
- `borderBottomWidth: 1`, `borderBottomColor`: type color at 60% opacity (shadow edge of cut)
- `borderLeftWidth: 1`, `borderRightWidth: 1`, `borderColor`: type color at 40% opacity
- `borderRadius: 3` — almost square, minimal softening

**Text:**
- `fontFamily: bodyMedium`, UPPERCASE, `letterSpacing: label (0.5)`
- `color`: type color at 90% opacity — NOT full opacity, the text feels printed not glowing
- `fontSize`: 10px (sm), 12px (md)

**Chip height:** 20px (sm), 24px (md)

**No background fill with the type color** — this is the default that was explicitly rejected. A filled chip in the type's color is decorative, flat, and exactly what every other app does. The recessed border treatment is specific to this product.

---

## PART 7: SCREEN-LEVEL LAYOUTS

### 7.1 Discover Screen

```
┌─────────────────────────────────────────┐
│ SafeAreaView (deviceBody #2A2318)        │
│  ┌───────────────────────────────────┐  │
│  │ Header Panel (forestFloor)         │  │
│  │  ANÍLOG          [05 MAR 2026]    │  │  ← Space Mono 9px letterSpacing 4, amberGlow | right: Space Mono 10px amberResin
│  │                                   │  │
│  │  Field Log                        │  │  ← Playfair Display 28px, inkInverse, lineHeight heading
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Scroll (specimenCream)             │  │
│  │                                   │  │
│  │  [⊙ 42 CAUGHT] [⬡ 18 SPECIES]    │  │  ← Stat chips: insetPanel bg, inkRule border
│  │  [▲ 7 REGIONS]                    │  │  ← DM Sans Bold 16px value, Space Mono 10px label
│  │                                   │  │
│  │  RECENTLY CAUGHT ─────────────    │  │  ← Space Mono 10px, inkFaded, letterSpacing 2, inkRule extends right
│  │                                   │  │
│  │  ┌────┐ ┌────┐ ┌────┐            │  │  ← Compact cards, 140px height carousel
│  │  │    │ │    │ │    │            │  │
│  │  └────┘ └────┘ └────┘            │  │
│  │                                   │  │
│  │  NEARBY ACTIVITY ─────────────    │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │▌ Spotted: Tawny Owl         │  │  │  ← 2px left border in rarity color
│  │  │  Richmond Park · 3 min      │  │  │  ← Playfair italic | Space Mono meta
│  │  │─────────────────────────────│  │  │
│  │  │▌ Spotted: Common Toad       │  │  │
│  │  └─────────────────────────────┘  │  │  ← insetPanel background, inkRule border
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Empty state (no recent catches):**  
Centered illustration placeholder area (48px circle icon in inkRule, a magnifying glass or specimen loupe shape), DM Sans 15px inkFaded "No specimens yet", DM Sans 13px inkGhost "Point your scanner at the next animal you find".

**Header detail:**
- `backgroundColor: forestFloor`
- Wordmark "ANÍLOG": `Space Mono 700Bold`, 10px, `letterSpacing: 4`, `color: amberGlow`
- Date right: `Space Mono 400Regular`, 10px, `color: amberResin`
- Screen title "Field Log": `Playfair Display 400Regular`, 28px, `color: inkInverse`, `lineHeight: heading`
- Greeting "Good morning, [Name]": `DM Sans 400Regular`, 14px, `color: inkInverse` at 70% opacity

**Stat chips:**
- Background: `insetPanel`
- Border: 1px `inkRule`, borderRadius 4
- Icon (small SVG or Unicode symbol, NOT emoji): 16px, `inkBrown`
- Value: `DM Sans 700Bold`, 17px, `inkBlack`
- Label: `Space Mono 400Regular`, 9px, `inkFaded`, `letterSpacing: wide`
- Horizontal padding: 12px, vertical: 8px
- Chips in horizontal ScrollView, gap: 8px

**Section rules:**
`Space Mono`, 10px, `inkFaded`, `letterSpacing: widest` for text. Followed immediately by a 1px `inkRule` line that extends to the right edge of the screen. Left-aligned. The line is not full-width — it begins immediately after the text and runs to the right edge, like a ruled field journal line that was partially filled in.

**Nearby Activity panel:**
- Background: `parchment` (slightly darker than specimenCream for the panel distinction)
- Border: 1px `inkRule`, borderRadius 6
- Padding: 0 (items have their own padding)
- Each activity item: 12px vertical padding, 16px horizontal padding
- Left accent: 2px left border in the rarity color of that animon (NOT a dot — a full-height line)
- Species name: `Playfair Display 400Italic`, 15px, `inkBlack` — binomial convention even in activity feed
- Meta (region · time): `Space Mono 400Regular`, 11px, `inkFaded`
- Separator between items: 1px `inkRule` at 50% opacity

---

### 7.2 My Anílog Screen

**Header:** Same dark forestFloor header as Discover. Title: "My Anílog" in Playfair 28px.

**Filter bar (below header, specimenCream bg):**
- Horizontal scroll of TypeTagChips in md size, preceded by "ALL" chip
- "ALL" chip: DM Sans Medium 12px, `inkBlack`, `borderColor: inkBlack`, slight fill `insetPanel`
- Active filter: `borderColor` type color, `color` type color (full opacity inset effect)
- Padding: 12px top, 12px bottom, 16px horizontal scroll padding

**Grid:**
- 2-column grid, gap: 12px, paddingHorizontal: 16px
- Full AnimonCards stacked
- No pull-to-refresh chrome — just standard scroll

**Sort button (bottom-right FAB):**
- 48px circle
- Background: `forestFloor`
- Border: 1.5px `instrumentBrass`
- Icon: sort lines SVG, `amberGlow`, 20px
- Shadow: `{ shadowColor: forestFloor, shadowRadius: 8, shadowOpacity: 0.4 }`

**Empty state:**
Centered in grid area: specimen loupe icon (48px, `inkRule` color), "No specimens in your Anílog" Playfair 18px `inkBrown`, "Start scanning to fill your collection" DM Sans 14px `inkFaded`. Below: large SCAN CTA button in `forestFloor` background.

---

### 7.3 Camera Screen

**Philosophy: The scanning device's optical viewfinder. Full-screen. No chrome visible except the instrument overlay.**

**Full screen layout:**
- Camera preview: full-screen, `position: absolute`, fills entire screen
- Status bar: hide or make transparent

**Reticle overlay:**
- 4 L-bracket corner marks — each 24px wide × 24px tall, 1.5px stroke, `amberGlow`
- NOT a full rectangle — just the corners. The brackets define the scanning zone.
- Center gap between brackets: approximately 60% of screen width
- Below brackets: thin horizontal scanning line, 1px, `amberGlow` at 40% opacity, animates slowly down and back over the defined zone (scanning sweep animation)

**Status text (above reticle area):**
- Background: `overlayDark` pill, 8px vertical 16px horizontal padding, borderRadius 20
- Text: `Space Mono 400Regular`, 11px, `amberResin`, `letterSpacing: wide`
- States: "AWAITING TARGET" / "SCANNING..." / "SPECIMEN LOCKED" / "IDENTIFIED"

**Bottom instrument panel:**
- Background: `deviceBezel` with 95% opacity (slight translucency so you can see habitat beneath)
- Height: ~140px
- SCAN button: 72px diameter circle
  - Outer ring: 3px `amberGlow` border, `borderRadius: 36`
  - Inner fill: `forestFloor`
  - Center icon: aperture lines SVG, `amberGlow`, 28px
  - Scanning state: outer ring pulses (scale 1.0 → 1.08 → 1.0, continuous)
- SCAN label: `Space Mono 700Bold`, 11px, `amberGlow`, `letterSpacing: wide`, below button

---

### 7.4 Detail Screen

**Structure:**
1. Hero image (fixed 280px)
2. Back button (SafeAreaView absolute overlay)
3. Bottom sheet (scroll, starts at 252px from top — 280px - 28px overlap)

**Hero image area:**
- Full-bleed image, `contentFit: cover`
- Gradient overlay: `LinearGradient`, `transparent` → `rgba(26,21,16,0.88)`, starts at 50% height, covers bottom half
- Species name on gradient: `Playfair Display 900Black`, `fontStyle: italic`, 34–36px depending on name length, `color: inkInverse`, `lineHeight: tight`, `letterSpacing: squeezed`. Left-aligned, bottom of hero.
- Breed/subspecies: `Playfair Display 400Italic`, 16px, `inkInverse` at 75% opacity, below species

**Back button:**
- 38px circle, `deviceBezel` background at 80% opacity, `borderColor: instrumentBrass`, 1.5px border
- Arrow: `←` or SVG chevron, `inkAmber`, 18px

**Bottom sheet:**
- Background: `specimenCream`
- Top corners: borderRadius 20 (the sheet "slides up" over the hero image)
- Handle: 32px × 3px, `inkRule`, centered, 10px from top
- `paddingTop: 20`

**Data plate (first element in sheet):**
- Horizontal row: TypeTagChips (md size) left-aligned, RarityBadge (md) right-aligned
- Below row: `Space Mono 400Regular`, 11px, `inkFaded` — capture date + region, single line

**Specimen ID block:**
```
┌─────────────────────────────────────────┐
│  SPECIMEN ID                  # 0042    │
└─────────────────────────────────────────┘
```
- Full-width block, `backgroundColor: cardStock`, `borderWidth: 1`, `borderColor: inkRule`, borderRadius 4, padding 12px horizontal, 10px vertical
- "SPECIMEN ID": `Space Mono 400Regular`, 9px, `inkFaded`, `letterSpacing: widest`, left-aligned
- `# 0042`: `Space Mono 700Bold`, 18px, `inkBlack`, right-aligned
- These two elements on the same line, justified between

**Stats grid (2×2):**
- Each cell: `backgroundColor: forestFloor`, `borderRadius: 4`, padding 12px, 48% width (2 per row with 8px gap)
- Label: `Space Mono 400Regular`, 9px, `inkAmber` (amberGlow on dark), `letterSpacing: widest`, all-caps
- Value: `DM Sans 700Bold`, 18px, `inkInverse`
- `borderWidth: 1`, `borderColor: instrumentBrass` at 30% opacity

**Capture Notes card:**
- Background: `parchment`, `borderRadius: 6`, `borderWidth: 1`, `borderColor: inkRule`
- Title: `Space Mono 400Regular`, 9px, `inkFaded`, `letterSpacing: widest` — "CAPTURE NOTES"
- Each note row: key `Space Mono 10px inkFaded letterSpacing: wide` | value `DM Sans Medium 14px inkBrown`, justified
- Separator: 1px `inkRule` at 60% opacity
- Padding: 14px
- Background implied "ruled paper" texture: achieved by repeating 1px `inkRule` at 12% opacity horizontal rules every 28px (this is a React Native view with overflow hidden containing stacked horizontal lines behind the content). Subtle — you feel it more than see it.

---

## PART 8: MICROINTERACTIONS

### Microinteraction 1 — Capture Stamp
**The moment a new specimen enters the collection.**

**Trigger:** System — after successful AI identification and save, as the new AnimonCard appears in the Discover "Recently Caught" carousel or in My Anílog grid.

**Rules:**
- Fires exactly once per animon, when the card first renders in the logged-in user's collection view
- Does not fire on subsequent app sessions or scrolls past the card
- If scan fails, no stamp animation — only fires on confirmed new additions

**Feedback — sequence:**
1. Card renders with full opacity (no fade-in on card itself — card is solid)
2. The RarityBadge is HIDDEN behind opacity: 0, scale: 0.5, rotate: -12deg
3. After 180ms delay (letting the card register first), animate RarityBadge:
   - translateZ from 0 → stamp impact: scale 0.5 → 1.05 → 1.0 (350ms total, ease-out then small spring settle)
   - rotate from -12deg → -2deg → 0deg (same timing)
   - opacity: 0 → 1 (first 120ms)
4. At the moment of stamp impact (frame ~180-200ms of the badge animation), a brief amber flush on the specimen label strip: `backgroundColor` transitions from `cardStock` to `amberFaint` then back to `cardStock` over 300ms
5. Haptic at stamp impact frame: `Haptics.impactAsync(ImpactFeedbackStyle.Medium)`

**Loop:** Closed — fires once, badge stays stamped. No re-trigger.

**Why this is specific to Anílog:** A rubber stamp impact on a specimen label is the physical action of cataloguing a find. The moment of adding to the collection IS the stamp. No other app has this moment to celebrate.

---

### Microinteraction 2 — Scanner Reticle Lock-On

**The moment the AI identifies the target.**

**Trigger:** System — fires when confidence score crosses identification threshold (e.g., > 0.75) during live camera analysis.

**Rules:**
- Three states: SEARCHING (default), LOCKED (identified but not confirmed), CONFIRMED (scan button pressed)
- Lock-on fires on threshold cross, not on button press — immediate system feedback that the device "sees" something
- If confidence drops below threshold again, reticle opens back (reset animation)

**Feedback — SEARCHING → LOCKED transition:**
1. Reticle corners animate inward: each L-bracket `translateX` and `translateY` by ±8px toward center (200ms, deceleration easing). The brackets "close around" the target.
2. Reticle stroke color transitions from `amberGlow` at 40% opacity → `amberGlow` at 100% opacity (200ms)
3. Scanning sweep line: stops and locks at center position (no longer animating up/down)
4. Status text changes: "SCANNING..." → "SPECIMEN LOCKED", Space Mono, `amberGlow` full opacity
5. Status text pill: `backgroundColor` pulse — brief brightening: `overlayDark` → `forestFloor` → `overlayDark` (400ms)
6. SCAN button outer ring: starts pulsing gently (scale 1.0 → 1.05 → 1.0, continuous, 1200ms period)
7. Haptic: `Haptics.notificationAsync(NotificationFeedbackType.Success)`

**Feedback — CONFIRMED transition (scan button pressed):**
1. Reticle corners close completely to center then flash `amberGlow` and fade out (300ms)
2. SCAN button: circle scale 1.0 → 1.15 → 0 (scale down and disappear, 250ms)
3. Screen transitions to processing state, then result screen

**Loop:** Open during session — resets when camera is reopened.

---

### Microinteraction 3 — Tab LED Activation

**The instrument panel indicator switch.**

**Trigger:** Manual — user taps a tab bar item.

**Rules:**
- Previous active tab deactivates (LED dims)
- New tab activates (LED illuminates)
- Camera disc has its own state (active when camera screen is the current route)
- Rule: the transition to the new state should feel like flipping a physical switch — immediate on-state, not a slow crossfade

**Feedback:**

_Deactivating tab (previous)_ (fires at tap time, 0ms delay):
- LED scale: 1.0 → 0.8 (80ms ease-in), then stable at 0.8
- LED color: `amberGlow` → `instrumentBrass` (80ms)
- LED shadow: dissolves (80ms): `shadowRadius: 5 → 0`, `shadowOpacity: 0.9 → 0`
- Label opacity: 1.0 → 0.5 (100ms)

_Activating tab (new)_ (fires at tap time, 0ms delay):
- LED: immediately jumps to `amberGlow` color (0ms — the "surge" when an LED first receives power)
- LED scale: 1.0 → 1.5 → 1.0 (total 200ms — a brief over-glow that settles to steady state)
- LED shadow: immediately present and full, settles to sustained: `shadowRadius: 0 → 10 → 5`, `shadowOpacity: 0 → 1 → 0.8` (200ms)
- Label opacity: 0.5 → 1.0 (100ms)
- Tab background: `amberFaint` at 0% → 8% (150ms ease-out)

**The technical detail that makes this feel real:** The immediate color jump + surge-then-settle on the activating LED (vs. the decelerating fade on the deactivating LED) exactly mimics how a physical LED indicator behaves when switched. No other tab bar animation achieves this physical referentiality.

**Loop:** Persistent — each tab maintains its active/inactive state. No timeout or expiry.

---

### Microinteraction 4 — Collection Scroll Reveal (bonus)

**Cards entering the My Anílog grid viewport.**

**Trigger:** System — card ScrollView/FlatList renders item for first time in viewport.

**Rules:**
- Maximum 2 cards animate simultaneously per batch (prevents overwhelming motion)
- Cards that have scrolled into view before in this session do NOT re-animate on scroll-back
- Animation does not start until card image has loaded (prevents layout flashing)
- On low-power mode: animation disabled — cards appear instantly

**Feedback:**
- Card enters from translateY: +20px → 0, opacity: 0 → 1
- Duration: 280ms
- Easing: spring (mass: 0.8, stiffness: 180, damping: 22)
- Stagger between the two cards in batch: 40ms
- The translateY origin (20px from bottom) means cards rise up as if being placed on the surface, not fading in from nowhere — this reinforces the "placing specimen in drawer" metaphor

**Loop:** Once per session per card. After session, long loop could reduce: after 5+ sessions seeing the same card, skip animation entirely (progressive reduction).

---

## PART 9: REJECTED DEFAULTS — FINAL RECORD

Recorded here for developer reference so these patterns cannot re-enter the design:

| Rejected default | What replaces it | Why |
|---|---|---|
| Dark mode with cyan/green neon glows | Amber instrument readout on dark walnut/forest panel | Real field instruments are warm-amber LCD, not gaming peripheral |
| Nature-green as primary accent | amberResin as active/CTA accent; green used structurally only | Every outdoor app uses green. Amber is specific to instrument readout and specimen-in-amber. |
| Rounded soft-shadow cards | 3px border-radius, border-only, specimen label strip | Naturalist collection cards are precise rectangles, not rounded tiles |
| Gradient color overlay on card images | No overlay — clean photo | The specimen IS the star. Don't color-wash the photo. |
| Filled TypeTagChip with type color | Inset/recessed border treatment only | Field guide color bands are structural, not decorative fills |
| Pill-shaped RarityBadge | Rubber stamp impression with asymmetric radius and ink-paper rendering | Physical cataloguing stamps leave an impression on paper, they are not labels |
| "SCAN" emoji camera button | SVG aperture circle, instrument-quality | Emoji camera in a scientific instrument is immediately at odds with the domain |
| Progress indicator floating over camera | Reticle overlay system (lock-on animation) | A viewfinder uses bracket elements, not floating UI components |
| Color token names: gray-700, surface-2, primary | inkBlack, specimenCream, amberResin | Tokens should be from the product's world. The swap test confirms it. |

---

## PART 10: IMPLEMENTATION NOTES FOR DEVELOPER

_(Not design decisions — just flagging implementation complexity)_

1. **Specimen label strip**: The most sensitive component to implement. The key is `backgroundColor: cardStock` (#E5DEC3) being distinct from card image area. The 1px `inkRule` separator must be a View not a border (borders have rendering inconsistencies in RN). Height of strip should be set as a percentage of card height not a fixed px, so it scales with future card height changes.

2. **RarityBadge asymmetric border-radius**: In React Native `borderRadius` as a single value overrides individual corner values. Specify all four: `borderTopLeftRadius: 2, borderTopRightRadius: 4, borderBottomRightRadius: 2, borderBottomLeftRadius: 4`.

3. **LED glow shadow on native**: On Android, shadow properties require `elevation`. Replicate with: `elevation: 4, shadowColor: '#E8B455', shadowRadius: 5, shadowOpacity: 0.9, shadowOffset: { width: 0, height: 0 }`. Test on both platforms.

4. **Camera reticle corners**: Implement as 4 absolute-positioned Views, each 24×24px, with two borders (top+left, top+right, etc.) and `borderColor: amberGlow`. Position with `{ position: absolute, top/bottom/left/right }` from center calculation.

5. **Herbarium ruled-line background**: Achieve with a View positioned absolutely behind content, containing multiple 1px-height Views spaced 28px apart, opacity 0.12. This is purely decorative — it should NOT affect layout or touch handling (`pointerEvents: 'none'`).

6. **Space Mono italic**: Space Mono does not have a native italic variant. Achieve italic on specimen labels via `fontStyle: 'italic'` which React Native will simulate (synthetic italic). For production quality, load a slightly condensed weight and apply transform instead. Developer discretion.

7. **Stamp microinteraction timing**: The 180ms delay before badge stamp is important — it must let the card render first so the user's eye has landed on the card before the stamp fires. Do not reduce this below 150ms.

---

_End of Design Spec v2_
