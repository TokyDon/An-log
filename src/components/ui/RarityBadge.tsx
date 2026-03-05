/**
 * RarityBadge
 *
 * Skeuomorphic embossed/stamped badge per rarity tier.
 * common   — inset stone stamp (no elevation)
 * uncommon — raised green field mark
 * rare     — raised cobalt expedition badge
 * glossy   — gold gradient trophy seal
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import type { AnimonRarity } from '../../types/animon';

const RARITY_LABELS: Record<AnimonRarity, string> = {
  common:   'COMMON',
  uncommon: 'UNCOMMON',
  rare:     'RARE',
  glossy:   'GLOSSY',
};

interface RarityBadgeProps {
  rarity: AnimonRarity;
  size?: 'sm' | 'md' | 'lg';
}

export function RarityBadge({ rarity, size = 'md' }: RarityBadgeProps) {
  const sizeStyle = size === 'sm' ? styles.badgeSm : size === 'lg' ? styles.badgeLg : styles.badgeMd;
  const labelStyle = size === 'sm' ? styles.labelSm : size === 'lg' ? styles.labelLg : styles.labelMd;

  if (rarity === 'glossy') {
    return (
      <LinearGradient
        colors={['#D4AF37', '#FFD700', '#B8860B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.badge,
          styles.badgeGlossy,
          sizeStyle,
        ]}
      >
        <Text style={[styles.label, styles.labelGlossy, labelStyle]}>{RARITY_LABELS[rarity]}</Text>
      </LinearGradient>
    );
  }

  return (
    <View
      style={[
        styles.badge,
        rarityContainerStyle(rarity),
        sizeStyle,
      ]}
    >
      <Text style={[styles.label, { color: rarityTextColor(rarity) }, labelStyle]}>
        {RARITY_LABELS[rarity]}
      </Text>
    </View>
  );
}

function rarityContainerStyle(rarity: AnimonRarity) {
  switch (rarity) {
    case 'uncommon': return styles.badgeUncommon;
    case 'rare':     return styles.badgeRare;
    default:         return styles.badgeCommon;
  }
}

function rarityTextColor(rarity: AnimonRarity): string {
  switch (rarity) {
    case 'uncommon': return '#2D7A3A';
    case 'rare':     return '#2A5B9E';
    default:         return '#8B8577';
  }
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Sizes
  badgeSm: {
    height: 18,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  badgeMd: {
    height: 22,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  badgeLg: {
    height: 28,
    paddingHorizontal: 14,
    borderRadius: 7,
  },
  // Rarity variants
  badgeCommon: {
    backgroundColor: '#E8E4DC',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  badgeUncommon: {
    backgroundColor: '#D6EDDA',
    borderWidth: 1,
    borderColor: '#A8D4B0',
    shadowColor: '#2D7A3A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.30,
    shadowRadius: 3,
    elevation: 2,
  },
  badgeRare: {
    backgroundColor: '#D6E4F5',
    borderWidth: 1,
    borderColor: '#A8C4E0',
    shadowColor: '#2A5B9E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 2,
  },
  badgeGlossy: {
    borderWidth: 1.5,
    borderColor: '#8B6914',
    shadowColor: '#B8860B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.50,
    shadowRadius: 5,
    elevation: 4,
  },
  // Labels
  label: {
    fontFamily: typography.fontFamily.bodyBold,
    letterSpacing: 0.5,
  },
  labelSm: { fontSize: 10 },
  labelMd: { fontSize: 12 },
  labelLg: { fontSize: 13 },
  labelGlossy: { color: '#3D2B00' },
});
