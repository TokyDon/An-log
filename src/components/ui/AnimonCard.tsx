/**
 * AnimonCard — v3 Clean Modern
 *
 * Signature: Dark Footer Strip (navDark background).
 * Type-derived gradient image area. White text in footer.
 *
 * Variants:
 *   compact=false  Full card — 220px height
 *   compact=true   Compact card — 150px height
 *
 * showPhoto prop: if true renders animon.photoUrl; defaults false (type gradient + emoji).
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '../../constants/colors';
import { TYPE_DEFINITIONS } from '../../constants/typeSystem';
import { typography } from '../../constants/typography';
import { TypeTagChip } from './TypeTagChip';
import { RarityBadge } from './RarityBadge';
import type { Animon } from '../../types/animon';
import type { AnimonType } from '../../types/animon';

interface AnimonCardProps {
  animon: Animon;
  onPress?: (animon: Animon) => void;
  compact?: boolean;
  showPhoto?: boolean;
}

/** Format animon.id as accession number: #-042 */
function accessionNumber(id: string): string {
  const n = parseInt(id, 10);
  if (!isNaN(n)) return `#-${String(n).padStart(3, '0')}`;
  return `#-${id.slice(-3).padStart(3, '0')}`;
}

/** Placeholder emoji per type for AI art area */
function getTypeEmoji(primaryType: AnimonType): string {
  const map: Record<AnimonType, string> = {
    fire: '🔥', water: '💧', grass: '🌿', electric: '⚡',
    ice: '❄️', dragon: '🐉', psychic: '🔮', bug: '🐛',
    steel: '⚙️', ground: '🏔️', rock: '🪨', light: '✨',
  };
  return map[primaryType] ?? '◈';
}

export function AnimonCard({ animon, onPress, compact = false, showPhoto = true }: AnimonCardProps) {
  const primaryType = animon.types[0];
  const def = TYPE_DEFINITIONS[primaryType];
  const typeColor = def.color;
  const textColor = def.textColor;
  const textAlpha65 = textColor === '#FFFFFF' ? 'rgba(255,255,255,0.65)' : 'rgba(15,23,42,0.65)';
  const textAlpha50 = textColor === '#FFFFFF' ? 'rgba(255,255,255,0.50)' : 'rgba(15,23,42,0.50)';
  const cardShadow = {
    shadowColor: typeColor,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  };
  const accession = accessionNumber(animon.id);

  // ── Image area content ─────────────────────────────────────────────────────
  const imageArea = (
    <View style={compact ? styles.compactImageArea : styles.imageArea}>
      {showPhoto && animon.photoUrl && (
        <Image
          source={{ uri: animon.photoUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />
      )}
      {/* Placeholder emoji — low opacity AI art stand-in */}
      {(!showPhoto || !animon.photoUrl) && (
        <Text style={compact ? styles.compactEmoji : styles.emoji}>
          {getTypeEmoji(primaryType)}
        </Text>
      )}
      {/* Rarity pill — top right */}
      <View style={styles.rarityPill}>
        <RarityBadge rarity={animon.rarity} />
      </View>
    </View>
  );

  if (compact) {
    return (
      <Pressable
        onPress={() => onPress?.(animon)}
        style={({ pressed }) => [styles.compactCard, { backgroundColor: typeColor, ...cardShadow }, pressed && styles.pressed]}
      >
        {imageArea}
        {/* Compact footer — same type color */}
        <View style={[styles.compactFooter, { backgroundColor: typeColor }]}>
          <Text style={[styles.compactName, { color: textColor }]} numberOfLines={1}>
            {animon.species}
          </Text>
          <View style={styles.compactChips}>
            {animon.types.slice(0, 1).map((t) => (
              <TypeTagChip key={t} type={t} size="sm" onCard />
            ))}
          </View>
        </View>
      </Pressable>
    );
  }

  // Full card
  return (
    <Pressable
      onPress={() => onPress?.(animon)}
      style={({ pressed }) => [styles.card, { backgroundColor: typeColor, ...cardShadow }, pressed && styles.pressed]}
    >
      {imageArea}
      {/* Footer — same type color */}
      <View style={[styles.footer, { backgroundColor: typeColor }]}>
        <View style={styles.footerLeft}>
          <Text style={[styles.footerName, { color: textColor }]} numberOfLines={1}>
            {animon.species}
          </Text>
          <Text style={[styles.footerSpecies, { color: textAlpha65 }]} numberOfLines={1}>
            {animon.breed ?? animon.species}
          </Text>
          <View style={styles.footerChips}>
            {animon.types.slice(0, 2).map((t) => (
              <TypeTagChip key={t} type={t} size="sm" onCard />
            ))}
          </View>
        </View>
        <View style={styles.footerRight}>
          <Text style={[styles.footerAccession, { color: textAlpha50 }]}>{accession}</Text>
          <Text style={[styles.footerRegion, { color: textAlpha50 }]} numberOfLines={1}>
            {animon.region}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const CARD_HEIGHT = 220;
const COMPACT_HEIGHT = 150;
const FOOTER_HEIGHT = 72;
const COMPACT_FOOTER_HEIGHT = 40;

const styles = StyleSheet.create({
  // ── Full card ──────────────────────────────────────────────────────────────
  card: {
    height: CARD_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.95,
  },
  imageArea: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emoji: {
    fontSize: 52,
    opacity: 0.30,
  },
  rarityPill: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  footer: {
    height: FOOTER_HEIGHT,
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  footerLeft: {
    flex: 1,
    gap: 2,
  },
  footerName: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.md,
    lineHeight: typography.fontSize.md * typography.lineHeight.label,
  },
  footerSpecies: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.fontSize.xs * typography.lineHeight.label,
  },
  footerChips: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
    flexWrap: 'nowrap',
  },
  footerRight: {
    alignItems: 'flex-end',
    gap: 2,
    paddingLeft: 8,
  },
  footerAccession: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    letterSpacing: typography.letterSpacing.label,
  },
  footerRegion: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    maxWidth: 90,
    textAlign: 'right',
  },

  // ── Compact card ───────────────────────────────────────────────────────────
  compactCard: {
    height: COMPACT_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  compactImageArea: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  compactEmoji: {
    fontSize: 34,
    opacity: 0.30,
  },
  compactFooter: {
    height: COMPACT_FOOTER_HEIGHT,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 3,
  },
  compactName: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * typography.lineHeight.label,
  },
  compactChips: {
    flexDirection: 'row',
    gap: 3,
  },
});