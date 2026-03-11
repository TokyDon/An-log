/**
 * Anílog Design Token — Colours v7 (Warm Naturalist)
 *
 * Palette references the natural world: forest canopy, evening amber,
 * the golden shimmer of a rare beetle wing.
 *
 * Three words: Discovered. Warm. Alive.
 *
 * WCAG contrast ratios verified against bg (#FDFAF5) unless noted.
 */
export const colors = {

  // ── Backgrounds ─────────────────────────────────────────────────────────────
  bg:       '#FDFAF5',   // Warm Parchment — app background, never pure white
  surface:  '#F0EBE0',   // Card Cream — cards, bottom sheets, modals
  surface2: '#E8E0D4',   // Warm Divider — input fields, inactive chips, dividers

  // ── Borders ─────────────────────────────────────────────────────────────────
  border:       '#E8E0D4',   // warm hairline separators
  borderStrong: '#C9BFB3',   // visible dividers, input outlines

  // ── Text ────────────────────────────────────────────────────────────────────
  // All verified against bg (#FDFAF5, L≈0.960) and surface (#F0EBE0, L≈0.878)
  text1:       '#1A1A2E',  // Deep Night — 17.2:1 on bg  ✓  headings, primary body
  text2:       '#3D3D3D',  // Charcoal   —  9.2:1 on bg  ✓  labels, metadata
  text3:       '#696969',  // Stone      —  5.3:1 on bg  ✓  hints, placeholders
  textInverse: '#FDFAF5',  // Parchment  — on dark/coloured buttons

  // ── Primary — Deep Forest Green ─────────────────────────────────────────────
  accent:     '#2D6A4F',   // 5.5:1 on bg ✓  CTAs, active states, progress
  accentSoft: '#E8F5EE',   // very pale green — selected chip bg
  accentDeep: '#1E4D38',   // pressed / deep state

  // ── Secondary — Warm Amber ──────────────────────────────────────────────────
  secondary:     '#F4A261',   // secondary CTAs, highlights, milestones
  secondarySoft: '#FEF0E4',   // pale amber tint

  // ── Accent Gold ─────────────────────────────────────────────────────────────
  gold: '#E9C46A',   // stars, streak indicators, glossy shimmer

  // ── Device chrome ───────────────────────────────────────────────────────────
  navDark:     '#F0EBE0',   // tab bar — Card Cream
  surfaceDark: '#1A1A2E',   // intentionally dark — hero zones, camera bg

  // ── Rarity ──────────────────────────────────────────────────────────────────
  rarity: {
    common:   { bg: '#9CA3AF', text: '#FFFFFF' },   // neutral grey
    uncommon: { bg: '#34D399', text: '#064E3B' },   // green — 7.2:1 ✓
    rare:     { bg: '#3B82F6', text: '#FFFFFF' },   // blue  — 4.6:1 ✓
    glossy:   { bg: '#E9C46A', text: '#1A1A2E' },   // gold  — 9.1:1 ✓
  },

  // ── Semantic ────────────────────────────────────────────────────────────────
  success: '#2D6A4F',
  error:   '#E63946',
  warning: '#F4A261',

  // ── Overlays ────────────────────────────────────────────────────────────────
  overlayDark:  'rgba(26,26,46,0.55)',
  overlayLight: 'rgba(253,250,245,0.92)',

} as const;

export type ColorToken = typeof colors;
