/**
 * AchievementUnlockToast
 *
 * Animated banner that slides in from the top when an achievement is unlocked.
 * Stays visible for ~3 seconds then fades out.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import type { Achievement } from '../../constants/achievements';

interface Props {
  achievement: Achievement;
  visible: boolean;
  onHide: () => void;
}

export function AchievementUnlockToast({ achievement, visible, onHide }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-80)).current;

  useEffect(() => {
    if (!visible) return;

    opacity.setValue(0);
    translateY.setValue(-80);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity,     { toValue: 1,   duration: 280, useNativeDriver: true }),
        Animated.timing(translateY,  { toValue: 0,   duration: 280, useNativeDriver: true }),
      ]),
      Animated.delay(2400),
      Animated.parallel([
        Animated.timing(opacity,     { toValue: 0,   duration: 280, useNativeDriver: true }),
        Animated.timing(translateY,  { toValue: -80, duration: 280, useNativeDriver: true }),
      ]),
    ]).start(() => {
      onHide();
    });
  }, [visible, achievement.id]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <Text style={styles.emoji}>{achievement.emoji}</Text>
      <View style={styles.textBlock}>
        <Text style={styles.label}>Achievement Unlocked!</Text>
        <Text style={styles.title} numberOfLines={1}>{achievement.title}</Text>
      </View>
      <View style={[styles.tierPip, styles[`tier_${achievement.tier}`]]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    backgroundColor: colors.navDark,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 12,
  },
  emoji: {
    fontSize: 26,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.text3,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.md,
    color: colors.textInverse,
  },
  tierPip: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tier_Bronze:   { backgroundColor: '#CD7F32' },
  tier_Silver:   { backgroundColor: '#C0C0C0' },
  tier_Gold:     { backgroundColor: colors.rarity.glossy },
  tier_Platinum: { backgroundColor: '#E5E4E2' },
  tier_Diamond:  { backgroundColor: colors.rarity.rare },
});
