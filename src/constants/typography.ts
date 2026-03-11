/**
 * Anílog Design Token — Typography v4 (Warm Naturalist)
 *
 * Pairing: DM Serif Display (headings) + DM Sans (body)
 * Warm without being twee. Precise without being cold.
 *
 * DM Serif Display — screen titles, Animon species names, onboarding headlines
 * DM Sans         — body copy, type tags, badges, UI labels, stats, navigation
 *
 * Type scale base: 4px grid
 */
export const typography = {
  fontFamily: {
    // Heading — DM Serif Display (elegance, warmth)
    heading: 'DMSerifDisplay_400Regular',   // only weight — elegance is restraint

    // Body — DM Sans
    body:         'DMSans_400Regular',
    bodyMedium:   'DMSans_500Medium',
    bodyBold:     'DMSans_700Bold',

    // Legacy aliases — keep for any existing usages that reference bodySemiBold / bodyExtra / mono
    bodySemiBold: 'DMSans_500Medium',   // closest DM Sans equivalent
    bodyExtra:    'DMSans_700Bold',     // map to bold
    mono:         'DMSans_400Regular',  // no mono in new system — use body
    monoBold:     'DMSans_700Bold',
  },

  fontSize: {
    // Notion type scale (4px base)
    micro: 11,   // type tags only
    xs:    12,   // labels, badges, chips
    sm:    14,   // secondary content / body M
    base:  16,   // primary content / body L
    md:    18,   // section headers / title S
    lg:    22,   // Animon species name / title M
    xl:    28,   // screen titles / title L
    '2xl': 32,   // reserved
    '3xl': 40,   // onboarding hero display
  },

  lineHeight: {
    tight:  1.1,   // headings in DM Serif Display
    normal: 1.5,   // body copy
    label:  1.25,  // labels and chips
  },

  letterSpacing: {
    squeezed: -0.5,
    normal:    0,
    label:     0.5,    // +0.02em equivalent for uppercase labels
    wide:      1.2,
    widest:    2.0,
  },
} as const;

export type TypographyToken = typeof typography;
