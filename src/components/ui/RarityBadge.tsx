/**
 * RarityBadge — v3 Clean Modern
 *
 * Dot + label pill. 5px dot + uppercase label in rarity colour.
 * Soft tint background (rarity colour at 12% opacity). Fully rounded.
 * Glossy: pulsing dot + animated colour cycle (amber → pink → indigo).
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import type { AnimonRarity } from '../../types/animon';

const RARITY_LABELS: Record<AnimonRarity, string> = {
  common:   'COMMON',
  uncommon: 'UNCOMMON',
  rare:     'RARE',
  glossy:   'GLOSSY ✦',
};

interface RarityBadgeProps {
  rarity: AnimonRarity;
}

/** Convert 6-digit hex to rgba string */
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// Glossy animates through amber → pink → indigo
const GLOSSY_COLORS = ['#F59E0B', '#EC4899', '#6366F1', '#EC4899', '#F59E0B'];

export function RarityBadge({ rarity }: RarityBadgeProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (rarity === 'glossy') {
      progress.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1200 }),
          withTiming(0, { duration: 1200 }),
        ),
        -1,
        false,
      );
    }
  }, [rarity, progress]);

  const dotStyle = useAnimatedStyle(() => {
    if (rarity !== 'glossy') return {};
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 0.33, 0.66, 1],
        ['#F59E0B', '#EC4899', '#6366F1', '#F59E0B'],
      ),
    };
  });

  const textStyle = useAnimatedStyle(() => {
    if (rarity !== 'glossy') return {};
    return {
      color: interpolateColor(
        progress.value,
        [0, 0.33, 0.66, 1],
        ['#F59E0B', '#EC4899', '#6366F1', '#F59E0B'],
      ),
    };
  });

  const rarityDef = colors.rarity[rarity];
  const rarityColor = rarityDef.bg;
  const bgColor = hexToRgba(rarityColor, 0.12);

  return (
    <View style={[styles.pill, { backgroundColor: bgColor }]}>
      <Animated.View
        style={[
          styles.dot,
          rarity === 'glossy' ? dotStyle : { backgroundColor: rarityColor },
        ]}
      />
      <Animated.Text
        style={[
          styles.label,
          rarity === 'glossy' ? textStyle : { color: rarityColor },
        ]}
      >
        {RARITY_LABELS[rarity]}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 99,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 99,
  },
  label: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: 8,
    letterSpacing: typography.letterSpacing.wide,
  },
});