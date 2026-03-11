/**
 * Party Tab — v3 Flutter-style
 *
 * 5-slot party grid.
 * Occupied: full type-color card, large photo, decorative ring, DM Serif name.
 * Empty: clean invite card with slot labelling.
 *
 * Accessibility:
 *   - Cards Pressable with accessibilityRole + accessibilityLabel
 *   - Touch targets ≥ 44pt (minHeight: 116)
 *   - Type color NOT the sole state indicator — also text + position
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { usePartyStore, PARTY_SIZE } from '../../store/partyStore';
import { TypeTagChip } from '../../components/ui/TypeTagChip';
import { getTypeDefinition } from '../../constants/typeSystem';
import type { PartySlot } from '../../types/party';

// ─── Empty slot ──────────────────────────────────────────────────────────────

function EmptyCard({ slotIndex }: { slotIndex: number }) {
  return (
    <View
      style={styles.emptyCard}
      accessible
      accessibilityLabel={`Slot ${slotIndex + 1} empty`}
    >
      <View style={styles.emptyPhotoBox}>
        <Text style={styles.emptyPlus}>+</Text>
      </View>
      <View style={styles.emptyInfo}>
        <Text style={styles.emptyLabel}>SLOT {slotIndex + 1}</Text>
        <Text style={styles.emptySub}>No companion here yet.</Text>
      </View>
    </View>
  );
}

// ─── Occupied slot ───────────────────────────────────────────────────────────

function PartyCard({ slot, slotIndex }: { slot: PartySlot; slotIndex: number }) {
  const { animon } = slot;
  const def = getTypeDefinition(animon.types[0]);
  const typeColor = def.color;
  const textColor = def.textColor;
  const textAlpha = textColor === '#FFFFFF'
    ? 'rgba(255,255,255,0.65)'
    : 'rgba(15,23,42,0.60)';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: typeColor,
          shadowColor: typeColor,
          opacity: pressed ? 0.88 : 1,
          transform: [{ scale: pressed ? 0.975 : 1 }],
        },
      ]}
      onPress={() => router.push(`/animon/${animon.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`${animon.species}, ${def.label} type, level ${animon.level}`}
    >
      {/* Decorative ring */}
      <View style={styles.decorRing} />

      {/* Photo */}
      <View style={styles.photoWrap}>
        {animon.photoUrl ? (
          <Image
            source={{ uri: animon.photoUrl }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={250}
          />
        ) : (
          <View style={styles.photoFallback}>
            <Text style={[styles.photoEmoji, { color: textColor }]}>◈</Text>
          </View>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.20)']}
          start={{ x: 0.6, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Text info */}
      <View style={styles.cardInfo}>
        <View style={[styles.levelBadge, { backgroundColor: 'rgba(0,0,0,0.22)' }]}>
          <Text style={[styles.levelText, { color: textColor }]}>Lv.{animon.level}</Text>
        </View>
        <Text style={[styles.speciesName, { color: textColor }]} numberOfLines={2}>
          {animon.species}
        </Text>
        {animon.nickname && animon.nickname !== animon.species && (
          <Text style={[styles.nickname, { color: textAlpha }]} numberOfLines={1}>
            "{animon.nickname}"
          </Text>
        )}
        <View style={styles.chipRow}>
          {animon.types.slice(0, 2).map((t) => (
            <TypeTagChip key={t} type={t} size="sm" onCard />
          ))}
        </View>
      </View>
    </Pressable>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function PartyScreen() {
  const { slots } = usePartyStore();
  const filled = slots.filter(Boolean).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.wordmark}>ANÍLOG</Text>
          <Text style={styles.screenTitle}>Your companions.</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{filled}/{PARTY_SIZE}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {slots.map((slot, index) =>
          slot ? (
            <PartyCard key={index} slot={slot} slotIndex={index} />
          ) : (
            <EmptyCard key={index} slotIndex={index} />
          )
        )}
        {filled < PARTY_SIZE && (
          <Text style={styles.hint}>
            Your party is quiet. Head out and find your next companion.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const PHOTO_SIZE = 88;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },

  header: {
    backgroundColor: colors.bg,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  wordmark: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.xs,
    letterSpacing: typography.letterSpacing.widest,
    color: colors.text3,
    marginBottom: 4,
  },
  screenTitle: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.xl,
    color: colors.text1,
    lineHeight: typography.fontSize.xl * typography.lineHeight.tight,
  },
  badge: {
    backgroundColor: colors.surface2,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.sm,
    color: colors.text2,
    letterSpacing: typography.letterSpacing.label,
  },

  scroll: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 40 },

  // ── Occupied card ──────────────────────────────────────────────────────────
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 10,
    minHeight: 116,
  },
  decorRing: {
    position: 'absolute',
    top: -44,
    right: -44,
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 26,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  photoWrap: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.15)',
    flexShrink: 0,
  },
  photoFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoEmoji: { fontSize: 32, opacity: 0.4 },
  cardInfo: {
    flex: 1,
    paddingLeft: 14,
    gap: 5,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginBottom: 2,
  },
  levelText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.xs,
    letterSpacing: typography.letterSpacing.label,
  },
  speciesName: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.lg,
    lineHeight: typography.fontSize.lg * typography.lineHeight.tight,
  },
  nickname: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontStyle: 'italic',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 2,
    flexWrap: 'nowrap',
  },

  // ── Empty card ────────────────────────────────────────────────────────────
  emptyCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: colors.surface,
    minHeight: 116,
  },
  emptyPhotoBox: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 12,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emptyPlus: {
    fontSize: 28,
    color: colors.text3,
    lineHeight: 32,
    fontFamily: typography.fontFamily.body,
  },
  emptyInfo: { paddingLeft: 14, gap: 4 },
  emptyLabel: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.xs,
    color: colors.text3,
    letterSpacing: typography.letterSpacing.widest,
  },
  emptySub: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text3,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },

  hint: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text3,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
    paddingHorizontal: 24,
    marginTop: 8,
  },
});
