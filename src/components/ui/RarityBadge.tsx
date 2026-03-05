/**
 * RarityBadge â€” Field Naturalist Edition v2
 *
 * Museum accession stamp aesthetic: paper-fill (specimenCream) rather than
 * coloured background. Rarity colour lives only in the border and text.
 * Space Mono widest letterSpacing reads like a typewriter.
 * Asymmetric borderRadius (2/4/2/4) echoes hand-cut archival stickers.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import type { AnimonRarity } from '../../types/animon';

const RARITY_LABELS: Record<AnimonRarity, string> = {
  common:   'COMMON',
  uncommon: 'UNCOMMON',
  rare:     'RARE',
  glossy:   'GLOSSY âœ¦',
};

interface RarityBadgeProps {
  rarity: AnimonRarity;
  size?: 'sm' | 'md' | 'lg';
}

export function RarityBadge({ rarity, size = 'md' }: RarityBadgeProps) {
  const rarityColor = colors.rarity[rarity];

  const sizeStyle =
    size === 'sm' ? styles.badgeSm :
    size === 'lg' ? styles.badgeLg :
    styles.badgeMd;

  const labelSizeStyle =
    size === 'sm' ? styles.textSm :
    size === 'lg' ? styles.textLg :
    styles.textMd;

  return (
    <View
      style={[
        styles.badge,
        { borderColor: rarityColor },
        sizeStyle,
      ]}
    >
      <Text style={[styles.text, { color: rarityColor }, labelSizeStyle]}>
        {RARITY_LABELS[rarity]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.specimenCream,
    // Asymmetric corners â€” archival sticker feel
    borderTopLeftRadius: 2,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 2,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Size variants: sm / md / lg
  badgeSm: {
    height: 18,
    paddingHorizontal: 6,
  },
  badgeMd: {
    height: 23,
    paddingHorizontal: 8,
  },
  badgeLg: {
    height: 28,
    paddingHorizontal: 10,
  },

  // Shared text: Space Mono, widest letterSpacing, ALL CAPS (literal string)
  text: {
    fontFamily: typography.fontFamily.mono,
    letterSpacing: typography.letterSpacing.widest,
  },
  textSm: { fontSize: 9 },
  textMd: { fontSize: 10 },
  textLg: { fontSize: 12 },
});

