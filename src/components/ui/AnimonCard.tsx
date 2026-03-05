/**
 * AnimonCard
 *
 * Skeuomorphic collectible card — BioField Scanner MK-II design language.
 * Two modes:
 *   compact=false  Full grid card — fixed 210px total height
 *   compact=true   Horizontal index-card carousel — FIXED 140px height
 *
 * Glossy rarity cards get an animated LinearGradient shimmer border.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
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
import { TYPE_DEFINITIONS } from '../../constants/typeSystem';
import type { Animon } from '../../types/animon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

  // Type tint colour for image footer
  const primaryTypeDef = animon.types[0] ? TYPE_DEFINITIONS[animon.types[0]] : null;

  const cardContent = compact ? (
    <View style={styles.compactInner}>
      <Image
        source={{ uri: animon.photoUrl }}
        style={styles.imageCompact}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.compactInfo}>
        <Text style={styles.speciesCompact} numberOfLines={2}>
          {animon.species}
        </Text>
        <View style={styles.tags}>
          {animon.types.slice(0, 1).map((type) => (
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
      {/* Image area — fixed 120px */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: animon.photoUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        {/* Type-tint gradient on image bottom */}
        {primaryTypeDef && (
          <View
            style={[
              styles.imageTint,
              { backgroundColor: primaryTypeDef.color },
            ]}
          />
        )}
      </View>
      {/* Info area — fixed 90px */}
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
            {animon.region}
          </Text>
        </View>
      </View>
    </>
  );

  const innerCard = (
    <Pressable
      onPress={() => onPress?.(animon)}
      style={({ pressed }) => [
        compact ? styles.cardCompact : styles.card,
        pressed && (compact ? styles.pressedCompact : styles.pressed),
      ]}
    >
      {cardContent}
    </Pressable>
  );

  if (animon.rarity === 'glossy') {
    return (
      <View style={[styles.glossyOuter, compact && styles.glossyOuterCompact]}>
        <View style={[styles.glossyBorder, compact && styles.glossyBorderCompact]}>
          <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
            <LinearGradient
              colors={['#B8860B', '#FFD700', '#D4A017', '#FFFACD', '#B8860B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
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
  // ── Full grid card (compact=false) ────────────────────────────────────────
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: 16,
    overflow: 'hidden',
    // Raised multi-layer shadow
    shadowColor: '#1A0F00',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.30,
    shadowRadius: 10,
    elevation: 10,
    // Inner bevel borders
    borderWidth: 1,
    borderTopColor: '#FFFFFF',
    borderLeftColor: '#FFFFFF',
    borderBottomColor: '#B8AD96',
    borderRightColor: '#B8AD96',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    shadowOpacity: 0.15,
    elevation: 4,
  },
  // Image area — fixed 120px
  imageWrapper: {
    height: 120,
    overflow: 'hidden',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  image: {
    width: '100%',
    height: 120,
  },
  imageTint: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 32,
    opacity: 0.22,
  },
  // Info area — fixed 90px
  info: {
    height: 90,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  species: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    lineHeight: typography.fontSize.base * 1.2,
  },
  breed: {
    fontFamily: typography.fontFamily.body,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // ── Compact carousel card (compact=true) ──────────────────────────────────
  cardCompact: {
    height: 140,
    overflow: 'hidden',
    flexDirection: 'row',
    borderRadius: 14,
    backgroundColor: colors.surfaceCard,
    // Raised shadow
    shadowColor: '#1A0F00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 7,
    elevation: 7,
    borderWidth: 1,
    borderColor: '#E0D8C8',
    borderTopColor: '#F5EDD8',
  },
  pressedCompact: {
    transform: [{ scale: 0.97 }],
    shadowOpacity: 0.10,
    elevation: 3,
  },
  compactInner: {
    flexDirection: 'row',
    height: 140,
  },
  imageCompact: {
    width: 80,
    height: 80,
    borderRadius: 10,
    margin: 10,
    alignSelf: 'center',
  },
  compactInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    gap: 6,
  },
  speciesCompact: {
    fontFamily: typography.fontFamily.heading,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 18,
  },

  // ── Shared ────────────────────────────────────────────────────────────────
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  region: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    flex: 1,
    textAlign: 'right',
    marginLeft: 6,
  },

  // ── Glossy shimmer border wrapper ─────────────────────────────────────────
  glossyOuter: {
    borderRadius: 18,
    shadowColor: colors.rarity.glossy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  glossyOuterCompact: {
    borderRadius: 16,
    height: 140,
  },
  glossyBorder: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  glossyBorderCompact: {
    borderRadius: 16,
  },
  glossyInner: {
    margin: 2.5,
  },
});
