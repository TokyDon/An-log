/**
 * Anílog Design Token — Colours v5 (Light Mode)
 * Clean naturalist field-journal palette.
 * White/light-grey surfaces. Dark ink text. Type & rarity = only accent colours.
 */
export const colors = {

  // ── Backgrounds ────────────────────────────────────────────────────────────
  bg:       '#FFFFFF',   // pure white — page background
  surface:  '#F5F5F5',   // very light grey — cards, panels
  surface2: '#EBEBEB',   // slightly darker — input fields, inactive chips, dividers

  // ── Borders ────────────────────────────────────────────────────────────────
  border:       '#E0E0E0',   // subtle hairline separators
  borderStrong: '#B0B0B0',   // visible dividers, input outlines

  // ── Text ───────────────────────────────────────────────────────────────────
  text1:       '#111111',  // near-black — primary body / headings
  text2:       '#555555',  // secondary — labels, metadata
  text3:       '#999999',  // tertiary — placeholder, ghost
  textInverse: '#FFFFFF',  // white text — on dark/coloured buttons

  // ── Accent (action blue — primary CTAs only) ───────────────────────────────
  accent:     '#2563EB',   // strong action blue (WCAG AA on white)
  accentSoft: '#EFF6FF',   // very pale blue tint — selected chip bg
  accentDeep: '#1D4ED8',   // pressed / deep state

  // ── Device chrome ──────────────────────────────────────────────────────────
  bezel:   '#FFFFFF',
  navDark: '#FAFAFA',      // tab bar / nav background (almost white)

  // ── Rarity (the ONLY high-chroma colours in the app) ──────────────────────
  rarity: {
    common:   '#94A3B8',
    uncommon: '#16A34A',   // green
    rare:     '#4F46E5',   // indigo
    glossy:   '#D97706',   // amber — only glossy gets this
  },

  // ── Semantic ───────────────────────────────────────────────────────────────
  success: '#16A34A',
  error:   '#DC2626',
  warning: '#D97706',

  // ── Overlays ───────────────────────────────────────────────────────────────
  overlayDark: 'rgba(0,0,0,0.55)',

} as const;

export type ColorToken = typeof colors;
