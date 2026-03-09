/**
 * Milestones Tab — Naturalist Field Journal v2
 *
 * Dark forestFloor header, parchment gauge panel, cardStock rarity cells,
 * parchment achievement cards with tier accent stripes.
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { RarityBadge } from '../../components/ui/RarityBadge';
import { useCollection } from '../../features/collection/useCollection';
import { useAchievementStore } from '../../store/achievementStore';
import { ACHIEVEMENTS } from '../../constants/achievements';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOTAL_SPECIES_TARGET = 100;

const TIER_COLORS: Record<string, string> = {
  Bronze:   colors.text3,
  Silver:   colors.text2,
  Gold:     colors.rarity.uncommon,
  Platinum: '#E5E4E2',
  Diamond:  colors.rarity.rare,
};

function SectionRule({ label }: { label: string }) {
  return (
    <View style={sectionRuleStyles.wrap}>
      <View style={sectionRuleStyles.line} />
      <Text style={sectionRuleStyles.label}>{label}</Text>
      <View style={sectionRuleStyles.line} />
    </View>
  );
}

const sectionRuleStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 10,
  },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  label: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.text3,
    letterSpacing: typography.letterSpacing.widest,
    textTransform: 'uppercase',
  },
});

export default function MilestonesScreen() {
  const { data: animons = [] } = useCollection();
  const isUnlocked = useAchievementStore((s) => s.isUnlocked);

  const uniqueSpecies = new Set(animons.map((a) => a.species)).size;
  const progressPct = Math.min(uniqueSpecies / TOTAL_SPECIES_TARGET, 1);

  const rarityData = [
    { rarity: 'common'   as const, label: 'Common',   count: animons.filter((a) => a.rarity === 'common').length,   target: 20 },
    { rarity: 'uncommon' as const, label: 'Uncommon', count: animons.filter((a) => a.rarity === 'uncommon').length, target: 10 },
    { rarity: 'rare'     as const, label: 'Rare',     count: animons.filter((a) => a.rarity === 'rare').length,     target: 5  },
    { rarity: 'glossy'   as const, label: 'Glossy',   count: animons.filter((a) => a.rarity === 'glossy').length,   target: 1  },
  ];

  const uniqueRegions = new Set(animons.map((a) => a.region).filter(Boolean)).size;

  // Map ACHIEVEMENTS constant to display objects with live unlocked state
  const achievements = ACHIEVEMENTS.map((a) => ({
    ...a,
    unlocked: isUnlocked(a.id),
  }));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Dark header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.wordmark}>ANÍLOG</Text>
            <Text style={styles.screenTitle}>Logbook</Text>
          </View>
          <View style={styles.specimenBadge}>
            <Text style={styles.specimenBadgeText}>
              {uniqueSpecies}/{TOTAL_SPECIES_TARGET} SPECIES
            </Text>
          </View>
        </View>

        {/* ── Species progress gauge ── */}
        <View style={styles.gaugePanel}>
          <View style={styles.gaugeLabelRow}>
            <Text style={styles.gaugeLabel}>ANÍMON COLLECTOR</Text>
            <Text style={styles.gaugeFraction}>{uniqueSpecies} / {TOTAL_SPECIES_TARGET}</Text>
          </View>
          <View style={styles.gaugeTrack}>
            <View style={[styles.gaugeFill, { width: `${progressPct * 100}%` as any }]} />
          </View>
          <Text style={styles.gaugePct}>{Math.round(progressPct * 100)}% COMPLETE</Text>
        </View>

        {/* ── Rarity breakdown grid ── */}
        <SectionRule label="RARITY COLLECTION" />
        <View style={styles.rarityGrid}>
          {rarityData.map((r) => (
            <View key={r.rarity} style={styles.rarityCell}>
              <RarityBadge rarity={r.rarity} />
              <Text style={[styles.rarityCount, { color: colors.rarity[r.rarity] }]}>
                {r.count}
              </Text>
              <Text style={styles.rarityLabel}>SPECIMENS</Text>
            </View>
          ))}
        </View>

        {/* ── Achievement cards ── */}
        <View style={{ marginTop: 8 }}>
          <SectionRule label="ACHIEVEMENTS" />
        </View>
        <View style={styles.achievementList}>
          {achievements.map((a) => {
            const accentColor = TIER_COLORS[a.tier];
            return (
              <View
                key={a.id}
                style={[
                  styles.achievementCard,
                  !a.unlocked && styles.achievementLocked,
                ]}
              >
                {/* Left accent stripe */}
                <View
                  style={[
                    styles.achievementStripe,
                    { backgroundColor: a.unlocked ? accentColor : '#6B6B6B' },
                  ]}
                />
                {/* Content */}
                <Text style={styles.achievementSymbol}>{a.unlocked ? '◆' : '◇'}</Text>
                <View style={styles.achievementText}>
                  <Text style={[styles.achievementTitle, !a.unlocked && styles.dimText]}>
                    {a.title}
                  </Text>
                  <Text style={styles.achievementDesc}>{a.description}</Text>
                </View>
                {a.unlocked && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: { paddingBottom: 16 },

  // Dark header
  header: {
    backgroundColor: colors.navDark,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  wordmark: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.text3,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  screenTitle: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize['3xl'],
    color: colors.textInverse,
    lineHeight: typography.fontSize['3xl'] * typography.lineHeight.tight,
  },
  specimenBadge: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  specimenBadgeText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.accent,
    letterSpacing: typography.letterSpacing.label,
  },

  // Progress gauge
  gaugePanel: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: colors.surface,
    borderRadius: 4,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gaugeLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  gaugeLabel: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.sm,
    color: colors.text2,
    letterSpacing: typography.letterSpacing.label,
    textTransform: 'uppercase',
  },
  gaugeFraction: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.text2,
  },
  gaugeTrack: {
    height: 8,
    borderRadius: 2,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  gaugeFill: {
    height: 8,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
  gaugePct: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.text3,
    marginTop: 8,
    textAlign: 'right',
    letterSpacing: 1,
  },

  // Rarity grid — cardStock cells
  rarityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  rarityCell: {
    flex: 1,
    minWidth: (SCREEN_WIDTH - 52) / 2,
    backgroundColor: colors.surface2,
    borderRadius: 3,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  rarityCount: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize['4xl'],
    marginTop: 8,
  },
  rarityLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: 10,
    textTransform: 'uppercase',
    color: colors.text3,
    marginTop: 4,
    letterSpacing: 1,
  },

  // Achievement cards — parchment
  achievementList: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 8,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
    paddingVertical: 14,
    paddingLeft: 22,
    paddingRight: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  achievementLocked: { opacity: 0.45 },
  achievementStripe: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 4,
  },
  achievementSymbol: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 28,
    color: colors.text2,
  },
  achievementText: { flex: 1, gap: 2 },
  achievementTitle: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.base,
    color: colors.text1,
  },
  dimText: { color: colors.text3 },
  achievementDesc: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text2,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 2,
    backgroundColor: colors.navDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: colors.textInverse,
    fontSize: 12,
    fontFamily: typography.fontFamily.bodyBold,
  },
});
