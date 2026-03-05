/**
 * AnimonCard â€” Field Naturalist Edition v2
 *
 * SIGNATURE ELEMENT: The "Typed Specimen Label Strip" at the base of every card.
 * Modelled on museum herbarium sheet labels â€” specimen name in Space Mono italic,
 * accession number right-aligned, type chips + region code below.
 *
 * Two variants:
 *   compact=false  Full grid card â€” 210px total, 65% image / 35% label strip
 *   compact=true   Horizontal carousel â€” 140px height, image left / data right
 *
 * Border treatment replaces floating shadows (card stock feel, not floating plastic):
 *   common   â†’ 1px inkRule
 *   uncommon â†’ 1.5px forestMid
 *   rare     â†’ 1px cobalt (double-rule via wrapper)
 *   glossy   â†’ animated LinearGradient shimmer border
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
import type { AnimonRarity } from '../../types/animon';

interface AnimonCardProps {
  animon: Animon;
  onPress?: (animon: Animon) => void;
  compact?: boolean;
}

/** Format animon.id as accession number: #-042 */
function accessionNumber(id: string): string {
  const n = parseInt(id, 10);
  if (!isNaN(n)) return `#-${String(n).padStart(3, '0')}`;
  return `#-${id.slice(-3).padStart(3, '0')}`;
}

