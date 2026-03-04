/**
 * AnimonCard
 *
 * Core collectible card component. Two modes:
 *   compact=false  Full card — 16:9 image top, info below
 *   compact=true   Horizontal mini card — 80×80 thumbnail + text right
 *
 * Glossy rarity cards get an animated LinearGradient shimmer border.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { TypeTagChip } from './TypeTagChip';
import { RarityBadge } from './RarityBadge';
import type { Animon } from '../../types/animon';

interface AnimonCardProps {
  animon: Animon;
  onPress?: (animon: Animon) => void;
  compact?: boolean;
}

export function AnimonCard({ animon, onPress, compact = false }: AnimonCardProps) {
  const shimmer = useSharedValue(0.6);

  useEffect(() => {
    if (animon.rarity === 'glossy') {
      shimmer.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 900 }),
          withTiming(0.55, { duration: 900 }),
        ),
        -1,
        false,
      );
    }
  }, [animon.rarity]);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value,
  }));

  const cardContent = compact ? (
    <View style={styles.compactInner}>
      <Image
        source={{ uri: animon.photoUrl }}
        style={styles.imageCompact}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.compactInfo}>
        <Text style={styles.species} numberOfLines={1}>
          {animon.species}
        </Text>
        {animon.breed && (
          <Text style={styles.breed} numberOfLines={1}>
            {animon.breed}
          </Text>
        )}
        <View style={styles.tags}>
          {animon.types.slice(0, 2).map((type) => (
            <TypeTagChip key={type} type={type} size="sm" />
          ))}
        </View>
        <View style={styles.footer}>
          <RarityBadge rarity={animon.rarity} size="sm" />
          <Text style={styles.region} numberOfLines={1}>
            {animon.region}
          </Text>
        </View>
      </View>
    </View>
  ) : (
    <>
      <Image
        source={{ uri: animon.photoUrl }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.info}>
        <Text style={styles.species} numberOfLines={1}>
          {animon.species}
        </Text>
        {animon.breed && (
          <Text style={styles.breed} numberOfLines={1}>
            {animon.breed}
          </Text>
        )}
        <View style={styles.tags}>
          {animon.types.slice(0, 2).map((type) => (
            <TypeTagChip key={type} type={type} size="sm" />
          ))}
        </View>
        <View style={styles.footer}>
          <RarityBadge rarity={animon.rarity} size="sm" />
          <Text style={styles.region} numberOfLines={1}>
            📍 {animon.region}
          </Text>
        </View>
      </View>
    </>
  );

  const innerCard = (
    <Pressable
      onPress={() => onPress?.(animon)}
      style={({ pressed }) => [
        styles.card,
        compact && styles.cardCompact,
        pressed && styles.pressed,
      ]}
    >
      {cardContent}
    </Pressable>
  );

  if (animon.rarity === 'glossy') {
    return (
      <View style={[styles.glossyOuter, compact && styles.glossyOuterCompact]}>
        {/* Overflow-hidden container clips gradient to border radius */}
        <View style={[styles.glossyBorder, compact && styles.glossyBorderCompact]}>
          {/* Shimmering gradient fills behind the card as an absolute layer */}
          <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
            <LinearGradient
              colors={['#FFD700', '#FFA500', '#FFD700', '#FFFACD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          {/* Card content — normal flow sibling, sits on top unaffected by shimmer */}
          <View style={styles.glossyInner}>
            {innerCard}
          </View>
        </View>
      </View>
    );
  }

  return innerCard;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardCompact: {
    borderRadius: 12,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  // Full card image — 16:9
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  // Compact card
  compactInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageCompact: {
    width: 80,
    height: 80,
  },
  compactInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    gap: 4,
  },
  // Shared info
  info: {
    padding: 12,
    gap: 6,
  },
  species: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    lineHeight: typography.fontSize.md * 1.2,
  },
  breed: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  region: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    flex: 1,
    textAlign: 'right',
    marginLeft: 6,
  },
  // Glossy wrapper — two-layer: outer carries shadow, inner clips gradient
  glossyOuter: {
    borderRadius: 18,
    shadowColor: colors.rarity.glossy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  glossyOuterCompact: {
    borderRadius: 14,
  },
  glossyBorder: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  glossyBorderCompact: {
    borderRadius: 14,
  },
  // 2.5 px margin exposes the gradient border around the card content
  glossyInner: {
    margin: 2.5,
  },
});
