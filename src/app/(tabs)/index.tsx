/**
 * Party Tab — Your chosen Anímons
 *
 * Shows the trainer's 6-slot party.
 * Occupied slots display: photo thumbnail, nickname, species, level badge.
 * Empty slots display a dashed "+" invite.
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { usePartyStore, PARTY_SIZE } from '../../store/partyStore';
import { TypeTagChip } from '../../components/ui/TypeTagChip';
import { getTypeDefinition } from '../../constants/typeSystem';
import type { PartySlot } from '../../types/party';

const CARD_PHOTO_SIZE = 72;

// ─── Sub-components ──────────────────────────────────────────────────────────

interface PartyCardProps {
  slot: PartySlot | null;
  slotIndex: number;
}

function EmptyCard({ slotIndex }: { slotIndex: number }) {
  return (
    <View style={styles.emptyCard}>
      <View style={styles.emptyPhotoPlaceholder}>
        <Text style={styles.emptyPlus}>+</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.emptySlotLabel}>SLOT {slotIndex + 1}</Text>
        <Text style={styles.emptySlotSub}>No companion here yet.</Text>
      </View>
    </View>
  );
}

function PartyCard({ slot, slotIndex }: PartyCardProps) {
  if (!slot) {
    return <EmptyCard slotIndex={slotIndex} />;
  }

  const { animon } = slot;
  const def = getTypeDefinition(animon.types[0]);
  const typeColor = def.color;
  const textColor = def.textColor;
  const textAlpha65 = textColor === '#FFFFFF' ? 'rgba(255,255,255,0.65)' : 'rgba(15,23,42,0.65)';
  const levelBadgeBg = textColor === '#FFFFFF' ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.10)';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.occupiedCard,
        { backgroundColor: typeColor, shadowColor: typeColor },
        pressed && { opacity: 0.85 }
      ]}
      onPress={() => router.push(`/animon/${animon.id}`)}
    >
      <View style={styles.cardInner}>
        <View style={styles.photoWrap}>
          <Image
            source={{ uri: animon.photoUrl }}
            style={styles.photo}
            resizeMode="cover"
          />
          <View style={[styles.typeAccentBar, { backgroundColor: typeColor }]} />
        </View>
        <View style={styles.cardInfo}>
          <View style={styles.cardInfoTop}>
            <Text style={[styles.nickname, { color: textColor }]} numberOfLines={1}>{animon.nickname}</Text>
            <View style={[styles.levelBadge, { backgroundColor: levelBadgeBg, borderWidth: 0 }]}>
              <Text style={[styles.levelText, { color: textColor }]}>Lv.{animon.level}</Text>
            </View>
          </View>
          <Text style={[styles.species, { color: textAlpha65 }]} numberOfLines={1}>{animon.species}</Text>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 2 }}>
            {animon.types.slice(0, 2).map((t) => (
              <TypeTagChip key={t} type={t} size="sm" onCard />
            ))}
          </View>
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
      {/* ── Dark header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.wordmark}>ANÍLOG</Text>
          <Text style={styles.screenTitle}>Your companions.</Text>
        </View>
        <View style={styles.partyBadge}>
          <Text style={styles.partyBadgeText}>{filled}/{PARTY_SIZE}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {slots.map((slot, index) => (
          <PartyCard key={index} slot={slot} slotIndex={index} />
        ))}

        {filled < PARTY_SIZE && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Your party is quiet. Head out and find your next companion.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  // ── Header ─────────────────────────────────────────────────────────────────
  header: {
    backgroundColor: colors.bg,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 22,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  wordmark: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
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
  partyBadge: {
    backgroundColor: colors.surface2,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  partyBadgeText: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.sm,
    color: colors.text2,
    letterSpacing: typography.letterSpacing.wide,
  },

  // ── Scroll ─────────────────────────────────────────────────────────────────
  scroll: { flex: 1, backgroundColor: colors.bg },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
    backgroundColor: colors.bg,
  },

  // ── Shared card ─────────────────────────────────────────────────────────────
  cardInfo: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: 'center',
    gap: 5,
  },

  // ── Occupied card ───────────────────────────────────────────────────────────
  occupiedCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'stretch',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  photo: {
    width: CARD_PHOTO_SIZE,
    height: CARD_PHOTO_SIZE,
    backgroundColor: colors.surface2,
    borderRadius: 8,
  },
  photoWrap: {
    width: CARD_PHOTO_SIZE,
    height: CARD_PHOTO_SIZE,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.surface2,
  },
  typeAccentBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  cardInfoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nickname: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.base,
    flex: 1,
  },
  levelBadge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  levelText: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.xs,
    color: colors.text2,
    letterSpacing: typography.letterSpacing.wide,
  },
  species: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    letterSpacing: typography.letterSpacing.label,
  },
  // ── Empty slot card ────────────────────────────────────────────────────────────────────────
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    overflow: 'hidden',
  },
  emptyPhotoPlaceholder: {
    width: CARD_PHOTO_SIZE,
    height: CARD_PHOTO_SIZE,
    borderRadius: 10,
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPlus: {
    fontFamily: typography.fontFamily.body,
    fontSize: 28,
    color: colors.text3,
    lineHeight: 32,
  },
  emptySlotLabel: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.xs,
    color: colors.text3,
    letterSpacing: typography.letterSpacing.widest,
  },
  emptySlotSub: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    color: colors.text3,
    marginTop: 2,
  },

  // ── Footer ─────────────────────────────────────────────────────────────────
  footer: {
    marginTop: 8,
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text3,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: typography.fontSize.sm * 1.6,
  },
});

