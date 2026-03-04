/**
 * RarityBadge
 *
 * Pill component showing rarity tier with colour coding.
 * Supports sm / md / lg sizes.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import type { AnimonRarity } from '../../types/animon';

const RARITY_LABELS: Record<AnimonRarity, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  glossy: '✨ Glossy',
};

interface RarityBadgeProps {
  rarity: AnimonRarity;
  size?: 'sm' | 'md' | 'lg';
}

export function RarityBadge({ rarity, size = 'md' }: RarityBadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: rarityBg(rarity), borderColor: colors.rarity[rarity] },
        size === 'sm' && styles.badgeSm,
        size === 'lg' && styles.badgeLg,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: rarityText(rarity) },
          size === 'sm' && styles.labelSm,
          size === 'lg' && styles.labelLg,
        ]}
      >
        {RARITY_LABELS[rarity]}
      </Text>
    </View>
  );
}

function rarityBg(rarity: AnimonRarity): string {
  switch (rarity) {
    case 'glossy':   return '#FFFBEB';
    case 'rare':     return '#EFF6FF';
    case 'uncommon': return '#ECFDF5';
    default:         return '#F3F4F6';
  }
}

function rarityText(rarity: AnimonRarity): string {
  return colors.rarity[rarity];
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeLg: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 24,
  },
  label: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.sm,
    letterSpacing: 0.3,
  },
  labelSm: {
    fontSize: typography.fontSize.xs,
  },
  labelLg: {
    fontSize: typography.fontSize.base,
  },
});
