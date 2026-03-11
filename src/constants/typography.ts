/**
 * Anílog Design Token — Typography v5 (Plus Jakarta Sans)
 *
 * Single family: Plus Jakarta Sans — a modern geometric humanist sans-serif
 * optimised for digital screens and small sizes. Variable weight 200–800.
 *
 * Why PJS over DM Serif Display:
 *   — Fully sans-serif for mobile clarity
 *   — 800 ExtraBold gives strong display hierarchy without a serif
 *   — Slightly rounded terminals feel friendly without being twee
 *   — Excellent legibility at 12–14px for chips and labels
 *
 * All font keys preserve the same names so existing code needs no changes.
 */
export const typography = {
  fontFamily: {
    // Display / headings — ExtraBold (replaces DM Serif Display)
    heading: 'PlusJakartaSans_800ExtraBold',

    // Body copy
    body:         'PlusJakartaSans_400Regular',
    bodyMedium:   'PlusJakartaSans_500Medium',
    bodySemiBold: 'PlusJakartaSans_600SemiBold',
    bodyBold:     'PlusJakartaSans_700Bold',
    bodyExtra:    'PlusJakartaSans_800ExtraBold',

    // Mono aliases — PJS has no mono, use regular/bold
    mono:     'PlusJakartaSans_400Regular',
    monoBold: 'PlusJakartaSans_700Bold',
  },

  fontSize: {
    micro: 11,   // type tags, badge counts
    xs:    12,   // labels, chips, tab text
    sm:    14,   // secondary body, metadata
    base:  16,   // primary body copy
    md:    18,   // section sub-headings
    lg:    22,   // Animon species name in cards
    xl:    28,   // screen titles
    '2xl': 34,   // profile username, logbook hero count
    '3xl': 44,   // onboarding display text
  },

  lineHeight: {
    tight:  1.15,  // headings
    normal: 1.55,  // body paragraphs
    label:  1.25,  // chips, badges
  },

  letterSpacing: {
    squeezed: -0.5,
    normal:    0,
    label:     0.4,   // uppercase labels
    wide:      1.0,
    widest:    1.8,
  },
} as const;

export type TypographyToken = typeof typography;
