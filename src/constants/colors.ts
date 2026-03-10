/**
 * Anílog Design Token — Colours v3.1
 * Field Lab palette — deep forest green base, amber gold accent.
 * Expedition journal meets hi-tech bioScanner.
 */
export const colors = {

  // ── Backgrounds ────────────────────────────────────────────────────────────
  bg:       '#0D1F0F',
  surface:  '#1A2E1C',
  surface2: '#152317',

  // ── Borders ────────────────────────────────────────────────────────────────
  border:       '#2E4A2E',
  borderStrong: '#3D6B3D',

  // ── Text ───────────────────────────────────────────────────────────────────
  text1:       '#F0EDE4',  // warm off-white — never pure white
  text2:       '#9BAF8A',  // muted sage green
  text3:       '#5A7050',  // very muted — ghost/placeholder text
  textInverse: '#F0EDE4',  // light text on dark surfaces (navDark, bezel)

  // ── Accent (amber gold — the LIFE colour) ──────────────────────────────────
  accent:     '#D4A017',
  accentSoft: '#2A3D20',  // muted green for chips / tags
  accentDeep: '#B8860B',  // darker amber for done-state indicators

  // ── Device chrome ──────────────────────────────────────────────────────────
  bezel:   '#0A1408',
  navDark: '#080E08',

  // ── Rarity ─────────────────────────────────────────────────────────────────
  rarity: {
    common:   '#94A3B8',
    uncommon: '#22C55E',
    rare:     '#6366F1',
    glossy:   '#F59E0B',  // static fallback — animated amber→pink→indigo in components
  },

  // ── Semantic ───────────────────────────────────────────────────────────────
  success: '#4CAF50',  // brighter green — pops on dark background
  error:   '#E57373',
  warning: '#EAB308',

  // ── Overlays ───────────────────────────────────────────────────────────────
  overlayDark: 'rgba(8,14,8,0.75)',

} as const;

export type ColorToken = typeof colors;
