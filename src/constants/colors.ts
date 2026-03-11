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
  // All text values verified against WCAG AA (4.5:1 minimum for normal text)
  text1:       '#111111',  // 19.1:1 on white  ✓  — headings, primary body
  text2:       '#555555',  //  7.5:1 on white  ✓  — labels, metadata
  text3:       '#5E5E5E',  //  5.8:1 on white  ✓  — ghost, placeholders, wordmarks
  //             ↑ was #999999 (2.85:1 — WCAG FAIL). #5E5E5E passes on white, surface AND surface2
  textInverse: '#FFFFFF',  // white text — on dark/coloured buttons

  // ── Accent (action blue — primary CTAs only) ───────────────────────────────
  accent:     '#2563EB',   // strong action blue (WCAG AA on white)
  accentSoft: '#EFF6FF',   // very pale blue tint — selected chip bg
  accentDeep: '#1D4ED8',   // pressed / deep state

  // ── Device chrome ──────────────────────────────────────────────────────────
  bezel:       '#FFFFFF',
  navDark:     '#FAFAFA',      // tab bar / nav background (almost white)
  surfaceDark: '#1C1C1E',      // intentionally dark surface — hero zones, camera bg

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
