/**
 * Anílog Design Token — Typography v3
 *
 * Two font families:
 *   body / bodyMedium / bodySemiBold / bodyBold / bodyExtra  → Plus Jakarta Sans — clean modern UI
 *   mono / monoBold                                           → Space Mono — data labels / accession numbers
 */
export const typography = {
  fontFamily: {
    // UI font
    body:         'PlusJakartaSans_400Regular',
    bodyMedium:   'PlusJakartaSans_500Medium',
    bodySemiBold: 'PlusJakartaSans_600SemiBold',
    bodyBold:     'PlusJakartaSans_700Bold',
    bodyExtra:    'PlusJakartaSans_800ExtraBold',
    // Data / labels / accession numbers
    mono:         'SpaceMono_400Regular',
    monoBold:     'SpaceMono_700Bold',
  },
  fontSize: {
    xs:    9,
    sm:    10,
    base:  13,
    md:    14,
    lg:    16,
    xl:    20,
    '2xl': 28,
    '3xl': 32,
    '4xl': 40,
  },
  lineHeight: {
    tight:  1.1,
    normal: 1.5,
    label:  1.3,
  },
  letterSpacing: {
    squeezed: -0.5,
    normal:    0,
    label:     0.5,
    wide:      1.2,
    widest:    2.0,
  },
} as const;

export type TypographyToken = typeof typography;
