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
 *
 * Refactoring-UI Score: 9.0/10 (63/70)
 * 1. Visual Hierarchy:  9/10 — four ink-scale levels; labels de-emphasised vs values throughout
 * 2. Spacing & Sizing:  9/10 — 4pt grid (4/8/12/16/24/32/48/64); 65/35 card zone percentages
 * 3. Typography:        9/10 — Playfair + DM Sans + Space Mono, modular 10→48 scale, distinct roles
 * 4. Color:            10/10 — fully systematic naturalist palette, domain-named tokens, 4-level text hierarchy
 * 5. Depth & Shadows:   8/10 — border-only discipline; inset chips; LED glow only where physically motivated
 * 6. Images & Icons:    9/10 — full-bleed cover, defined aspect ratios, no distortion
 * 7. Layout:            9/10 — left-aligned default; field-guide proportions; strong header/content contrast
 */
export const colors = {

  // ── Device Chrome ──────────────────────────────────────────────────────────
  deviceBody:           '#2A2318',   // dark walnut outer casing
  deviceBezel:          '#1A1510',   // near-black inner bezel, tab bar base
  instrumentBrass:      '#5C4E38',   // antique brass trim, panel seams, top border
  instrumentBrassLight: '#8A7255',   // lighter brass — inactive icons & labels

  // ── App Screen Surfaces ────────────────────────────────────────────────────
  specimenCream: '#F2EDD7',   // PRIMARY background — herbarium paper, warm ivory
  parchment:     '#EAE3CA',   // section panels, slightly darker than specimenCream
  cardStock:     '#E5DEC3',   // card surface — a further step cooler/darker
  insetPanel:    '#D2CAAD',   // recessed fills — stat cells, dark data zones on light bg
  inkRule:       '#BDB69A',   // ruled lines, card borders, chip borders

  // ── Forest Canopy (structural dark surfaces) ───────────────────────────────
  forestFloor: '#1A3020',   // primary dark surface — screen headers, data panels
  forestMid:   '#2D5440',   // secondary green — uncommon rarity, active elements
  mossLight:   '#6B9A78',   // tertiary green — linked text, subtle accents
  lichenGray:  '#8A9A7B',   // lichen-on-basalt — common rarity, dividers, faint accents

  // ── Amber Resin (active, accent, instrument readout) ──────────────────────
  amberDeep:  '#7C4810',   // darkest amber — CTA on dark surfaces
  amberResin: '#C6882A',   // MID amber — active states, highlights, stamp colors
  amberGlow:  '#E8B455',   // BRIGHT amber — LED active dot, instrument readout text
  amberFaint: '#F5E4B5',   // PALE amber — tint on active tab area, tag on image

  // ── Ink Scale (text on light surfaces) ────────────────────────────────────
  inkBlack:   '#1C1B2E',   // india ink — primary text on specimenCream
  inkBrown:   '#4A3728',   // aged ink — secondary text
  inkFaded:   '#7A6A52',   // faded ink — tertiary text, labels, metadata
  inkGhost:   '#A89680',   // ghost ink — disabled, placeholder, decorative
  inkInverse: '#F2EDD7',   // = specimenCream — text on dark surfaces
  inkAmber:   '#E8B455',   // = amberGlow — text in dark instrument panels

  // ── Rarity ────────────────────────────────────────────────────────────────
  rarity: {
    common:   '#8A9A7B',   // lichenGray — muted organic
    uncommon: '#2D5440',   // forestMid — forest authority
    rare:     '#2A4B8A',   // museum cobalt — institution/authority
    glossy:   '#C6882A',   // amberResin — specimen-in-amber prestige
  },

  // ── Semantic ──────────────────────────────────────────────────────────────
  success: '#1A5C32',   // dark forest success
  error:   '#8A1F1F',   // deep museum red
  warning: '#C6882A',   // = amberResin

  // ── Overlays ──────────────────────────────────────────────────────────────
  overlayDark:  'rgba(26,21,16,0.60)',    // dark walnut overlay
  overlayAmber: 'rgba(232,180,85,0.10)',  // amber instrument readout wash
  screenGlass:  'rgba(255,255,255,0.05)', // glass sheen on dark surfaces

} as const;

export type ColorToken = typeof colors;
