/**
 * RarityBadge — v4
 *
 * Dot + label pill for four rarity tiers: Common, Uncommon, Rare, Super Rare.
 * Optional isGlossy flag adds an animated shimmer — a glossy can be any rarity.
 *
 * isGlossy=true: dot pulses through amber → pink → violet cycle.
 * Super Rare: violet, static.
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
  common:     'COMMON',
  uncommon:   'UNCOMMON',
  rare:       'RARE',
  super_rare: 'SUPER RARE',
};

interface RarityBadgeProps {
  rarity: AnimonRarity;
  isGlossy?: boolean;
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const SHIMMER = colors.glossyShimmer;

export function RarityBadge({ rarity, isGlossy = false }: RarityBadgeProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (isGlossy) {
      progress.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1200 }),
          withTiming(0, { duration: 1200 }),
        ),
        -1,
        false,
      );
    } else {
      progress.value = 0;
    }
  }, [isGlossy, progress]);

  const dotStyle = useAnimatedStyle(() => {
    if (!isGlossy) return {};
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 0.33, 0.66, 1],
        [SHIMMER[0], SHIMMER[1], SHIMMER[2], SHIMMER[0]],
      ),
    };
  });

  const textStyle = useAnimatedStyle(() => {
    if (!isGlossy) return {};
    return {
      color: interpolateColor(
        progress.value,
        [0, 0.33, 0.66, 1],
        [SHIMMER[0], SHIMMER[1], SHIMMER[2], SHIMMER[0]],
      ),
    };
  });

  const rarityDef  = colors.rarity[rarity];
  const rarityColor = rarityDef.bg;
  const bgColor     = hexToRgba(rarityColor, 0.12);

  return (
    <View style={[styles.pill, { backgroundColor: bgColor }]}>
      <Animated.View
        style={[
          styles.dot,
          isGlossy ? dotStyle : { backgroundColor: rarityColor },
        ]}
      />
      <Animated.Text
        style={[
          styles.label,
          isGlossy ? textStyle : { color: rarityColor },
        ]}
      >
        {RARITY_LABELS[rarity]}
        {isGlossy ? ' ✦' : ''}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 99,
  },
  label: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.micro,
    letterSpacing: typography.letterSpacing.label,
  },
});