/** Outer border style by rarity (non-glossy, non-rare) */
function outerBorderStyle(rarity: AnimonRarity): object {
  switch (rarity) {
    case 'uncommon':
      return { borderWidth: 1.5, borderColor: colors.forestMid };
    case 'rare':
      return { borderWidth: 1, borderColor: colors.rarity.rare };
    default:
      return { borderWidth: 1, borderColor: colors.inkRule };
  }
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
  }, [animon.rarity, shimmer]);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value,
  }));

  const accession = accessionNumber(animon.id);

  // â”€â”€ Compact card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (compact) {
    const inner = (
      <Pressable
        onPress={() => onPress?.(animon)}
        style={({ pressed }) => [
          styles.compactCard,
          outerBorderStyle(animon.rarity),
          pressed && styles.pressed,
        ]}
      >
        {/* Image panel â€” 42% width */}
        <View style={styles.compactImagePanel}>
          <Image
            source={{ uri: animon.photoUrl }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={200}
          />
          {/* Accession tag â€” museum sticker in top-right corner */}
          <View style={styles.compactAccessionTag}>
            <Text style={styles.compactAccessionText}>{accession}</Text>
          </View>
        </View>

        {/* Data panel â€” 58% width */}
        <View style={styles.compactDataPanel}>
          <Text style={styles.compactSpecies} numberOfLines={2}>
            {animon.species}
          </Text>
          <View style={styles.compactTags}>
            {animon.types.slice(0, 1).map((t) => (
              <TypeTagChip key={t} type={t} size="sm" />
            ))}
          </View>
          <View style={styles.compactFooter}>
            <RarityBadge rarity={animon.rarity} size="sm" />
            <Text style={styles.compactRegion} numberOfLines={1}>
              {animon.region}
            </Text>
          </View>
        </View>
      </Pressable>
    );

    if (animon.rarity === 'glossy') {
      return (
        <View style={styles.glossyOuterCompact}>
          <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
            <LinearGradient
              colors={['#C6882A', '#E8B455', '#D4A040', '#F5E4B5', '#C6882A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          <View style={styles.glossyInnerCompact}>
            {inner}
          </View>
        </View>
      );
    }

    if (animon.rarity === 'rare') {
      return (
        <View style={styles.rareOuterCompact}>
          {inner}
        </View>
      );
    }

    return inner;
  }

  // â”€â”€ Full grid card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const labelStripBg = animon.rarity === 'glossy'
    ? '#F2E8C8'  // slightly warmer cream for glossy â€” gold-leaf sizing reference
    : colors.cardStock;

  const innerCard = (
    <Pressable
      onPress={() => onPress?.(animon)}
      style={({ pressed }) => [
        styles.card,
        outerBorderStyle(animon.rarity),
        pressed && styles.pressed,
      ]}
    >
      {/* â”€â”€ Zone A: Image (65% of card height) â”€â”€ */}
      <View style={styles.imageZone}>
        <Image
          source={{ uri: animon.photoUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />
        {/* Rarity corner tab â€” archival sticker on folder edge */}
        {animon.rarity !== 'common' && (
          <View
            style={[
              styles.rarityCornerTab,
              { backgroundColor: colors.rarity[animon.rarity] },
            ]}
          />
        )}
      </View>

      {/* â”€â”€ Zone B: Specimen Label Strip (35% of card height) â”€â”€ */}
      <View style={[styles.labelStrip, { backgroundColor: labelStripBg }]}>
        {/* 1px horizontal rule â€” the separator line on the herbarium label */}
        <View style={styles.labelRule} />
        {/* Label content */}
        <View style={styles.labelContent}>
          {/* Row 1 â€” species name + accession number */}
          <View style={styles.labelRow1}>
            <Text
              style={styles.labelSpecies}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {animon.species}
            </Text>
            <Text style={styles.labelAccession}>{accession}</Text>
          </View>
          {/* Row 2 â€” type chips + region */}
          <View style={styles.labelRow2}>
            <View style={styles.labelTags}>
              {animon.types.slice(0, 2).map((t) => (
                <TypeTagChip key={t} type={t} size="sm" />
              ))}
            </View>
            <Text style={styles.labelRegion} numberOfLines={1}>
              {animon.region}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  // Glossy shimmer border wrapper
  if (animon.rarity === 'glossy') {
    return (
      <View style={styles.glossyOuter}>
        <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
          <LinearGradient
            colors={['#C6882A', '#E8B455', '#D4A040', '#F5E4B5', '#C6882A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <View style={styles.glossyInner}>
          {innerCard}
        </View>
      </View>
    );
  }

  // Rare double-rule border wrapper
  if (animon.rarity === 'rare') {
    return (
      <View style={styles.rareOuter}>
        {innerCard}
      </View>
    );
  }

  return innerCard;
}

const CARD_HEIGHT = 210;

const styles = StyleSheet.create({
  // â”€â”€ Full card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  card: {
    height: CARD_HEIGHT,
    borderRadius: 3,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },

  // Image zone â€” 65% of card height
  imageZone: {
    flex: 65,
    overflow: 'hidden',
    position: 'relative',
  },

  // Rarity corner tab â€” small colored sticker at top-left
  rarityCornerTab: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: 20,
  },

  // Specimen Label Strip â€” 35% of card height, cardStock background
  labelStrip: {
    flex: 35,
    flexDirection: 'column',
  },

  // 1px separator rule between image and label
  labelRule: {
    height: 1,
    backgroundColor: colors.inkRule,
  },

  // Label content â€” padded interior
  labelContent: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
    justifyContent: 'space-between',
  },

  // Row 1: species name (left) + accession number (right)
  labelRow1: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 4,
  },
  labelSpecies: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    fontStyle: 'italic',
    color: colors.inkBlack,
    flex: 1,
  },
  labelAccession: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.inkFaded,
    flexShrink: 0,
  },

  // Row 2: type chips (left) + region (right)
  labelRow2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  labelTags: {
    flexDirection: 'row',
    gap: 3,
    flex: 1,
    flexWrap: 'nowrap',
  },
  labelRegion: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.xs,
    color: colors.inkFaded,
    flexShrink: 0,
    maxWidth: '45%',
    textAlign: 'right',
  },

  // â”€â”€ Compact card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  compactCard: {
    height: 140,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: colors.cardStock,
  },

  // Image panel â€” 42% width, full height
  compactImagePanel: {
    width: '42%',
    height: 140,
    position: 'relative',
    overflow: 'hidden',
  },

  // Accession tag overlay â€” museum sticker in top-right corner of image
  compactAccessionTag: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(26,21,16,0.65)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 2,
  },
  compactAccessionText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 9,
    color: colors.amberFaint,
  },

  // Data panel â€” 58% width, full height
  compactDataPanel: {
    flex: 1,
    backgroundColor: colors.cardStock,
    borderLeftWidth: 1,
    borderLeftColor: colors.inkRule,
    padding: 8,
    justifyContent: 'space-between',
  },
  compactSpecies: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.base,
    fontStyle: 'italic',
    color: colors.inkBlack,
    lineHeight: typography.fontSize.base * typography.lineHeight.label,
  },
  compactTags: {
    flexDirection: 'row',
    gap: 3,
  },
  compactFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compactRegion: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.xs,
    color: colors.inkFaded,
    flex: 1,
    textAlign: 'right',
    marginLeft: 4,
  },

  // â”€â”€ Glossy shimmer border wrappers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  glossyOuter: {
    borderRadius: 5,
    overflow: 'hidden',
    padding: 2,
  },
  glossyInner: {
    borderRadius: 3,
    overflow: 'hidden',
  },
  glossyOuterCompact: {
    borderRadius: 5,
    overflow: 'hidden',
    padding: 2,
  },
  glossyInnerCompact: {
    borderRadius: 3,
    overflow: 'hidden',
  },

  // â”€â”€ Rare double-rule outer wrapper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  rareOuter: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(42,75,138,0.40)',
    overflow: 'hidden',
  },
  rareOuterCompact: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(42,75,138,0.40)',
    overflow: 'hidden',
  },
});


