/**
 * Anílog Design Token — Typography v2
 *
 * Three font families, zero overlap in role assignment.
 *   heading / headingItalic / headingBold / headingBlack  → Playfair Display — scientific authority
 *   body / bodyMedium / bodyBold                          → DM Sans — approachable precision
 *   mono / monoBold                                       → Space Mono — typewritten label / data readout
 *
 * Italic variant: no separate italic font file is loaded. Apply fontStyle:'italic'
 * alongside headingItalic to get synthetic Playfair italic on the species name.
 */
export const typography = {
  fontFamily: {
    heading:       'PlayfairDisplay_400Regular',
    headingItalic: 'PlayfairDisplay_400Regular',   // always paired with fontStyle:'italic'
    headingBold:   'PlayfairDisplay_700Bold',
    headingBlack:  'PlayfairDisplay_900Black',
    body:          'DMSans_400Regular',
    bodyMedium:    'DMSans_500Medium',
    bodyBold:      'DMSans_700Bold',
    mono:          'SpaceMono_400Regular',
    monoBold:      'SpaceMono_700Bold',
  },
  fontSize: {
    xs:    10,  // accession numbers, micro labels
    sm:    11,  // specimen label strip primary, tab labels, chip text
    base:  13,  // secondary metadata, compact card species name
    md:    15,  // body text, description paragraphs
    lg:    17,  // card species name (full card), section sub-headings
    xl:    20,  // section headings, screen sub-title
    '2xl': 24,  // screen titles (Discover heading)
    '3xl': 28,  // large screen title
    '4xl': 36,  // hero species name (detail screen)
    '5xl': 48,  // (reserved — stat callout if needed)
  },
  lineHeight: {
    tight:   1.1,   // display headings, hero species
    heading: 1.25,  // section headings
    normal:  1.5,   // body text
    label:   1.3,   // mono labels, metadata
    relaxed: 1.75,  // capture notes paragraph text
  },
  letterSpacing: {
    squeezed: -0.5,  // large hero species name (tight tracking at 36px+)
    normal:    0,
    label:     0.5,  // mono data labels, chip text
    wide:      1.2,  // tab labels, section rule labels
    widest:    2.0,  // RarityBadge text, "SPECIMEN ID" header label
  },
} as const;

export type TypographyToken = typeof typography;
