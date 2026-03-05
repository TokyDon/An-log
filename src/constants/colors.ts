/**
 * Anílog Design Token — Colours
 * BioField Scanner MK-II skeuomorphic palette.
 * Single source of truth for all colour values.
 */
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
    common:   '#8B8577',   // muted stone
    uncommon: '#2D7A3A',   // forest green
    rare:     '#2A5B9E',   // deep cobalt
    glossy:   '#B8860B',   // true dark gold
  },

  // ── Text ──────────────────────────────────────────────────────────────────
  textPrimary:   '#2C1F0F',   // deep warm brown — main text on parchment surfaces
  textSecondary: '#6B5C44',   // mid-tone warm brown — secondary labels
  textMuted:     '#A09070',   // muted — captions, metadata, timestamps
  textInverse:   '#F5F0E8',   // parchment white — text on dark/green surfaces
  textReadout:   '#E8C97E',   // amber LCD — text inside dark data panels

  // ── Semantic ──────────────────────────────────────────────────────────────
  success: '#15803D',
  error:   '#B91C1C',
  warning: '#D97706',

  // ── Overlays ──────────────────────────────────────────────────────────────
  overlayDark:  'rgba(0,0,0,0.55)',
  overlayAmber: 'rgba(232,201,126,0.12)',
} as const;

export type ColorToken = typeof colors;
