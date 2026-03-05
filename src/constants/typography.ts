/**
 * Anílog Design Token — Typography
 *
 * Font scale following an 8pt grid.
 * Heading font: Playfair Display
 * Body font: DM Sans
 * Data readout font: Space Mono
 */
export const typography = {
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
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 30,
    '3xl': 36,
    '4xl': 48,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    widest: 1.5,
  },
} as const;

export type TypographyToken = typeof typography;
